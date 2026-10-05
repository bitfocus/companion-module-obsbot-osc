import { InstanceStatus, type CompanionVariableValues } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'
import type { DeviceEntry, PresetPosition } from './state.js'
import osc from 'osc'
import dns from 'node:dns/promises'
import { OSCTCPPort } from './tcp.js'

export async function InitConnection(self: OBSBOTInstance): Promise<void> {
	const { ip, port, transport, verbose } = self.config

	if (verbose) {
		self.log('debug', `Connecting to OBSBOT at ${ip}:${port} via ${transport.toUpperCase()}`)
	}

	self.updateStatus(InstanceStatus.Connecting)

	// Cleanup previous socket
	CloseConnection(self)
	self._reconnecting = false
	self._lastMessageAt = Date.now()

	await ResolveDeviceAddress(self)

	if (transport === 'udp') {
		// Shared UDP socket on fixed OBSBOT response port 57120
		self._socket = self.createSharedUdpSocket('udp4', (msg, rinfo) => CheckMessage(self, msg, rinfo))

		self._socket.bind(self.config.listenport, '0.0.0.0', () => {
			self.log('info', `Shared UDP socket listening on port ${self.config.listenport}`)
			SendCommand(self, '/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
		})

		self._socket.on('error', (err: Error) => {
			self.log('error', `UDP socket error: ${err.message}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
		})

		StartPolling(self)
	} else {
		// TCP connection
		self._socket = new OSCTCPPort(ip, port)

		self._socket.on('ready', () => {
			self.log('info', `TCP connection established to ${ip}:${port}`)
			self.updateStatus(InstanceStatus.Ok)
			SendCommand(self, '/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
			StartPolling(self)
		})

		self._socket.on('close', () => {
			self.log('warn', 'TCP connection closed.')
			self.updateStatus(InstanceStatus.Disconnected)
			ScheduleReconnect(self)
		})

		self._socket.on('message', (msg) => {
			if (msg.address) {
				self.log('debug', `Received: ${msg.address} ${JSON.stringify(msg.args)}`)
				processData(self, msg.address, msg.args)
			}
		})

		self._socket.on('error', (err: Error) => {
			self.log('error', `TCP error: ${err.message}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			ScheduleReconnect(self)
		})

		self._socket.open()
	}
}

const ReconnectDelay = 5000

function ScheduleReconnect(self: OBSBOTInstance): void {
	if (self._reconnecting) {
		return
	}

	self._reconnecting = true
	StopPolling(self)

	self._reconnectTimer = setTimeout(() => {
		self._reconnectTimer = undefined
		self.log('info', 'Attempting to reconnect...')
		void self.initConnection()
	}, ReconnectDelay)
}

// The device only pushes zoom/gimbal/device info when asked, so poll for it
function StartPolling(self: OBSBOTInstance): void {
	StopPolling(self)

	const interval = self.config.pollinterval

	if (!interval) {
		return
	}

	self._pollTimer = setInterval(() => PollDeviceState(self), interval * 1000)
	PollDeviceState(self)
}

function StopPolling(self: OBSBOTInstance): void {
	if (self._pollTimer) {
		clearInterval(self._pollTimer)
		self._pollTimer = undefined
	}
}

export function PollDeviceState(self: OBSBOTInstance): void {
	CheckForSilence(self)

	const noop: OSCArgument[] = [{ type: 'i', value: 0 }]

	SendCommand(self, '/OBSBOT/WebCam/General/GetDeviceInfo', noop)
	SendCommand(self, '/OBSBOT/WebCam/General/GetZoomInfo', noop)
	SendCommand(self, '/OBSBOT/WebCam/General/GetGimbalPosInfo', noop)

	switch (self.config.model) {
		case 'OBSBOT_CENTER_TINY':
			SendCommand(self, '/OBSBOT/WebCam/Tiny/GetAiTrackingInfo', noop)
			SendCommand(self, '/OBSBOT/WebCam/Tiny/GetPresetPositionInfo', noop)
			break
		case 'OBSBOT_CENTER_MEET':
			SendCommand(self, '/OBSBOT/WebCam/Meet/GetVirtualBackgroundInfo', noop)
			SendCommand(self, '/OBSBOT/WebCam/Meet/GetAutoFramingInfo', noop)
			SendCommand(self, '/OBSBOT/WebCam/Meet/GetPresetPositionInfo', noop)
			break
	}
}

/**
 * The UDP socket has no notion of a connection, so a device that never answers would
 * otherwise sit at "Connecting" forever. Treat prolonged silence as a failure, and
 * re-resolve in case a hostname now points somewhere else.
 */
function CheckForSilence(self: OBSBOTInstance): void {
	const timeout = Math.max(self.config.pollinterval * 3, 15) * 1000

	if (Date.now() - self._lastMessageAt < timeout) {
		return
	}

	self.updateStatus(InstanceStatus.ConnectionFailure, `No response from ${self.config.ip}`)
	void ResolveDeviceAddress(self)
}

export function CloseConnection(self: OBSBOTInstance): void {
	StopPolling(self)

	if (self._reconnectTimer) {
		clearTimeout(self._reconnectTimer)
		self._reconnectTimer = undefined
	}

	if (!self._socket) {
		return
	}

	try {
		SendCommand(self, '/OBSBOT/WebCam/General/Disconnected', [{ type: 'i', value: 0 }])
	} catch (e) {
		self.log('debug', `Failed to send disconnect notification: ${e}`)
	}

	try {
		self._socket.close()
	} catch (e) {
		self.log('warn', `Failed to close socket: ${e}`)
	}

	self._socket = undefined
}

/**
 * Replies arrive from the device's numeric address, so a hostname in the config
 * (such as an mDNS `.local` name) never matches what dgram reports. Resolve it up
 * front and compare against that instead.
 */
export async function ResolveDeviceAddress(self: OBSBOTInstance): Promise<void> {
	const host = self.config.ip

	if (!host) {
		self._resolvedIp = undefined
		return
	}

	try {
		const { address } = await dns.lookup(host, { family: 4 })
		self._resolvedIp = address

		if (self.config.verbose && address !== host) {
			self.log('debug', `Resolved ${host} to ${address}`)
		}
	} catch (err) {
		self._resolvedIp = undefined
		self.log('warn', `Could not resolve ${host}: ${err instanceof Error ? err.message : err}`)
	}
}

function isFromDevice(self: OBSBOTInstance, address: string): boolean {
	return address === self.config.ip || address === self._resolvedIp
}

function CheckMessage(self: OBSBOTInstance, msg: Buffer, rinfo: { address: string; port: number }): void {
	try {
		if (isFromDevice(self, rinfo.address)) {
			const packet = osc.readPacket(msg, {})
			const messages = 'packets' in packet ? packet.packets : [packet]

			for (const message of messages) {
				if (message.address) {
					processData(self, message.address, message.args)
				}
			}
		} else if (self.config.verbose) {
			self.log('debug', `Ignoring packet from ${rinfo.address}, expected ${self._resolvedIp ?? self.config.ip}`)
		}
	} catch (_err) {
		//self.log('error', `OSC decode error: ${err.message}`)
	}
}

// osc.js hands back whatever the device encoded, so narrow before using it
function toNumber(value: OSCValue | undefined): number {
	return typeof value === 'number' ? value : Number(value)
}

function toText(value: OSCValue | undefined): string {
	return value === undefined ? '' : String(value)
}

// In Center App these replies are prefixed with the device index, hardware devices send them bare
const RepliesWithDeviceId = [
	'/OBSBOT/WebCam/General/DeviceInfo',
	'/OBSBOT/WebCam/General/ZoomInfo',
	'/OBSBOT/WebCam/Tiny/AiTrackingInfo',
	'/OBSBOT/WebCam/Tiny/PresetPositionInfo',
	'/OBSBOT/WebCam/Meet/VirtualBackgroundInfo',
	'/OBSBOT/WebCam/Meet/AutoFramingInfo',
	'/OBSBOT/WebCam/Meet/PresetPositionInfo',
]

function processData(self: OBSBOTInstance, address: string, rawArgs: OSCValue[]): void {
	if (self.config.verbose) {
		self.log('debug', `Processing message: ${address} ${JSON.stringify(rawArgs)}`)
	}

	const args =
		self.config.model?.toString().includes('OBSBOT_CENTER') && RepliesWithDeviceId.includes(address)
			? rawArgs.slice(1)
			: rawArgs

	//if we got any data, let's say the module status is ok
	self._lastMessageAt = Date.now()
	self.updateStatus(InstanceStatus.Ok)

	const variableObj: CompanionVariableValues = {}

	switch (address) {
		case '/OBSBOT/WebCam/General/DeviceInfo': {
			const info = parseDeviceInfo(self, args)

			if (!info.devices) {
				break
			}

			self.STATE.devices = info.devices
			self.STATE.selectedDeviceIndex = info.selectedDeviceIndex
			self.STATE.selectedDeviceAwake = info.selectedDeviceRunState === 'Run'
			self.updateVariableDefinitions()

			if (info.devices.length > 1) {
				info.devices.forEach((device, index) => {
					variableObj[`device${index + 1}_connected`] = device.connected ? 'Connected' : 'Disconnected'
					variableObj[`device${index + 1}_name`] = device.name
				})

				variableObj['selected_index'] = info.selectedDeviceIndex
				//1-based to match the Center App UI and the Device ID config field
				variableObj['selected_device'] = info.selectedDeviceIndex + 1
				variableObj['selected_state'] = info.selectedDeviceRunState
				variableObj['selected_type'] = info.selectedDeviceType

				const selected = info.devices[info.selectedDeviceIndex]
				variableObj['selected_name'] = selected ? selected.name : ''
				variableObj['selected_connected'] = selected?.connected ? 'Connected' : 'Disconnected'
			} else if (info.devices.length === 1) {
				variableObj.device_name = info.devices[0].name
				variableObj.device_connected = info.devices[0].connected ? 'Connected' : 'Disconnected'
			}

			self.checkFeedbacks('deviceConnected', 'selectedDeviceAwake')
			break
		}
		case '/OBSBOT/WebCam/General/ZoomInfo': {
			const zoom = parseZoomInfo(args)

			self.STATE.zoom = toNumber(args[0])
			self.STATE.fov = toNumber(args[1])

			variableObj['zoom'] = zoom.zoom
			variableObj['fov'] = zoom.fov

			self.checkFeedbacks('zoomLevel', 'fieldOfView')
			break
		}
		case '/OBSBOT/WebCam/General/GetGimbalPosInfoResp': {
			const pos = parseGimbalPosInfo(args)

			self.STATE.gimbalRoll = pos.roll
			self.STATE.gimbalPitch = pos.pitch
			self.STATE.gimbalYaw = pos.yaw

			variableObj['gimbal_roll'] = pos.roll
			variableObj['gimbal_pitch'] = pos.pitch
			variableObj['gimbal_yaw'] = pos.yaw

			self.checkFeedbacks('gimbalPosition')
			break
		}
		case '/OBSBOT/WebCam/Tiny/AiTrackingInfo': {
			self.STATE.aiTrackingLocked = args[0] === 1
			variableObj['ai_tracking'] = self.STATE.aiTrackingLocked ? 'Locked' : 'Unlocked'
			self.checkFeedbacks('aiTrackingLocked')
			break
		}
		case '/OBSBOT/WebCam/Tiny/PresetPositionInfo':
		case '/OBSBOT/WebCam/Meet/PresetPositionInfo': {
			self.STATE.presets = parsePresetPositionInfo(args)

			for (let i = 0; i < self.STATE.presets.length; i++) {
				variableObj[`preset${i + 1}_exists`] = self.STATE.presets[i].exists ? 'Yes' : 'No'
				variableObj[`preset${i + 1}_name`] = self.STATE.presets[i].name
			}

			variableObj['preset_count'] = self.STATE.presets.filter((preset) => preset.exists).length

			self.checkFeedbacks('presetExists')
			break
		}
		case '/OBSBOT/WebCam/Meet/VirtualBackgroundInfo': {
			self.STATE.virtualBackground = toNumber(args[0])
			variableObj['virtual_background'] = getVirtualBackgroundLabel(toNumber(args[0]))
			self.checkFeedbacks('virtualBackground')
			break
		}
		case '/OBSBOT/WebCam/Meet/AutoFramingInfo': {
			self.STATE.autoFraming = toNumber(args[0])
			variableObj['auto_framing'] = getAutoFramingLabel(toNumber(args[0]))
			self.checkFeedbacks('autoFraming')
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

interface ParsedDeviceInfo {
	devices?: DeviceEntry[]
	selectedDeviceIndex: number
	selectedDeviceRunState: string
	selectedDeviceType: string
}

function parseDeviceInfo(self: OBSBOTInstance, args: OSCValue[]): ParsedDeviceInfo {
	const deviceInfo: ParsedDeviceInfo = {
		selectedDeviceIndex: 0,
		selectedDeviceRunState: 'Sleep',
		selectedDeviceType: '',
	}

	try {
		deviceInfo.devices = [
			{ connected: args[0] === 1, name: toText(args[1]) },
			{ connected: args[2] === 1, name: toText(args[3]) },
			{ connected: args[4] === 1, name: toText(args[5]) },
			{ connected: args[6] === 1, name: toText(args[7]) },
		]

		//if not OBS_CENTER_APP, strip off all but first entry
		if (!self.config.model?.toString().includes('OBSBOT_CENTER')) {
			deviceInfo.devices = [deviceInfo.devices[0]]
		}

		deviceInfo.selectedDeviceIndex = toNumber(args[8])
		deviceInfo.selectedDeviceRunState = args[9] === 1 ? 'Run' : 'Sleep'
		deviceInfo.selectedDeviceType = getDeviceTypeLabel(toNumber(args[10]))
	} catch (_err) {
		self.log('debug', 'Failed to parse device info.')
	}

	return deviceInfo
}

// The OSC spec only documents types 0-3; 4 is unassigned and 5 has been observed on Tail 2 hardware
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

// Replies carry three preset slots as [exists, name] pairs
function parsePresetPositionInfo(args: OSCValue[]): PresetPosition[] {
	const presets: PresetPosition[] = []

	for (let i = 0; i < 3; i++) {
		presets.push({ exists: args[i * 2] === 1, name: toText(args[i * 2 + 1]) })
	}

	return presets
}

export function getVirtualBackgroundLabel(value: number): string {
	switch (value) {
		case 0:
			return 'Disabled'
		case 1:
			return 'Blur'
		case 2:
			return 'Green Screen'
		case 3:
			return 'Replacement'
		default:
			return `Unknown (${value})`
	}
}

export function getAutoFramingLabel(value: number): string {
	switch (value) {
		case 0:
			return 'Disabled'
		case 1:
			return 'Single Mode'
		case 2:
			return 'Group Mode'
		default:
			return `Unknown (${value})`
	}
}

function parseZoomInfo(args: OSCValue[]) {
	return {
		zoom: toNumber(args[0]),
		fov: getFovLabel(toNumber(args[1])),
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

function parseGimbalPosInfo(args: OSCValue[]) {
	return {
		roll: toNumber(args[0]), // Reported as unused by the spec, exposed anyway
		pitch: toNumber(args[1]),
		yaw: toNumber(args[2]),
	}
}

// Commands that take a single argument with no leading device selector, per the OBSBOT Center OSC spec
const AddressesWithoutDeviceId = [
	'/OBSBOT/WebCam/General/Connected',
	'/OBSBOT/WebCam/General/Disconnected',
	'/OBSBOT/WebCam/General/SelectDevice',
	'/OBSBOT/WebCam/General/SetPCRecording',
	'/OBSBOT/WebCam/General/SetHighfpsRecording',
	'/OBSBOT/WebCam/General/PCSnapshot',
]

export function SendCommand(
	self: OBSBOTInstance,
	address: OSCAddress,
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
	if (model?.toString().includes('OBSBOT_CENTER') && !AddressesWithoutDeviceId.includes(address)) {
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
		if ('open' in self._socket) {
			self._socket.send(message)
		} else {
			const binary = osc.writePacket(message)
			//wrap without copying so the shared socket's Buffer overload applies
			const buffer = Buffer.from(binary.buffer, binary.byteOffset, binary.byteLength)
			self._socket.send(buffer, 0, buffer.length, self.config.port, destinationIp)
		}

		if (verbose) {
			self.log(
				'debug',
				`Sent: ${address} ${JSON.stringify(args)} via ${transport.toUpperCase()} to ${destinationIp}:${self.config.port}`,
			)
		}
	} catch (err) {
		self.log('error', `Failed to send OSC: ${err instanceof Error ? err.message : err}`)
	}
}
