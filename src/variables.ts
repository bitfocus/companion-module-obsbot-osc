import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'

export function UpdateVariableDefinitions(self: OBSBOTInstance): void {
	const variables: CompanionVariableDefinition[] = []

	if (self.STATE.devices.length > 1) {
		for (let i = 0; i < self.STATE.devices.length; i++) {
			variables.push({ variableId: `device${i + 1}_connected`, name: `Device ${i + 1} Connected` })
			variables.push({ variableId: `device${i + 1}_name`, name: `Device ${i + 1} Name` })
		}

		variables.push({ variableId: 'selected_index', name: 'Selected Device Index (0 based)' })
		variables.push({ variableId: 'selected_device', name: 'Selected Device Number (1 based)' })
		variables.push({ variableId: 'selected_state', name: 'Selected Device Run State' })
		variables.push({ variableId: 'selected_name', name: 'Selected Device Name' })
		variables.push({ variableId: 'selected_connected', name: 'Selected Device Connected' })
	} else if (self.STATE.devices.length === 1) {
		variables.push({ variableId: 'device_name', name: 'Device Name' })
		variables.push({ variableId: 'device_connected', name: 'Device Connected' })
	}

	variables.push({ variableId: 'zoom', name: 'Zoom Level' })
	variables.push({ variableId: 'fov', name: 'Field of View' })
	variables.push({ variableId: 'gimbal_roll', name: 'Gimbal Roll' })
	variables.push({ variableId: 'gimbal_pitch', name: 'Gimbal Pitch' })
	variables.push({ variableId: 'gimbal_yaw', name: 'Gimbal Yaw' })

	if (self.config.model === 'OBSBOT_CENTER_TINY') {
		variables.push({ variableId: 'ai_tracking', name: 'AI Tracking Lock State' })
	}

	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		variables.push({ variableId: 'virtual_background', name: 'Virtual Background Mode' })
		variables.push({ variableId: 'auto_framing', name: 'Auto Framing Mode' })
	}

	if (
		self.config.model === 'OBSBOT_CENTER_TINY' ||
		self.config.model === 'OBSBOT_CENTER_MEET' ||
		self.config.model === 'OBSBOT_TAIL_2'
	) {
		for (let i = 1; i <= 3; i++) {
			variables.push({ variableId: `preset${i}_exists`, name: `Preset Position ${i} Saved` })
			variables.push({ variableId: `preset${i}_name`, name: `Preset Position ${i} Name` })
		}

		variables.push({ variableId: 'preset_count', name: 'Saved Preset Position Count' })
	}

	self.setVariableDefinitions(variables)
}

export function CheckVariables(self: OBSBOTInstance): void {
	const variableValues: CompanionVariableValues = {}

	self.setVariableValues(variableValues)
}
