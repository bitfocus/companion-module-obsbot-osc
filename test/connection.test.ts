import { EventEmitter } from 'node:events'
import dns from 'node:dns/promises'
import { InstanceStatus } from '@companion-module/base'
import osc from 'osc'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Connection } from '../src/connection.js'
import { OSCTCPPort } from '../src/tcp.js'
import { defaultConfig } from './helpers/harness.js'

vi.mock('node:dns/promises', () => ({ default: { lookup: vi.fn() } }))

vi.mock('../src/tcp.js', async () => {
	const { EventEmitter: Emitter } = await import('node:events')

	class FakeTCPPort extends Emitter {
		static instances: FakeTCPPort[] = []
		sent: unknown[] = []
		closed = false
		constructor() {
			super()
			FakeTCPPort.instances.push(this)
		}
		open(): void {}
		close(): void {
			this.closed = true
		}
		send(message: unknown): void {
			this.sent.push(message)
		}
	}

	return { OSCTCPPort: FakeTCPPort }
})

const tcpPorts = (OSCTCPPort as any).instances as (EventEmitter & { closed: boolean; sent: any[] })[]

const CONNECTED = '/OBSBOT/WebCam/General/Connected'
const CONNECTED_REPLY = '/OBSBOT/WebCam/General/ConnectedResp'
const GET_DEVICE_INFO = '/OBSBOT/WebCam/General/GetDeviceInfo'
const DEVICE_IP = '192.0.2.10'

class FakeUdpSocket extends EventEmitter {
	sent: { address: string; args: unknown[]; to: string }[] = []
	closed = false
	bound: (() => void) | undefined

	constructor(readonly deliver: (message: Buffer, rinfo: { address: string; port: number }) => void) {
		super()
	}

	bind(_port: number, _address: string, callback: () => void): void {
		this.bound = callback
	}

	close(): void {
		this.closed = true
	}

	send(buffer: Buffer, _offset: number, _length: number, _port: number, to: string): void {
		const { address, args } = osc.readPacket(buffer, {}) as { address: string; args: unknown[] }
		this.sent.push({ address, args, to })
	}

	reply(address: string, args: number[] = [1], from = DEVICE_IP): void {
		const packet = osc.writePacket({ address, args: args.map((value) => ({ type: 'i', value })) })
		this.deliver(Buffer.from(packet), { address: from, port: 57110 })
	}
}

function setup(config: Partial<ReturnType<typeof defaultConfig>> = {}) {
	const sockets: FakeUdpSocket[] = []
	const host = {
		config: { ...defaultConfig('OBSBOT_TAIL_AIR'), ip: DEVICE_IP, ...config },
		log: vi.fn(),
		updateStatus: vi.fn(),
		handleReply: vi.fn(),
		pollDeviceState: vi.fn(),
		createSharedUdpSocket: vi.fn((_type: string, callback: FakeUdpSocket['deliver']) => {
			const socket = new FakeUdpSocket(callback)
			sockets.push(socket)
			return socket
		}),
	}

	const connection = new Connection(host as any)
	const lastStatus = () => host.updateStatus.mock.calls.at(-1)?.[0]
	const warnings = () => host.log.mock.calls.filter(([level]) => level === 'warn')

	return { host, connection, sockets, lastStatus, warnings }
}

beforeEach(() => {
	vi.useFakeTimers()
	vi.mocked(dns.lookup).mockReset()
	tcpPorts.length = 0
})

afterEach(() => {
	vi.useRealTimers()
})

