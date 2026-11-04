import dns from 'node:dns/promises'
import net from 'node:net'
import { InstanceStatus } from '@companion-module/base'
import type { OSCMessage } from 'osc'
import { BuildMessage } from './api.js'
import type { ModuleConfig } from './config.js'
import type OBSBOTInstance from './main.js'
import { OSCTCPPort } from './tcp.js'
import type { OSCTransport } from './transport.js'
import { UDPPort } from './udp.js'

export type ConnectionHost = Pick<
	OBSBOTInstance,
	'config' | 'log' | 'updateStatus' | 'createSharedUdpSocket' | 'handleReply' | 'pollDeviceState'
>

const ReconnectDelayMin = 1000
const ReconnectDelayMax = 30000
const WatchdogInterval = 5000
const SilenceTimeout = 15000

const ConnectedAddress: OSCAddress = '/OBSBOT/WebCam/General/Connected'
const ConnectedReplyAddress: OSCAddress = '/OBSBOT/WebCam/General/ConnectedResp'

function getConfigProblem({ ip, port, listenport, transport }: ModuleConfig): string | undefined {
	if (!ip?.trim()) return 'Device IP Address is not set'
	if (!(port >= 1 && port <= 65535)) return 'Port is not valid'
	if (transport === 'udp' && !(listenport >= 1 && listenport <= 65535)) return 'Listen Port is not valid'
	return undefined
}

/** Owns the socket and every timer, so that one place decides when to give up, retry and report */
export class Connection {
	readonly #host: ConnectionHost
	#transport: OSCTransport | undefined
	#pollTimer: NodeJS.Timeout | undefined
	#watchdogTimer: NodeJS.Timeout | undefined
	#reconnectTimer: NodeJS.Timeout | undefined
	// Bumped whenever the current attempt ends, so an attempt waiting on DNS can tell it was superseded
	#generation = 0
	#resolvedIp: string | undefined
	#lastMessageAt = 0
	#reconnectDelay = ReconnectDelayMin
	#acknowledged = false
	#status: InstanceStatus | undefined
	#statusMessage: string | undefined
	#reportedFailure: string | undefined

	constructor(host: ConnectionHost) {
		this.#host = host
	}

	async connect(): Promise<void> {
		this.#teardown(true)
		this.#reconnectDelay = ReconnectDelayMin
		this.#reportedFailure = undefined
		this.#setStatus(InstanceStatus.Connecting)

		await this.#attempt()
	}

	close(): void {
		this.#teardown(true)
	}

