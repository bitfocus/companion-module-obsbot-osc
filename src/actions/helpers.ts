import type { CompanionActionDefinitions, CompanionInputFieldNumber, DropdownChoice } from '@companion-module/base'
import type OBSBOTInstance from '../main.js'
import type { OBSBOTTypes } from '../main.js'

export type Actions = CompanionActionDefinitions<OBSBOTTypes['actions']>
export type Action = Exclude<Actions[string], false | undefined>
type Field = Action['options'][number]
type OptionValue = string | number | undefined

export const OnOff: DropdownChoice[] = [
	{ id: '0', label: 'Off' },
	{ id: '1', label: 'On' },
]

export function toInt(value: OptionValue, fallback = '0'): number {
	return parseInt(value?.toString() || fallback)
}

export function intArg(value: number): OSCArgument {
	return { type: 'i', value }
}

export function intArgs(...values: number[]): OSCArgument[] {
	return values.map(intArg)
}

type NumberFieldOptions = Pick<CompanionInputFieldNumber, 'min' | 'max' | 'default'> &
	Partial<Pick<CompanionInputFieldNumber, 'step' | 'range' | 'tooltip' | 'isVisibleExpression'>>

// Clamped because an expression that lands out of range would otherwise make Companion skip the action
export function numberField(id: string, label: string, options: NumberFieldOptions): Field {
	const { step = 1, range = true, ...rest } = options

	return {
		type: 'number',
		id,
		label,
		step,
		clampValues: true,
		...(step === 1 ? { asInteger: true } : {}),
		...(range ? { range } : {}),
		...rest,
	}
}

export function dropdownField(
	id: string,
	label: string,
	choices: DropdownChoice[],
	options: { default?: string; disableAutoExpression?: boolean; isVisibleExpression?: string } = {},
): Field {
	return { type: 'dropdown', id, label, choices, default: '0', ...options }
}

interface ActionText {
	name: string
	description: string
}

/** Sends one option as the command's only argument */
export function valueAction(
	self: OBSBOTInstance,
	{ address, field, logName, ...text }: ActionText & { address: OSCAddress; field: Field; logName: string },
): Action {
	return {
		...text,
		options: [field],
		callback: (action) => {
			const value = action.options[field.id]
			self.log('info', `Setting ${logName} to ${value}.`)
			self.sendCommand(address, [intArg(toInt(value))])
		},
	}
}

/** Sends a fixed value, for commands that are a start, stop or trigger */
export function commandAction(
	self: OBSBOTInstance,
	{ address, value, log, ...text }: ActionText & { address: OSCAddress; value: number; log: string },
): Action {
	return {
		...text,
		options: [],
		callback: () => {
			self.log('info', log)
			self.sendCommand(address, [intArg(value)])
		},
	}
}

export function triggerPresetAction(self: OBSBOTInstance, namePrefix: string, address: OSCAddress): Action {
	return {
		name: `${namePrefix} | Trigger Preset`,
		description: 'Trigger a preset on the camera',
		options: [numberField('presetNumber', 'Preset Number', { default: 1, min: 1, max: 3 })],
		callback: (action) => {
			self.log('info', `Triggering preset ${action.options.presetNumber}.`)
			// Numbered 1-3 for the user, but 0 based over OSC
			self.sendCommand(address, [intArg(toInt(action.options.presetNumber) - 1)])
		},
	}
}

type CameraAddressPrefix = '/OBSBOT/Camera/Tail2' | '/OBSBOT/Camera/TailAir' | '/OBSBOT/Camera/Tail'

/** Recording, snapshot and preset actions, which each Tail variant has at its own address */
export function addCameraControls(
	self: OBSBOTInstance,
	actions: Actions,
	{ idPrefix, namePrefix, address }: { idPrefix: string; namePrefix: string; address: CameraAddressPrefix },
): void {
	actions[`${idPrefix}_startRecording`] = commandAction(self, {
		name: `${namePrefix} | Start Recording`,
		description: 'Start recording on the camera',
		address: `${address}/SetRecording`,
		value: 1,
		log: 'Starting recording.',
	})
	actions[`${idPrefix}_stopRecording`] = commandAction(self, {
		name: `${namePrefix} | Stop Recording`,
		description: 'Stop recording on the camera',
		address: `${address}/SetRecording`,
		value: 0,
		log: 'Stopping recording.',
	})
	actions[`${idPrefix}_takeSnapshot`] = commandAction(self, {
		name: `${namePrefix} | Take Snapshot`,
		description: 'Take a snapshot on the camera',
		address: `${address}/Snapshot`,
		value: 1,
		log: 'Taking snapshot.',
	})
	actions[`${idPrefix}_triggerPreset`] = triggerPresetAction(self, namePrefix, `${address}/TriggerPreset`)
}