describe('connecting', () => {
	it('abandons an attempt when closed during a slow lookup, rather than opening a socket after destroy', async () => {
		let finishLookup = (_value: unknown) => {}
		vi.mocked(dns.lookup).mockReturnValue(new Promise((resolve) => (finishLookup = resolve)) as any)
		const { connection, host } = setup({ ip: 'camera.local' })

		const connecting = connection.connect()
		connection.close()
		finishLookup({ address: DEVICE_IP, family: 4 })
		await connecting

		expect(host.createSharedUdpSocket).not.toHaveBeenCalled()
	})

	it('only opens one socket when reconfigured during a slow lookup', async () => {
		const lookups: ((value: unknown) => void)[] = []
		vi.mocked(dns.lookup).mockImplementation((async () => new Promise((resolve) => lookups.push(resolve))) as any)
		const { connection, host } = setup({ ip: 'camera.local' })

		const first = connection.connect()
		const second = connection.connect()
		await vi.advanceTimersByTimeAsync(0)
		lookups.forEach((resolve) => resolve({ address: DEVICE_IP, family: 4 }))
		await Promise.all([first, second])

		expect(host.createSharedUdpSocket).toHaveBeenCalledTimes(1)
	})

	it('reports a missing address as bad config and does not retry', async () => {
		const { connection, host, lastStatus } = setup({ ip: ' ' })

		await connection.connect()
		await vi.advanceTimersByTimeAsync(120000)

		expect(lastStatus()).toBe(InstanceStatus.BadConfig)
		expect(host.createSharedUdpSocket).not.toHaveBeenCalled()
	})

	it('reports an invalid port as bad config', async () => {
		const { connection, lastStatus } = setup({ port: 0 })

		await connection.connect()

		expect(lastStatus()).toBe(InstanceStatus.BadConfig)
	})

	it('keeps retrying when opening the socket throws, without an unhandled rejection', async () => {
		const { connection, host, lastStatus, sockets } = setup()
		host.createSharedUdpSocket.mockImplementationOnce(() => {
			throw new Error('no socket for you')
		})

		await expect(connection.connect()).resolves.toBeUndefined()
		expect(lastStatus()).toBe(InstanceStatus.ConnectionFailure)

		await vi.advanceTimersByTimeAsync(1000)
		expect(sockets).toHaveLength(1)
	})

	it('still connects when a hostname cannot be resolved, and matches replies once it can', async () => {
		vi.mocked(dns.lookup).mockRejectedValueOnce(new Error('ENOTFOUND'))
		const { connection, host, sockets } = setup({ ip: 'camera.local' })

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].reply('/OBSBOT/WebCam/General/ZoomInfo')
		expect(host.handleReply).not.toHaveBeenCalled()

		vi.mocked(dns.lookup).mockResolvedValue({ address: DEVICE_IP, family: 4 })
		await vi.advanceTimersByTimeAsync(15000)
		sockets[0].reply('/OBSBOT/WebCam/General/ZoomInfo')
		expect(host.handleReply).toHaveBeenCalledTimes(1)
	})
})

