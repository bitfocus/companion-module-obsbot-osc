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

/** Tail 2 and Tail 2 ADV share their AI commands, at their own address */
export interface Tail2Variant {
	idPrefix: string
	namePrefix: string
	address: '/OBSBOT/Camera/Tail2' | '/OBSBOT/Camera/Tail2ADV'
	onlyMe: boolean
	/** Tail 2 ADV ignores a tracking speed sent without the four custom values */
	alwaysSendCustomSpeeds: boolean
}

// What Tail 2 ADV was verified to accept alongside a preset speed: both axes manual, at speed 1
const PlaceholderCustomSpeeds = [0, 1, 0, 1]

export const Tail2: Tail2Variant = {
	idPrefix: 'OBSBOT_TAIL_2',
	namePrefix: 'Tail 2',
	address: '/OBSBOT/Camera/Tail2',
	onlyMe: true,
	alwaysSendCustomSpeeds: false,
}

export const Tail2ADV: Tail2Variant = {
	idPrefix: 'OBSBOT_TAIL_2_ADV',
	namePrefix: 'Tail 2 ADV',
	address: '/OBSBOT/Camera/Tail2ADV',
	onlyMe: false,
	alwaysSendCustomSpeeds: true,
}

export function addTail2Actions(self: OBSBOTInstance, actions: Actions, variant: Tail2Variant): void {
	const { idPrefix, namePrefix, address } = variant

	actions[`${idPrefix}_setAIMode`] = {
		name: `${namePrefix} | Set AI Mode and Auto Zoom Mode`,
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
			self.sendCommand(`${address}/SetAiMode`, [intArg(toInt(options.aiMode))])

			const autoZoomMode = options.aiMode === '0' ? options.autoZoomModeSingle : options.autoZoomModeMulti
			self.sendCommand(`${address}/SetAutoZoom`, [intArg(toInt(autoZoomMode))])
		},
	}

	actions[`${idPrefix}_aiModeEnable`] = valueAction(self, {
		name: `${namePrefix} | AI Mode On/Off`,
		description: 'Set the AI mode of the camera',
		address: `${address}/SetAiEnable`,
		field: dropdownField('aiMode', 'AI Mode', OnOff),
		logName: 'AI Mode',
	})

	actions[`${idPrefix}_setTrackingSpeed`] = {
		name: `${namePrefix} | Set Tracking Speed`,
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
			let custom: number[] = []
			if (options.mode === '5') {
				custom = [toInt(options.panMode), toInt(options.panSpeed), toInt(options.pitchMode), toInt(options.pitchSpeed)]
			} else if (variant.alwaysSendCustomSpeeds) {
				custom = PlaceholderCustomSpeeds
			}
			self.sendCommand(`${address}/SetTrackingSpeed`, intArgs(toInt(options.mode), ...custom))
		},
	}

	if (variant.onlyMe) {
		actions[`${idPrefix}_setOnlyMe`] = valueAction(self, {
			name: `${namePrefix} | Set Only Me On/Off`,
			description: 'Set the Only Me mode of the camera',
			address: '/OBSBOT/Camera/Tail2/SetOnlyMe',
			field: dropdownField('onlyMe', 'Only Me', OnOff),
			logName: 'Only Me',
		})
	}

	addCameraControls(self, actions, { idPrefix, namePrefix, address })
}
