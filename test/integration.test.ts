import dgram from 'node:dgram'
import net from 'node:net'
import type { AddressInfo } from 'node:net'
import { InstanceStatus } from '@companion-module/base'
import osc from 'osc'
import { afterEach, describe, expect, it, vi } from 'vitest'
import OBSBOTInstance, { UpgradeScripts } from '../src/main.js'
import type { ModuleConfig } from '../src/config.js'
import { defaultConfig } from './helpers/harness.js'

// The real instance and base class on real sockets, with only Companion and the camera faked

type Reply = [address: string, values: number[]]

const Replies: Record<string, Reply> = {
	'/OBSBOT/WebCam/General/Connected': ['/OBSBOT/WebCam/General/ConnectedResp', [1]],
	'/OBSBOT/WebCam/General/GetZoomInfo': ['/OBSBOT/WebCam/General/ZoomInfo', [40, 1]],
}

const encode = ([address, values]: Reply) =>
	Buffer.from(osc.writePacket({ address, args: values.map((value) => ({ type: 'i', value })) }))

function createHost() {
	const statuses: string[] = []
	const variables: Record<string, unknown> = {}
	const definitions: { actions: Record<string, any> } = { actions: {} }
	const sockets = new Map<string, dgram.Socket>()
	const sharedUdpSocketHandlers = new Map<string, any>()
	let nextHandle = 0

	const context = {
		_isInstanceContext: true,
		id: 'test',
		label: 'test',
		upgradeScripts: [],
		sharedUdpSocketHandlers,
		saveConfig: () => {},
		updateStatus: (status: string) => statuses.push(status),
		setActionDefinitions: (actions: Record<string, any>) => (definitions.actions = actions),
		setFeedbackDefinitions: () => {},
		setPresetDefinitions: () => {},
		setVariableDefinitions: () => {},
		setVariableValues: (values: Record<string, unknown>) => Object.assign(variables, values),
		checkFeedbacks: () => {},
		sharedUdpSocketJoin: async ({ portNumber }: { portNumber: number }) => {
			const handleId = String(nextHandle++)
			const socket = dgram.createSocket('udp4')
			socket.on('message', (message, source) =>
				sharedUdpSocketHandlers.get(handleId)?.receiveSocketMessage({ handleId, portNumber, message, source }),
			)
			await new Promise<void>((resolve) => socket.bind(portNumber, '127.0.0.1', resolve))
			sockets.set(handleId, socket)
			return handleId
		},
		sharedUdpSocketLeave: async ({ handleId }: { handleId: string }) => {
			sockets.get(handleId)?.close()
			sockets.delete(handleId)
		},
		sharedUdpSocketSend: async ({ handleId, message, address, port }: any) => {
			sockets.get(handleId)?.send(message, port, address)
		},
	}

	return {
		instance: new OBSBOTInstance(context),
		statuses,
		variables,
		definitions,
		openSockets: () => sockets.size,
	}
}

const freeUdpPort = async () => {
	const socket = dgram.createSocket('udp4')
	await new Promise<void>((resolve) => socket.bind(0, '127.0.0.1', resolve))
	const { port } = socket.address()
	await new Promise<void>((resolve) => socket.close(() => resolve()))
	return port
}

const config = (overrides: Partial<ModuleConfig>): ModuleConfig => ({
	...defaultConfig('OBSBOT_TAIL_AIR'),
	pollinterval: 1,
	...overrides,
})

describe('the module entry point', () => {
	it('exports what Companion loads', () => {
		expect(OBSBOTInstance).toBeTypeOf('function')
		expect(UpgradeScripts).toHaveLength(2)
	})
})