	send(address: OSCAddress, args: OSCArgument[]): void {
		const { config } = this.#host

		if (!this.#transport) {
			this.#host.log('error', `OSC socket is not open. Cannot send command: ${address}`)
			return
		}

		try {
			const message = BuildMessage(config, address, args)
			this.#transport.send(message)

			if (config.verbose) {
				this.#host.log(
					'debug',
					`Sent: ${address} ${JSON.stringify(message.args)} via ${config.transport.toUpperCase()} to ${config.ip}:${config.port}`,
				)
			}
		} catch (err) {
			this.#host.log('error', `Failed to send OSC: ${errorMessage(err)}`)
		}
	}

	async #attempt(): Promise<void> {
		const generation = this.#generation
		const { config } = this.#host
		const problem = getConfigProblem(config)

		if (problem) {
			this.#host.log('warn', problem)
			this.#setStatus(InstanceStatus.BadConfig, problem)
			return
		}

		try {
			await this.#resolveDeviceAddress()

			if (generation !== this.#generation) {
				return
			}

			const transport = this.#createTransport()
			this.#transport = transport

			transport.on('ready', () => this.#onReady())
			transport.on('close', () => this.#onLost('Connection closed', InstanceStatus.Disconnected))
			transport.on('error', (err) => this.#onLost(err.message, InstanceStatus.ConnectionFailure))
			transport.on('message', (message) => this.#onMessage(message))
			transport.on('malformed', (err) => {
				if (this.#host.config.verbose) {
					this.#host.log('debug', `Dropped malformed OSC packet: ${err.message}`)
				}
			})

			transport.open()
		} catch (err) {
			if (generation === this.#generation) {
				this.#onLost(`Failed to connect: ${errorMessage(err)}`, InstanceStatus.ConnectionFailure)
			}
		}
	}

	#createTransport(): OSCTransport {
		const { ip, port, listenport, transport } = this.#host.config

		if (transport === 'tcp') {
			return new OSCTCPPort(ip, port)
		}

		return new UDPPort({
			createSocket: (callback) => this.#host.createSharedUdpSocket('udp4', callback),
			listenPort: listenport,
			address: ip,
			port,
			acceptsPacketFrom: (address) => address === this.#host.config.ip || address === this.#resolvedIp,
		})
	}

	#onReady(): void {
		const { ip, port, pollinterval, transport } = this.#host.config

		this.#host.log('info', `${transport.toUpperCase()} ready for ${ip}:${port}`)
		this.#lastMessageAt = Date.now()
		this.#ping()

		// The device only pushes zoom/gimbal/device info when asked, so poll for it
		if (pollinterval) {
			this.#pollTimer = setInterval(() => this.#host.pollDeviceState(), pollinterval * 1000)
			this.#host.pollDeviceState()
		}

		this.#watchdogTimer = setInterval(() => this.#checkForSilence(), WatchdogInterval)
	}

	#onMessage(message: OSCMessage): void {
		if (!message.address) {
			return
		}

		const { config } = this.#host

		if (config.verbose) {
			this.#host.log('debug', `Received: ${message.address} ${JSON.stringify(message.args)}`)
		}

		this.#lastMessageAt = Date.now()
		this.#reconnectDelay = ReconnectDelayMin

		if (this.#reportedFailure !== undefined) {
			this.#host.log('info', `Connection to ${config.ip} restored`)
			this.#reportedFailure = undefined
		}
		this.#setStatus(InstanceStatus.Ok)

		try {
			if (message.address === ConnectedReplyAddress) {
				this.#onConnectedReply()
			} else {
				this.#host.handleReply(message.address, message.args)
			}
		} catch (err) {
			this.#host.log('error', `Failed to process ${message.address}: ${errorMessage(err)}`)
		}
	}

	// The watchdog's pings get this same reply, and only the first of each connection means anything
	#onConnectedReply(): void {
		if (this.#acknowledged) {
			return
		}

		this.#acknowledged = true
		this.#host.log('info', 'Connected to OBSBOT device successfully.')
		this.send('/OBSBOT/WebCam/General/GetDeviceInfo', [{ type: 'i', value: 0 }])
	}

	/**
	 * UDP has no notion of a connection and a TCP peer can vanish without closing, so silence is
	 * the only sign of a dead device. Pinging when idle makes that work with polling off or slow.
	 */
	#checkForSilence(): void {
		const silence = Date.now() - this.#lastMessageAt

		if (silence < WatchdogInterval) {
			return
		}

		if (silence >= SilenceTimeout) {
			const message = `No response from ${this.#host.config.ip}`

			if (this.#host.config.transport === 'tcp') {
				this.#onLost(message, InstanceStatus.ConnectionFailure)
				return
			}

			this.#reportFailure(message, InstanceStatus.ConnectionFailure)
			// A hostname may now point somewhere else
			void this.#resolveDeviceAddress()
		}

		this.#ping()
	}

	#ping(): void {
		this.send(ConnectedAddress, [{ type: 'i', value: 0 }])
	}

	#onLost(message: string, status: InstanceStatus): void {
		this.#reportFailure(message, status)
		this.#teardown(false)

		const delay = this.#reconnectDelay
		this.#reconnectDelay = Math.min(delay * 2, ReconnectDelayMax)

		this.#reconnectTimer = setTimeout(() => {
			this.#reconnectTimer = undefined
			void this.#attempt()
		}, delay)
	}

	#reportFailure(message: string, status: InstanceStatus): void {
		// A retry that fails the same way isn't news, so don't fill the log with it
		if (message !== this.#reportedFailure) {
			this.#host.log('warn', message)
			this.#reportedFailure = message
		}

		this.#setStatus(status, message)
	}

	#setStatus(status: InstanceStatus, message?: string): void {
		if (status !== this.#status || message !== this.#statusMessage) {
			this.#status = status
			this.#statusMessage = message
			this.#host.updateStatus(status, message)
		}
	}

	#teardown(notifyDevice: boolean): void {
		this.#generation++
		this.#acknowledged = false

		clearInterval(this.#pollTimer)
		clearInterval(this.#watchdogTimer)
		clearTimeout(this.#reconnectTimer)
		this.#pollTimer = undefined
		this.#watchdogTimer = undefined
		this.#reconnectTimer = undefined

		const transport = this.#transport
		if (!transport) {
			return
		}

		if (notifyDevice) {
			this.send('/OBSBOT/WebCam/General/Disconnected', [{ type: 'i', value: 0 }])
		}

		this.#transport = undefined
		transport.removeAllListeners()

		try {
			transport.close()
		} catch (err) {
			this.#host.log('warn', `Failed to close socket: ${errorMessage(err)}`)
		}
	}

	/**
	 * Replies arrive from the device's numeric address, so a hostname in the config
	 * (such as an mDNS `.local` name) never matches what dgram reports. Resolve it up
	 * front and compare against that instead.
	 */
	async #resolveDeviceAddress(): Promise<void> {
		const host = this.#host.config.ip

		if (net.isIP(host)) {
			this.#resolvedIp = host
			return
		}

		try {
			const { address } = await dns.lookup(host, { family: 4 })
			this.#resolvedIp = address

			if (this.#host.config.verbose) {
				this.#host.log('debug', `Resolved ${host} to ${address}`)
			}
		} catch (err) {
			this.#resolvedIp = undefined

			if (this.#host.config.verbose) {
				this.#host.log('debug', `Could not resolve ${host}: ${errorMessage(err)}`)
			}
		}
	}
}

function errorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err)
}
