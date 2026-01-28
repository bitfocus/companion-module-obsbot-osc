import { InstanceStatus } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'
import osc from 'osc'

export async function InitConnection(self: OBSBOTInstance): Promise<void> {
	const { ip, port, transport, verbose } = self.config

	if (verbose) {
		self.log('debug', `Connecting to OBSBOT at ${ip}:${port} via ${transport.toUpperCase()}`)
	}

	self.updateStatus(InstanceStatus.Connecting)

	// Cleanup previous socket
	if (self._socket?.close) {
		try {
			self._socket.close()
		} catch (e) {
			self.log('warn', `Failed to close previous socket: ${e}`)
		}
	}

	if (transport === 'udp') {
		// Shared UDP socket on fixed OBSBOT response port 57120
		self._socket = self.createSharedUdpSocket('udp4', (msg, rinfo) => CheckMessage(self, msg, rinfo))

		self._socket.bind(self.config.listenport, self.config.ip, () => {
			self.log('info', `Shared UDP socket listening on port ${self.config.listenport}`)
			SendCommand(self, '/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
		})

		self._socket.on('error', (err: any) => {
			self.log('error', `UDP socket error: ${err.message}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
		})
	} else {
		// TCP connection
		self._socket = new osc.TCPSocketPort({
			address: ip,
			port: port,
		})

		self._socket.on('ready', () => {
			self.log('info', `TCP connection established to ${ip}:${port}`)
			self.updateStatus(InstanceStatus.Ok)
			SendCommand(self, '/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
		})

		self._socket.on('message', (msg: any) => {
			if (msg.address) {
				self.log('debug', `Received: ${msg.address} ${JSON.stringify(msg.args)}`)
				processData(self, msg.address, msg.args)
			}
		})

		self._socket.on('error', (err: any) => {
			self.log('error', `TCP error: ${err.message}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
		})

		self._socket.open()
	}
}

function CheckMessage(self: OBSBOTInstance, msg: Buffer, rinfo: any): void {
	try {
		if (rinfo.address == self.config.ip && rinfo.port == self.config.port) {
			const packet = osc.readPacket(msg, {})
			const messages = packet.packets || [packet]

			for (const message of messages) {
				if (message.address) {
					processData(self, message.address, message.args)
				}
			}
		}
	} catch (_err: any) {
		//self.log('error', `OSC decode error: ${err.message}`)
	}
}

function processData(self: OBSBOTInstance, address: string, args: OSCArgument[]): void {
	if (self.config.verbose) {
		self.log('debug', `Processing message: ${address} ${JSON.stringify(args)}`)
	}

	//if we got any data, let's say the module status is ok
	self.updateStatus(InstanceStatus.Ok)

	const variableObj: any = {}

	switch (address) {
		case '/OBSBOT/WebCam/General/DeviceInfo': {
			const info = parseDeviceInfo(self, args)

			self.DEVICES = info.devices
			self.updateVariableDefinitions()

			if (self.DEVICES.length > 1) {
				let i = 1

				for (const device in info.devices) {
					variableObj[`device${i}_connected`] = info.devices[device].connected ? 'Connected' : 'Disconnected'
					variableObj[`device${i}_name`] = info.devices[device].name
					i++
				}

				variableObj['selected_index'] = info.selectedDeviceIndex
				variableObj['selected_state'] = info.selectedDeviceRunState
				variableObj['selected_type'] = info.selectedDeviceType
				variableObj['selected_name'] = info.devices[info.selectedDeviceIndex].name
				variableObj['selected_connected'] = info.devices[info.selectedDeviceIndex].connected
					? 'Connected'
					: 'Disconnected'
			} else if ((self.DEVICES.length as number) === 1) {
				variableObj.device_name = info.devices[0].name
			}

			break
		}
		case '/OBSBOT/WebCam/General/ZoomInfo': {
			const zoom = parseZoomInfo(args)
			variableObj['zoom'] = zoom.zoom
			variableObj['fov'] = zoom.fov
			break
		}
		case '/OBSBOT/WebCam/General/GetGimbalPosInfoResp': {
			const pos = parseGimbalPosInfo(args)
			variableObj['gimbal_pitch'] = pos.pitch
			variableObj['gimbal_yaw'] = pos.yaw
			break
		}
		case '/OBSBOT/WebCam/General/ConnectedResp': {
			self.updateStatus(InstanceStatus.Ok)
			self.log('info', 'Connected to OBSBOT device successfully.')
			self.sendCommand('/OBSBOT/WebCam/General/GetDeviceInfo', [{ type: 'i', value: 0 }])
			break
		}
	}

	self.setVariableValues(variableObj)
}

function parseDeviceInfo(self: OBSBOTInstance, args: any[]) {
	const deviceInfo: any = {}

	try {
		deviceInfo.devices = [
			{ connected: args[0] === 1, name: args[1] },
			{ connected: args[2] === 1, name: args[3] },
			{ connected: args[4] === 1, name: args[5] },
			{ connected: args[6] === 1, name: args[7] },
		]

		//if not OBS_CENTER_APP, strip off all but first entry
		if (!self.config.model?.toString().includes('OBSBOT_CENTER')) {
			deviceInfo.devices = [deviceInfo.devices[0]]
		}

		deviceInfo.selectedDeviceIndex = args[8]
		deviceInfo.selectedDeviceRunState = args[9] === 1 ? 'Run' : 'Sleep'
		deviceInfo.selectedDeviceType = getDeviceTypeLabel(args[10])
	} catch (_err: any) {
		self.log('debug', 'Failed to parse device info.')
	}

	return deviceInfo
}

function getDeviceTypeLabel(type: number): string {
	switch (type) {
		case 0:
			return 'Tiny'
		case 1:
			return 'Tiny 4K'
		case 2:
			return 'Meet'
		case 3:
			return 'Meet 4K'
		case 5:
			return 'Tail2'
		default:
			return `Unknown (${type})`
	}
}

function parseZoomInfo(args: any[]) {
	return {
		zoom: args[0],
		fov: getFovLabel(args[1]),
	}
}

function getFovLabel(value: number): string {
	switch (value) {
		case 0:
			return '86°'
		case 1:
			return '78°'
		case 2:
			return '65°'
		default:
			return `Unknown (${value})`
	}
}

function parseGimbalPosInfo(args: any[]) {
	return {
		roll: undefined, // Currently unused
		pitch: args[0],
		yaw: args[1],
	}
}

export function SendCommand(
	self: OBSBOTInstance,
	address: string,
	args: OSCArgument[],
	targetIp?: string, // for multi-camera UDP control
): void {
	const { verbose, transport, model, device } = self.config

	if (!self._socket) {
		self.log('error', `OSC socket is not open. Cannot send command: ${address}`)
		return
	}

	const destinationIp = targetIp || self.config.ip

	// Prepend device ID if needed
	if (model?.toString().includes('OBSBOT_CENTER') && address !== '/OBSBOT/WebCam/General/Connected') {
		// Minus 1 because device ID is 1-based in OBSBOT Center and 0-based with OSC
		args = [{ type: 'i', value: device - 1 }, ...args]
	}

	const message = {
		address,
		args: args.map((arg) => ({
			type: arg.type,
			value: arg.value,
		})),
	}

	try {
		if (transport === 'udp') {
			const binary = osc.writePacket(message)
			self._socket.send(binary, 0, binary.length, self.config.port, destinationIp)
		} else {
			self._socket.send(message)
		}

		if (verbose) {
			self.log(
				'debug',
				`Sent: ${address} ${JSON.stringify(args)} via ${transport.toUpperCase()} to ${destinationIp}:${self.config.port}`,
			)
		}
	} catch (err: any) {
		self.log('error', `Failed to send OSC: ${err.message}`)
	}
}