describe('over UDP', () => {
	let device: dgram.Socket | undefined
	let host: ReturnType<typeof createHost> | undefined

	afterEach(async () => {
		await host?.instance.destroy()
		await new Promise<void>((resolve) => (device ? device.close(() => resolve()) : resolve()))
		device = undefined
	})

	it('connects, polls, runs actions and closes cleanly', async () => {
		const received: { address: string; args: unknown[] }[] = []
		device = dgram.createSocket('udp4')
		device.on('message', (packet, sender) => {
			const message = osc.readPacket(packet, {}) as { address: string; args: unknown[] }
			received.push(message)
			const reply = Replies[message.address]
			if (reply) device?.send(encode(reply), sender.port, sender.address)
		})
		await new Promise<void>((resolve) => device!.bind(0, '127.0.0.1', resolve))

		host = createHost()
		await host.instance.init(config({ port: device.address().port, listenport: await freeUdpPort() }))

		await vi.waitFor(() => expect(host?.statuses.at(-1)).toBe(InstanceStatus.Ok), { timeout: 3000 })
		await vi.waitFor(() => expect(host?.variables.zoom).toBe(40), { timeout: 3000 })
		expect(host.variables.fov).toBe('78°')

		await host.definitions.actions.setZoom.callback({ options: { zoom: 75 } })
		await vi.waitFor(() =>
			expect(received).toContainEqual(
				expect.objectContaining({ address: '/OBSBOT/WebCam/General/SetZoom', args: [75] }),
			),
		)

		await host.instance.destroy()
		await vi.waitFor(() => expect(host?.openSockets()).toBe(0))
	})
})

describe('over TCP', () => {
	let server: net.Server | undefined
	let peers: net.Socket[] = []
	let host: ReturnType<typeof createHost> | undefined

	const startDevice = async (port = 0) => {
		const device = net.createServer((socket) => {
			peers.push(socket)
			socket.on('error', () => {})
			socket.on('data', (chunk) => {
				const data = chunk as Buffer
				let offset = 0
				while (offset + 4 <= data.length) {
					const length = data.readUInt32BE(offset)
					const message = osc.readPacket(data.subarray(offset + 4, offset + 4 + length), {}) as { address: string }
					offset += 4 + length

					const reply = Replies[message.address]
					if (reply) {
						const packet = encode(reply)
						const header = Buffer.alloc(4)
						header.writeUInt32BE(packet.length)
						socket.write(Buffer.concat([header, packet]))
					}
				}
			})
		})
		server = device
		await new Promise<void>((resolve) => device.listen(port, '127.0.0.1', resolve))
		return (device.address() as AddressInfo).port
	}

	const stopDevice = async () => {
		peers.forEach((peer) => peer.destroy())
		peers = []
		await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()))
		server = undefined
	}

	afterEach(async () => {
		await host?.instance.destroy()
		await stopDevice()
	})

	it('reconnects by itself when the device goes away and comes back', async () => {
		const port = await startDevice()

		host = createHost()
		await host.instance.init(config({ transport: 'tcp', port }))

		await vi.waitFor(() => expect(host?.statuses.at(-1)).toBe(InstanceStatus.Ok), { timeout: 3000 })
		await vi.waitFor(() => expect(host?.variables.zoom).toBe(40), { timeout: 3000 })

		await stopDevice()
		await vi.waitFor(
			() => expect([InstanceStatus.Disconnected, InstanceStatus.ConnectionFailure]).toContain(host?.statuses.at(-1)),
			{ timeout: 3000 },
		)

		await startDevice(port)
		await vi.waitFor(() => expect(host?.statuses.at(-1)).toBe(InstanceStatus.Ok), { timeout: 8000 })
	}, 15000)

	it('stops trying after destroy', async () => {
		const port = await startDevice()

		host = createHost()
		await host.instance.init(config({ transport: 'tcp', port }))
		await vi.waitFor(() => expect(host?.statuses.at(-1)).toBe(InstanceStatus.Ok), { timeout: 3000 })

		await stopDevice()
		await host.instance.destroy()

		let connections = 0
		await startDevice(port)
		server?.on('connection', () => connections++)
		await new Promise((resolve) => setTimeout(resolve, 2500))

		expect(connections).toBe(0)
	}, 10000)
})