describe('UDP', () => {
	it('waits for the socket to bind before pinging or polling', async () => {
		const { connection, host, sockets } = setup({ pollinterval: 5 })

		await connection.connect()
		expect(sockets[0].sent).toEqual([])
		expect(host.pollDeviceState).not.toHaveBeenCalled()

		sockets[0].bound?.()
		expect(sockets[0].sent.map((message) => message.address)).toEqual([CONNECTED])
		expect(host.pollDeviceState).toHaveBeenCalledTimes(1)

		await vi.advanceTimersByTimeAsync(5000)
		expect(host.pollDeviceState).toHaveBeenCalledTimes(2)
	})

	it('recovers from a socket error, which previously left the connection dead', async () => {
		const { connection, sockets, lastStatus } = setup()

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].emit('error', new Error('EADDRINUSE'))

		expect(lastStatus()).toBe(InstanceStatus.ConnectionFailure)
		expect(sockets[0].closed).toBe(true)

		await vi.advanceTimersByTimeAsync(1000)
		expect(sockets).toHaveLength(2)
	})

	it('detects a silent device with polling off, then recovers when it answers', async () => {
		const { connection, host, sockets, lastStatus } = setup({ pollinterval: 0 })

		await connection.connect()
		sockets[0].bound?.()
		expect(lastStatus()).toBe(InstanceStatus.Connecting)

		await vi.advanceTimersByTimeAsync(15000)
		expect(lastStatus()).toBe(InstanceStatus.ConnectionFailure)
		expect(host.updateStatus).toHaveBeenLastCalledWith(
			InstanceStatus.ConnectionFailure,
			`No response from ${DEVICE_IP}`,
		)
		expect(sockets[0].sent.filter((message) => message.address === CONNECTED).length).toBeGreaterThan(1)
		expect(sockets).toHaveLength(1)

		sockets[0].reply(CONNECTED_REPLY)
		expect(lastStatus()).toBe(InstanceStatus.Ok)
		expect(host.log).toHaveBeenCalledWith('info', `Connection to ${DEVICE_IP} restored`)
	})

	it('does not ping a device that is actively replying', async () => {
		const { connection, sockets } = setup()

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].sent.length = 0

		await vi.advanceTimersByTimeAsync(4000)
		sockets[0].reply('/OBSBOT/WebCam/General/ZoomInfo')
		await vi.advanceTimersByTimeAsync(1000)

		expect(sockets[0].sent).toEqual([])
	})

	it('ignores packets from other devices sharing the socket, without treating them as a response', async () => {
		const { connection, host, sockets, lastStatus } = setup()

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].reply('/OBSBOT/WebCam/General/ZoomInfo', [10, 1], '192.0.2.99')

		expect(host.handleReply).not.toHaveBeenCalled()
		expect(lastStatus()).toBe(InstanceStatus.Connecting)
	})

	it('drops malformed packets without failing the connection', async () => {
		const { connection, host, sockets, lastStatus } = setup({ verbose: true })

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].deliver(Buffer.from([1, 2, 3]), { address: DEVICE_IP, port: 57110 })

		expect(host.handleReply).not.toHaveBeenCalled()
		expect(lastStatus()).toBe(InstanceStatus.Connecting)
		expect(host.log.mock.calls.some(([, message]) => String(message).includes('malformed'))).toBe(true)
	})

	it('keeps running when handling a reply throws', async () => {
		const { connection, host, sockets, lastStatus } = setup()
		host.handleReply.mockImplementationOnce(() => {
			throw new Error('bad state')
		})

		await connection.connect()
		sockets[0].bound?.()

		expect(() => sockets[0].reply('/OBSBOT/WebCam/General/ZoomInfo')).not.toThrow()
		expect(host.log).toHaveBeenCalledWith('error', expect.stringContaining('bad state'))
		expect(lastStatus()).toBe(InstanceStatus.Ok)
	})
})

describe('TCP', () => {
	const connectTcp = async () => {
		const context = setup({ transport: 'tcp' })
		await context.connection.connect()
		tcpPorts[0].emit('ready')
		return context
	}

	it('reconnects when a peer goes silent without closing', async () => {
		const { lastStatus } = await connectTcp()

		await vi.advanceTimersByTimeAsync(15000)

		expect(lastStatus()).toBe(InstanceStatus.ConnectionFailure)
		expect(tcpPorts[0].closed).toBe(true)

		await vi.advanceTimersByTimeAsync(1000)
		expect(tcpPorts).toHaveLength(2)
	})

	it('reconnects after the connection closes', async () => {
		const { lastStatus } = await connectTcp()

		tcpPorts[0].emit('close')
		expect(lastStatus()).toBe(InstanceStatus.Disconnected)

		await vi.advanceTimersByTimeAsync(1000)
		expect(tcpPorts).toHaveLength(2)
	})

	it('keeps running when handling a reply throws', async () => {
		const { host, lastStatus } = await connectTcp()
		host.handleReply.mockImplementationOnce(() => {
			throw new Error('bad state')
		})

		expect(() => tcpPorts[0].emit('message', { address: '/x', args: [] })).not.toThrow()
		expect(host.log).toHaveBeenCalledWith('error', expect.stringContaining('bad state'))
		expect(lastStatus()).toBe(InstanceStatus.Ok)
	})
})

