import net from 'node:net'
import type { AddressInfo } from 'node:net'
import osc from 'osc'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OSCTCPPort } from '../src/tcp.js'

const packet = (address: string, value: number) =>
	Buffer.from(osc.writePacket({ address, args: [{ type: 'i', value }] }))

function frame(data: Buffer, order: 'BE' | 'LE' = 'BE'): Buffer {
	const header = Buffer.alloc(4)
	if (order === 'BE') header.writeUInt32BE(data.length)
	else header.writeUInt32LE(data.length)
	return Buffer.concat([header, data])
}

describe('OSCTCPPort', () => {
	let server: net.Server | undefined
	let port: OSCTCPPort | undefined

	afterEach(async () => {
		port?.close()
		vi.restoreAllMocks()
		await new Promise((resolve) => (server ? server.close(resolve) : resolve(undefined)))
		server = undefined
	})

	async function connect(): Promise<{ peer: net.Socket; client: OSCTCPPort }> {
		const accepted = new Promise<net.Socket>((resolve) => {
			server = net.createServer(resolve)
			server.listen(0, '127.0.0.1')
		})
		await new Promise((resolve) => server!.once('listening', resolve))

		const client = new OSCTCPPort('127.0.0.1', (server!.address() as AddressInfo).port)
		port = client
		const ready = new Promise((resolve) => client.once('ready', () => resolve(undefined)))
		client.open()
		await ready

		return { peer: await accepted, client }
	}

	const nextMessage = async (client: OSCTCPPort) =>
		new Promise<{ address: string; args: unknown[] }>((resolve) => client.once('message', resolve))

	it.each(['BE', 'LE'] as const)('decodes frames with a %s length prefix', async (order) => {
		const { peer, client } = await connect()
		const received = nextMessage(client)

		peer.write(frame(packet('/test', 7), order))

		expect(await received).toMatchObject({ address: '/test', args: [7] })
	})

	it('reassembles a frame split across chunks, and several frames in one chunk', async () => {
		const { peer, client } = await connect()
		const messages: unknown[] = []
		client.on('message', (message) => messages.push(message.args[0]))
		const data = Buffer.concat([frame(packet('/a', 1)), frame(packet('/b', 2)), frame(packet('/c', 3))])

		peer.write(data.subarray(0, 6))
		await new Promise((resolve) => setTimeout(resolve, 20))
		peer.write(data.subarray(6))
		await vi.waitFor(() => expect(messages).toEqual([1, 2, 3]))
	})

	it('reports a malformed packet without dropping the connection', async () => {
		const { peer, client } = await connect()
		const malformed = vi.fn()
		const error = vi.fn()
		client.on('malformed', malformed)
		client.on('error', error)
		const received = nextMessage(client)

		peer.write(frame(Buffer.from([1, 2, 3])))
		peer.write(frame(packet('/after', 1)))

		expect(await received).toMatchObject({ address: '/after' })
		expect(malformed).toHaveBeenCalledOnce()
		expect(error).not.toHaveBeenCalled()
	})

	it('reports data that is not length-prefixed OSC as an error', async () => {
		const { peer, client } = await connect()
		const error = new Promise<Error>((resolve) => client.once('error', resolve))

		peer.write(Buffer.from([0xff, 0xff, 0xff, 0xff, 0]))

		expect((await error).message).toContain('not length-prefixed')
	})

	it('sends with a big-endian length prefix', async () => {
		const { peer, client } = await connect()
		const received = new Promise<Buffer>((resolve) => peer.once('data', resolve))

		client.send({ address: '/out', args: [{ type: 'i', value: 5 }] })

		const data = await received
		expect(data.readUInt32BE(0)).toBe(data.length - 4)
		expect(osc.readPacket(data.subarray(4), {})).toMatchObject({ address: '/out', args: [5] })
	})

	it('emits close when the peer disconnects', async () => {
		const { peer, client } = await connect()
		const closed = new Promise((resolve) => client.once('close', () => resolve(true)))

		peer.destroy()

		expect(await closed).toBe(true)
	})

	it('does not emit close when closed locally, as that would trigger a reconnect', async () => {
		const { client } = await connect()
		const closed = vi.fn()
		client.on('close', closed)

		client.close()
		await new Promise((resolve) => setTimeout(resolve, 20))

		expect(closed).not.toHaveBeenCalled()
	})

	it('gives up on a connection attempt that never completes', async () => {
		const connectSpy = vi.spyOn(net, 'connect')
		const client = new OSCTCPPort('127.0.0.1', 9)
		port = client
		const error = new Promise<Error>((resolve) => client.once('error', resolve))

		client.open()
		const socket = connectSpy.mock.results[0].value as net.Socket
		expect(socket.timeout).toBeGreaterThan(0)
		socket.emit('timeout')

		expect((await error).message).toContain('Timed out')
	})

	it('throws when sending on a closed port', () => {
		const client = new OSCTCPPort('127.0.0.1', 9)

		expect(() => client.send({ address: '/out', args: [] })).toThrow('not open')
	})
})
