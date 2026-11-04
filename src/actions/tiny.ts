import type OBSBOTInstance from '../main.js'
import { dropdownField, intArg, OnOff, toInt, triggerPresetAction, valueAction, type Actions } from './helpers.js'

export function addTinyActions(self: OBSBOTInstance, actions: Actions): void {
	actions.OBSBOT_CENTER_TINY_aiLock = valueAction(self, {
		name: 'Center App | Tiny Series | AI Lock On/Off',
		description: 'Set the AI Lock of the camera',
		address: '/OBSBOT/WebCam/Tiny/ToggleAILock',
		field: dropdownField('aiLock', 'AI Lock', OnOff),
		logName: 'AI lock',
	})

	actions.OBSBOT_CENTER_TINY_triggerPreset = triggerPresetAction(
		self,
		'Center App | Tiny Series',
		'/OBSBOT/WebCam/Tiny/TriggerPreset',
	)

	actions.OBSBOT_CENTER_TINY_aiMode = {
		name: 'Center App | Tiny Series | AI Mode',
		description: 'Set the AI Mode of the camera',
		options: [
			dropdownField(
				'camera',
				'Camera',
				[
					{ id: 'tiny2', label: 'Tiny 2' },
					{ id: 'tiny3', label: 'Tiny 3 / Tiny 3 Lite' },
				],
				{ default: 'tiny2', disableAutoExpression: true },
			),
			dropdownField(
				'aiMode',
				'AI Mode',
				[
					{ id: '0', label: 'No Tracking' },
					{ id: '1', label: 'Normal Tracking' },
					{ id: '2', label: 'Upper Body' },
					{ id: '3', label: 'Close Up' },
					{ id: '4', label: 'Headless' },
					{ id: '5', label: 'Lower Body' },
					{ id: '6', label: 'Desk Mode' },
					{ id: '7', label: 'Whiteboard' },
					{ id: '8', label: 'Hand' },
					{ id: '9', label: 'Group' },
				],
				{ isVisibleExpression: '$(options:camera) !== "tiny3"' },
			),
			dropdownField(
				'aiModeTiny3',
				'AI Mode (Tiny 3 / Tiny 3 Lite)',
				[
					{ id: '0', label: 'Human Tracking (Single Mode)' },
					{ id: '1', label: 'Human Tracking (Group Mode)' },
					{ id: '2', label: 'Voice Tracking' },
					{ id: '3', label: 'Desk Mode' },
					{ id: '4', label: 'Hand' },
					{ id: '5', label: 'Whiteboard' },
				],
				{ isVisibleExpression: '$(options:camera) === "tiny3"' },
			),
		],
		callback: ({ options }) => {
			const aiMode = options.camera === 'tiny3' ? options.aiModeTiny3 : options.aiMode
			self.log('info', `Setting AI mode to ${aiMode}.`)
			self.sendCommand('/OBSBOT/WebCam/Tiny/SetAiMode', [intArg(toInt(aiMode))])
		},
	}

	actions.OBSBOT_CENTER_TINY_setTrackingMode = valueAction(self, {
		name: 'Center App | Tiny Series | Set Tracking Mode',
		description: 'Set the tracking mode of the camera',
		address: '/OBSBOT/WebCam/Tiny/SetTrackingMode',
		field: dropdownField('trackingMode', 'Tracking Mode', [
			{ id: '0', label: 'Headroom (not on Tiny 2, Tiny 2 Lite or Tiny SE)' },
			{ id: '1', label: 'Standard' },
			{ id: '2', label: 'Motion (Sport in the Center App)' },
		]),
		logName: 'tracking mode',
	})

	actions.OBSBOT_CENTER_TINY_setTrackingSpeed = valueAction(self, {
		name: 'Center App | Tiny Series | Set Tracking Speed (Tiny 3 only)',
		description: 'Set the tracking speed of the camera. Only available for Tiny 3 and Tiny 3 Lite.',
		address: '/OBSBOT/WebCam/Tiny/SetTrackingSpeed',
		field: dropdownField(
			'trackingSpeed',
			'Tracking Speed',
			[
				{ id: '0', label: 'Slow' },
				{ id: '1', label: 'Standard' },
				{ id: '2', label: 'Fast' },
			],
			{ default: '1' },
		),
		logName: 'tracking speed',
	})
}