describe('retrying', () => {
	const failNext = () => {
		tcpPorts.at(-1)?.emit('error', new Error('ECONNREFUSED'))
	}

	it('backs off from 1 second up to a 30 second cap', async () => {
		const { connection } = setup({ transport: 'tcp' })
		await connection.connect()

		const delays: number[] = []
		for (let attempt = 0; attempt < 7; attempt++) {
			const before = tcpPorts.length
			failNext()

			let waited = 0
			while (tcpPorts.length === before) {
				await vi.advanceTimersByTimeAsync(500)
				waited += 500
			}
			delays.push(waited)
		}

		expect(delays).toEqual([1000, 2000, 4000, 8000, 16000, 30000, 30000])
	})

	it('logs a repeated failure once', async () => {
		const { connection, warnings } = setup({ transport: 'tcp' })
		await connection.connect()

		for (let attempt = 0; attempt < 4; attempt++) {
			failNext()
			await vi.advanceTimersByTimeAsync(30000)
		}

		expect(warnings()).toHaveLength(1)
	})

	it('resets the backoff once the device responds', async () => {
		const { connection } = setup({ transport: 'tcp' })
		await connection.connect()

		failNext()
		await vi.advanceTimersByTimeAsync(1000)
		failNext()
		await vi.advanceTimersByTimeAsync(2000)

		tcpPorts.at(-1)?.emit('ready')
		tcpPorts.at(-1)?.emit('message', { address: CONNECTED_REPLY, args: [1] })
		const before = tcpPorts.length
		failNext()
		await vi.advanceTimersByTimeAsync(1000)

		expect(tcpPorts).toHaveLength(before + 1)
	})

	it('stops retrying once closed', async () => {
		const { connection } = setup({ transport: 'tcp' })
		await connection.connect()

		failNext()
		connection.close()
		await vi.advanceTimersByTimeAsync(60000)

		expect(tcpPorts).toHaveLength(1)
	})
})

describe('the Connected reply', () => {
	it('only asks for device info on the first reply of a connection, as pings get the same reply', async () => {
		const { connection, sockets, host } = setup()

		await connection.connect()
		sockets[0].bound?.()
		sockets[0].reply(CONNECTED_REPLY)
		sockets[0].reply(CONNECTED_REPLY)

		expect(sockets[0].sent.filter((message) => message.address === GET_DEVICE_INFO)).toHaveLength(1)
		expect(
			host.log.mock.calls.filter(([, message]) => message === 'Connected to OBSBOT device successfully.'),
		).toHaveLength(1)
		expect(host.handleReply).not.toHaveBeenCalled()
	})
})

describe('sending', () => {
	it('notifies the device and closes the socket on close', async () => {
		const { connection, sockets } = setup()

		await connection.connect()
		sockets[0].bound?.()
		connection.close()

		expect(sockets[0].sent.at(-1)?.address).toBe('/OBSBOT/WebCam/General/Disconnected')
		expect(sockets[0].closed).toBe(true)
	})

	it('adds the device ID for the Center App', async () => {
		const { connection, sockets } = setup({ model: 'OBSBOT_CENTER_TINY', device: 3 })

		await connection.connect()
		sockets[0].bound?.()
		connection.send('/OBSBOT/WebCam/General/SetZoom', [{ type: 'i', value: 50 }])

		expect(sockets[0].sent.at(-1)?.args).toEqual([2, 50])
	})

	it('logs instead of throwing when nothing is connected', () => {
		const { connection, host } = setup()

		connection.send('/OBSBOT/WebCam/General/SetZoom', [{ type: 'i', value: 50 }])

		expect(host.log).toHaveBeenCalledWith('error', expect.stringContaining('not open'))
	})
})
