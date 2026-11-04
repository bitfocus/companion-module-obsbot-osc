import type OBSBOTInstance from '../main.js'
import {
	addCameraControls,
	dropdownField,
	intArg,
	intArgs,
	numberField,
	OnOff,
	toInt,
	valueAction,
	type Actions,
} from './helpers.js'

const CommonAutoZoomModes = [
	{ id: '2', label: 'Half Body' },
	{ id: '3', label: 'Above The Knees' },
	{ id: '4', label: 'Nine Head Portrait' },
	{ id: '5', label: 'Full Body' },
	{ id: '6', label: 'Long Shot 1' },
	{ id: '7', label: 'Long Shot 2' },
]

const AxisModes = [
	{ id: '0', label: 'Manual' },
	{ id: '1', label: 'Auto' },
]

const CustomSpeedVisible = '$(options:mode) === "5"'

export function addTail2Actions(self: OBSBOTInstance, actions: Actions): void {
	actions.OBSBOT_TAIL_2_setAIMode = {
		name: 'Tail 2 | Set AI Mode and Auto Zoom Mode',
		description: 'Set the AI mode and auto zoom mode of the camera',
		options: [
			dropdownField(
				'aiMode',
				'AI Mode',
				[
					{ id: '0', label: 'Single-person' },
					{ id: '1', label: 'Multi-person' },
				],
				{ disableAutoExpression: true },
			),
			dropdownField(
				'autoZoomModeSingle',
				'Auto Zoom Mode',
				[{ id: '0', label: 'None' }, { id: '1', label: 'Close Up' }, ...CommonAutoZoomModes],
				{ isVisibleExpression: '$(options:aiMode) === "0"' },
			),
			dropdownField('autoZoomModeMulti', 'Auto Zoom Mode', [{ id: '0', label: 'None' }, ...CommonAutoZoomModes], {
				isVisibleExpression: '$(options:aiMode) === "1"',
			}),
		],
		callback: ({ options }) => {
			self.log('info', `Setting AI mode to ${options.aiMode}.`)
			self.sendCommand('/OBSBOT/Camera/Tail2/SetAiMode', [intArg(toInt(options.aiMode))])

			const autoZoomMode = options.aiMode === '0' ? options.autoZoomModeSingle : options.autoZoomModeMulti
			self.sendCommand('/OBSBOT/Camera/Tail2/SetAutoZoom', [intArg(toInt(autoZoomMode))])
		},
	}

	actions.OBSBOT_TAIL_2_aiModeEnable = valueAction(self, {
		name: 'Tail 2 | AI Mode On/Off',
		description: 'Set the AI mode of the camera',
		address: '/OBSBOT/Camera/Tail2/SetAiEnable',
		field: dropdownField('aiMode', 'AI Mode', OnOff),
		logName: 'AI Mode',
	})

	actions.OBSBOT_TAIL_2_setTrackingSpeed = {
		name: 'Tail 2 | Set Tracking Speed',
		description: 'Set the tracking speed of the camera',
		options: [
			dropdownField(
				'mode',
				'Mode',
				[
					{ id: '0', label: 'Super Lazy' },
					{ id: '1', label: 'Lazy' },
					{ id: '2', label: 'Slow' },
					{ id: '3', label: 'Fast' },
					{ id: '4', label: 'Crazy' },
					{ id: '5', label: 'Custom' },
				],
				{ disableAutoExpression: true },
			),
			dropdownField('panMode', 'Pan Mode', AxisModes, { isVisibleExpression: CustomSpeedVisible }),
			numberField('panSpeed', 'Pan Speed', { default: 1, min: 1, max: 10, isVisibleExpression: CustomSpeedVisible }),
			dropdownField('pitchMode', 'Pitch Mode', AxisModes, { isVisibleExpression: CustomSpeedVisible }),
			numberField('pitchSpeed', 'Pitch Speed', {
				default: 1,
				min: 1,
				max: 10,
				isVisibleExpression: CustomSpeedVisible,
			}),
		],
		callback: ({ options }) => {
			self.log('info', `Setting tracking speed to ${options.mode}.`)
			const custom =
				options.mode === '5'
					? [toInt(options.panMode), toInt(options.panSpeed), toInt(options.pitchMode), toInt(options.pitchSpeed)]
					: []
			self.sendCommand('/OBSBOT/Camera/Tail2/SetTrackingSpeed', intArgs(toInt(options.mode), ...custom))
		},
	}

	actions.OBSBOT_TAIL_2_setOnlyMe = valueAction(self, {
		name: 'Tail 2 | Set Only Me On/Off',
		description: 'Set the Only Me mode of the camera',
		address: '/OBSBOT/Camera/Tail2/SetOnlyMe',
		field: dropdownField('onlyMe', 'Only Me', OnOff),
		logName: 'Only Me',
	})

	addCameraControls(self, actions, {
		idPrefix: 'OBSBOT_TAIL_2',
		namePrefix: 'Tail 2',
		address: '/OBSBOT/Camera/Tail2',
	})
}
