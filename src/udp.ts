import { EventEmitter } from 'node:events'
import type { SharedUdpSocket, SharedUdpSocketMessageCallback } from '@companion-module/base'
import osc from 'osc'
import type { OSCOutgoingMessage, OSCTransport, OSCTransportEvents } from './transport.js'

export interface UDPPortOptions {
	createSocket: (callback: SharedUdpSocketMessageCallback) => SharedUdpSocket
	listenPort: number
	address: string
	port: number
	/** The socket is shared between connections, so packets from other devices arrive here too */
	acceptsPacketFrom: (address: string) => boolean
}

export class UDPPort extends EventEmitter<OSCTransportEvents> implements OSCTransport {
	readonly #options: UDPPortOptions
	#socket: SharedUdpSocket | undefined

	constructor(options: UDPPortOptions) {
		super()
		this.#options = options
	}

	open(): void {
		const socket = this.#options.createSocket((packet, rinfo) => this.#receive(packet, rinfo.address))
		this.#socket = socket

		socket.on('error', (err) => this.emit('error', err))
		socket.bind(this.#options.listenPort, '0.0.0.0', () => this.emit('ready'))
	}

	close(): void {
		this.#socket?.removeAllListeners()
		this.#socket?.on('error', () => {})
		this.#socket?.close()
		this.#socket = undefined
	}

	send(message: OSCOutgoingMessage): void {
		if (!this.#socket) {
			throw new Error('UDP socket is not open')
		}

		const binary = osc.writePacket(message)
		//wrap without copying so the shared socket's Buffer overload applies
		const buffer = Buffer.from(binary.buffer, binary.byteOffset, binary.byteLength)
		this.#socket.send(buffer, 0, buffer.length, this.#options.port, this.#options.address)
	}

	#receive(packet: Buffer, from: string): void {
		if (!this.#options.acceptsPacketFrom(from)) {
			return
		}

		try {
			const decoded = osc.readPacket(packet, {})

			for (const message of 'packets' in decoded ? decoded.packets : [decoded]) {
				this.emit('message', message)
			}
		} catch (err) {
			this.emit('malformed', err instanceof Error ? err : new Error(String(err)))
		}
	}
}
