import type { DropdownChoice } from '@companion-module/base'
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

const CustomTrackingMode = '5'
const CustomSpeedVisible = `$(options:mode) === "${CustomTrackingMode}"`

/** Tail 2, Tail 2 ADV and Tail Air 2 share their AI commands, each at its own address */
export interface AiCameraVariant {
	idPrefix: string
	namePrefix: string
	address: '/OBSBOT/Camera/Tail2' | '/OBSBOT/Camera/Tail2ADV' | '/OBSBOT/Camera/TailAir2'
	/** Null where the model has no such command */
	aiEnableAddress: OSCAddress | null
	onlyMeAddress: OSCAddress | null
	autoZoomMax: number
	/** Every model numbers Custom as 5, but they start their presets at different numbers */
	trackingModes: DropdownChoice[]
	customSpeedMax: number
	/** Tail 2 ADV ignores a tracking speed sent without the four custom values */
	alwaysSendCustomSpeeds: boolean
}

// What Tail 2 ADV was verified to accept alongside a preset speed: both axes manual, at speed 1
const PlaceholderCustomSpeeds = [0, 1, 0, 1]

const Tail2TrackingModes: DropdownChoice[] = [
	{ id: '0', label: 'Super Lazy' },
	{ id: '1', label: 'Lazy' },
	{ id: '2', label: 'Slow' },
	{ id: '3', label: 'Fast' },
	{ id: '4', label: 'Crazy' },
	{ id: CustomTrackingMode, label: 'Custom' },
]

export const Tail2: AiCameraVariant = {
	idPrefix: 'OBSBOT_TAIL_2',
	namePrefix: 'Tail 2',
	address: '/OBSBOT/Camera/Tail2',
	aiEnableAddress: '/OBSBOT/Camera/Tail2/SetAiEnable',
	onlyMeAddress: '/OBSBOT/Camera/Tail2/SetOnlyMe',
	autoZoomMax: 7,
	trackingModes: Tail2TrackingModes,
	customSpeedMax: 10,
	alwaysSendCustomSpeeds: false,
}

export const Tail2ADV: AiCameraVariant = {
	idPrefix: 'OBSBOT_TAIL_2_ADV',
	namePrefix: 'Tail 2 ADV',
	address: '/OBSBOT/Camera/Tail2ADV',
	aiEnableAddress: '/OBSBOT/Camera/Tail2ADV/SetAiEnable',
	onlyMeAddress: null,
	autoZoomMax: 7,
	trackingModes: Tail2TrackingModes,
	customSpeedMax: 10,
	alwaysSendCustomSpeeds: true,
}

// The spec gives the tracking speed range as 0-3, but its notes number the modes 2-5, which is what's used here
export const TailAir2: AiCameraVariant = {
	idPrefix: 'OBSBOT_TAIL_AIR_2',
	namePrefix: 'Tail Air 2',
	address: '/OBSBOT/Camera/TailAir2',
	aiEnableAddress: null,
	onlyMeAddress: null,
	autoZoomMax: 5,
	trackingModes: [
		{ id: '2', label: 'Slow' },
		{ id: '3', label: 'Standard' },
		{ id: '4', label: 'Fast' },
		{ id: CustomTrackingMode, label: 'Custom' },
	],
	customSpeedMax: 5,
	// Its spec types the command as five values, which Tail 2 ADV also needs
	alwaysSendCustomSpeeds: true,
}

export function addAiCameraActions(self: OBSBOTInstance, actions: Actions, variant: AiCameraVariant): void {
	const { idPrefix, namePrefix, address, customSpeedMax } = variant
	const autoZoomModes = CommonAutoZoomModes.filter(({ id }) => Number(id) <= variant.autoZoomMax)

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
				[{ id: '0', label: 'None' }, { id: '1', label: 'Close Up' }, ...autoZoomModes],
				{ isVisibleExpression: '$(options:aiMode) === "0"' },
			),
			dropdownField('autoZoomModeMulti', 'Auto Zoom Mode', [{ id: '0', label: 'None' }, ...autoZoomModes], {
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

	if (variant.aiEnableAddress) {
		actions[`${idPrefix}_aiModeEnable`] = valueAction(self, {
			name: `${namePrefix} | AI Mode On/Off`,
			description: 'Set the AI mode of the camera',
			address: variant.aiEnableAddress,
			field: dropdownField('aiMode', 'AI Mode', OnOff),
			logName: 'AI Mode',
		})
	}

	actions[`${idPrefix}_setTrackingSpeed`] = {
		name: `${namePrefix} | Set Tracking Speed`,
		description: 'Set the tracking speed of the camera',
		options: [
			dropdownField('mode', 'Mode', variant.trackingModes, {
				default: variant.trackingModes[0].id.toString(),
				disableAutoExpression: true,
			}),
			dropdownField('panMode', 'Pan Mode', AxisModes, { isVisibleExpression: CustomSpeedVisible }),
			numberField('panSpeed', 'Pan Speed', {
				default: 1,
				min: 1,
				max: customSpeedMax,
				isVisibleExpression: CustomSpeedVisible,
			}),
			dropdownField('pitchMode', 'Pitch Mode', AxisModes, { isVisibleExpression: CustomSpeedVisible }),
			numberField('pitchSpeed', 'Pitch Speed', {
				default: 1,
				min: 1,
				max: customSpeedMax,
				isVisibleExpression: CustomSpeedVisible,
			}),
		],
		callback: ({ options }) => {
			self.log('info', `Setting tracking speed to ${options.mode}.`)
			let custom: number[] = []
			if (options.mode === CustomTrackingMode) {
				custom = [toInt(options.panMode), toInt(options.panSpeed), toInt(options.pitchMode), toInt(options.pitchSpeed)]
			} else if (variant.alwaysSendCustomSpeeds) {
				custom = PlaceholderCustomSpeeds
			}
			self.sendCommand(`${address}/SetTrackingSpeed`, intArgs(toInt(options.mode), ...custom))
		},
	}

	if (variant.onlyMeAddress) {
		actions[`${idPrefix}_setOnlyMe`] = valueAction(self, {
			name: `${namePrefix} | Set Only Me On/Off`,
			description: 'Set the Only Me mode of the camera',
			address: variant.onlyMeAddress,
			field: dropdownField('onlyMe', 'Only Me', OnOff),
			logName: 'Only Me',
		})
	}

	addCameraControls(self, actions, { idPrefix, namePrefix, address })
}
