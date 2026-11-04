import { PollDeviceState } from '../api.js'
import type OBSBOTInstance from '../main.js'
import type { Model } from '../models.js'
import { intArgs, type Action, type Actions } from './helpers.js'

/** Refresh the variables and feedbacks on demand */
export function addQueryActions(self: OBSBOTInstance, actions: Actions, model: Model): void {
	const query = (name: string, description: string, address: OSCAddress): Action => ({
		name: `Query | ${name}`,
		description,
		options: [],
		callback: () => self.sendCommand(address, intArgs(0)),
	})

	actions.refreshState = {
		name: 'Query | Refresh Device State',
		description: 'Request the device info, zoom and gimbal position, plus any model specific state',
		options: [],
		callback: () => {
			self.log('info', 'Refreshing device state.')
			PollDeviceState(self)
		},
	}

	actions.getDeviceInfo = query(
		'Get Device Info',
		'Request the device information',
		'/OBSBOT/WebCam/General/GetDeviceInfo',
	)
	actions.getZoomInfo = query(
		'Get Zoom Info',
		'Request the current zoom level and field of view',
		'/OBSBOT/WebCam/General/GetZoomInfo',
	)
	actions.getGimbalPosInfo = query(
		'Get Gimbal Position Info',
		'Request the current gimbal pitch and yaw',
		'/OBSBOT/WebCam/General/GetGimbalPosInfo',
	)

	if (model.family === 'tiny') {
		actions.getAiTrackingInfo = query(
			'Get AI Tracking Info',
			'Request the current AI tracking lock state',
			'/OBSBOT/WebCam/Tiny/GetAiTrackingInfo',
		)
		actions.getPresetPositionInfo = query(
			'Get Preset Position Info',
			'Request which preset positions are saved and their names',
			'/OBSBOT/WebCam/Tiny/GetPresetPositionInfo',
		)
	}

	if (model.family === 'meet') {
		actions.getVirtualBackgroundInfo = query(
			'Get Virtual Background Info',
			'Request the current virtual background mode',
			'/OBSBOT/WebCam/Meet/GetVirtualBackgroundInfo',
		)
		actions.getAutoFramingInfo = query(
			'Get Auto Framing Info',
			'Request the current auto framing mode',
			'/OBSBOT/WebCam/Meet/GetAutoFramingInfo',
		)
		actions.getPresetPositionInfo = query(
			'Get Preset Position Info',
			'Request which preset positions are saved and their names. Only supported on Meet Flip',
			'/OBSBOT/WebCam/Meet/GetPresetPositionInfo',
		)
	}
}
