import type { CompanionVariableValues } from '@companion-module/base'
import type { ModuleConfig } from './config.js'
import type OBSBOTInstance from './main.js'
import { findModel } from './models.js'
import { parseReply } from './replies.js'
import type { OSCOutgoingMessage } from './transport.js'

export function PollDeviceState(self: OBSBOTInstance): void {
	for (const query of findModel(self.config.model)?.pollQueries ?? []) {
		self.sendCommand(query, [{ type: 'i', value: 0 }])
	}
}

export function HandleReply(self: OBSBOTInstance, address: string, args: OSCValue[]): void {
	const reply = parseReply(address, args, self.config.model)

	if (!reply) {
		return
	}

	const variables: CompanionVariableValues = {}

	switch (reply.kind) {
		case 'malformed':
			if (self.config.verbose) {
				self.log('debug', `Ignoring malformed reply: ${address} ${JSON.stringify(args)}`)
			}
			return
		case 'deviceInfo': {
			const { devices, selectedDeviceIndex, selectedDeviceRunState } = reply
			const deviceCountChanged = devices.length !== self.STATE.devices.length

			self.STATE.devices = devices
			self.STATE.selectedDeviceIndex = selectedDeviceIndex
			self.STATE.selectedDeviceAwake = selectedDeviceRunState === 'Run'

			// The available variables depend on how many devices there are, and this reply arrives every poll
			if (deviceCountChanged) {
				self.updateVariableDefinitions()
			}

			if (devices.length > 1) {
				devices.forEach((device, index) => {
					variables[`device${index + 1}_connected`] = device.connected ? 'Connected' : 'Disconnected'
					variables[`device${index + 1}_name`] = device.name
				})

				variables.selected_index = selectedDeviceIndex
				//1-based to match the Center App UI and the Device ID config field
				variables.selected_device = selectedDeviceIndex + 1
				variables.selected_state = selectedDeviceRunState

				const selected = devices[selectedDeviceIndex]
				variables.selected_name = selected ? selected.name : ''
				variables.selected_connected = selected?.connected ? 'Connected' : 'Disconnected'
			} else if (devices.length === 1) {
				variables.device_name = devices[0].name
				variables.device_connected = devices[0].connected ? 'Connected' : 'Disconnected'
			}

			self.checkFeedbacks('deviceConnected', 'selectedDeviceAwake')
			break
		}
		case 'zoom':
			self.STATE.zoom = reply.zoom
			self.STATE.fov = reply.fov
			variables.zoom = reply.zoom
			variables.fov = reply.fovLabel
			self.checkFeedbacks('zoomLevel', 'fieldOfView')
			break
		case 'gimbal':
			self.STATE.gimbalPitch = reply.pitch
			self.STATE.gimbalYaw = reply.yaw
			variables.gimbal_pitch = reply.pitch
			variables.gimbal_yaw = reply.yaw
			self.checkFeedbacks('gimbalPosition')
			break
		case 'aiTracking':
			self.STATE.aiTrackingLocked = reply.locked
			variables.ai_tracking = reply.locked ? 'Locked' : 'Unlocked'
			self.checkFeedbacks('aiTrackingLocked')
			break
		case 'presets':
			self.STATE.presets = reply.presets
			reply.presets.forEach((preset, index) => {
				variables[`preset${index + 1}_exists`] = preset.exists ? 'Yes' : 'No'
				variables[`preset${index + 1}_name`] = preset.name
			})
			variables.preset_count = reply.presets.filter((preset) => preset.exists).length
			self.checkFeedbacks('presetExists')
			break
		case 'virtualBackground':
			self.STATE.virtualBackground = reply.value
			variables.virtual_background = reply.label
			self.checkFeedbacks('virtualBackground')
			break
		case 'autoFraming':
			self.STATE.autoFraming = reply.value
			variables.auto_framing = reply.label
			self.checkFeedbacks('autoFraming')
			break
	}

	self.setVariableValues(variables)
}

// Commands that take a single argument with no leading device selector, per the OBSBOT Center OSC spec
const AddressesWithoutDeviceId: OSCAddress[] = [
	'/OBSBOT/WebCam/General/GetDeviceInfo', // Not in the spec, but Center App ignores it with a device ID
	'/OBSBOT/WebCam/General/Connected',
	'/OBSBOT/WebCam/General/Disconnected',
	'/OBSBOT/WebCam/General/SelectDevice',
	'/OBSBOT/WebCam/General/SetPCRecording',
	'/OBSBOT/WebCam/General/SetHighfpsRecording',
	'/OBSBOT/WebCam/General/PCSnapshot',
]

export function BuildMessage(
	{ model, device }: Pick<ModuleConfig, 'model' | 'device'>,
	address: OSCAddress,
	args: OSCArgument[],
): OSCOutgoingMessage {
	if (findModel(model)?.isCenterApp && !AddressesWithoutDeviceId.includes(address)) {
		// Minus 1 because device ID is 1-based in OBSBOT Center and 0-based with OSC
		return { address, args: [{ type: 'i', value: device - 1 }, ...args] }
	}

	return { address, args }
}
