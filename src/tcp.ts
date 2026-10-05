import { EventEmitter } from 'node:events'
import net from 'node:net'
import osc, { type OSCBundle, type OSCMessage } from 'osc'

interface TCPPortEvents {
	ready: []
	close: []
	error: [Error]
	message: [OSCMessage]
}

// Comfortably above any OBSBOT reply, and low enough that the two byte orders can't be confused
const MaxPacketLength = 0xffff

/**
 * OSC over TCP using OSC 1.0 framing (each packet prefixed with its int32 length), which
 * is what OBSBOT speaks. osc.js's TCPSocketPort only does SLIP, so replies never decode
 * with it.
 *
 * Center App writes the length big-endian but Tail 2 hardware writes it little-endian.
 * A plausible length in one order is always implausible in the other, so pick per frame.
 */
export class OSCTCPPort extends EventEmitter<TCPPortEvents> {
	readonly #address: string
	readonly #port: number
	#socket: net.Socket | undefined
	#pending = Buffer.alloc(0)

	constructor(address: string, port: number) {
		super()
		this.#address = address
		this.#port = port
	}

	open(): void {
		const socket = net.connect(this.#port, this.#address)
		this.#socket = socket

		socket.on('connect', () => this.emit('ready'))
		socket.on('close', () => this.emit('close'))
		socket.on('error', (err) => this.emit('error', err))
		socket.on('data', (data) => this.#receive(data))
	}

	close(): void {
		this.#socket?.destroy()
		this.#socket = undefined
		this.#pending = Buffer.alloc(0)
	}

	send(message: { address: string; args: OSCArgument[] }): void {
		if (!this.#socket) {
			throw new Error('TCP socket is not open')
		}

		const packet = osc.writePacket(message)
		const frame = Buffer.alloc(4 + packet.byteLength)
		frame.writeUInt32BE(packet.byteLength, 0)
		frame.set(packet, 4)
		this.#socket.write(frame)
	}

	#receive(data: Buffer): void {
		this.#pending = Buffer.concat([this.#pending, data])

		while (this.#pending.length >= 4) {
			const length = readFrameLength(this.#pending)
			if (length === undefined) {
				this.#pending = Buffer.alloc(0)
				this.emit('error', new Error('Received data that is not length-prefixed OSC'))
				return
			}

			if (this.#pending.length < 4 + length) {
				break
			}

			const packet = this.#pending.subarray(4, 4 + length)
			this.#pending = this.#pending.subarray(4 + length)

			let decoded: OSCMessage | OSCBundle
			try {
				decoded = osc.readPacket(packet, {})
			} catch {
				// Drop malformed packets, matching the UDP path, rather than tearing down the connection
				continue
			}

			for (const message of 'packets' in decoded ? decoded.packets : [decoded]) {
				this.emit('message', message)
			}
		}
	}
}

function readFrameLength(buffer: Buffer): number | undefined {
	const bigEndian = buffer.readUInt32BE(0)
	if (bigEndian <= MaxPacketLength) {
		return bigEndian
	}

	const littleEndian = buffer.readUInt32LE(0)
	return littleEndian <= MaxPacketLength ? littleEndian : undefined
}
