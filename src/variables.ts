import type { CompanionVariableDefinitions, CompanionVariableValues } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'

export function UpdateVariableDefinitions(self: OBSBOTInstance): void {
	const variables: CompanionVariableDefinitions = {}

	if (self.STATE.devices.length > 1) {
		for (let i = 0; i < self.STATE.devices.length; i++) {
			variables[`device${i + 1}_connected`] = { name: `Device ${i + 1} Connected` }
			variables[`device${i + 1}_name`] = { name: `Device ${i + 1} Name` }
		}

		variables.selected_index = { name: 'Selected Device Index (0 based)' }
		variables.selected_device = { name: 'Selected Device Number (1 based)' }
		variables.selected_state = { name: 'Selected Device Run State' }
		variables.selected_name = { name: 'Selected Device Name' }
		variables.selected_connected = { name: 'Selected Device Connected' }
	} else if (self.STATE.devices.length === 1) {
		variables.device_name = { name: 'Device Name' }
		variables.device_connected = { name: 'Device Connected' }
	}

	// Tail 2 hardware always reports zoom 0 and FOV -1, whatever it is actually set to
	if (self.config.model !== 'OBSBOT_TAIL_2') {
		variables.zoom = { name: 'Zoom Level' }
		variables.fov = { name: 'Field of View' }
	}
	variables.gimbal_pitch = { name: 'Gimbal Pitch' }
	variables.gimbal_yaw = { name: 'Gimbal Yaw' }

	if (self.config.model === 'OBSBOT_CENTER_TINY') {
		variables.ai_tracking = { name: 'AI Tracking Lock State' }
	}

	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		variables.virtual_background = { name: 'Virtual Background Mode' }
		variables.auto_framing = { name: 'Auto Framing Mode' }
	}

	if (
		self.config.model === 'OBSBOT_CENTER_TINY' ||
		self.config.model === 'OBSBOT_CENTER_MEET' ||
		self.config.model === 'OBSBOT_TAIL_2'
	) {
		for (let i = 1; i <= 3; i++) {
			variables[`preset${i}_exists`] = { name: `Preset Position ${i} Saved` }
			variables[`preset${i}_name`] = { name: `Preset Position ${i} Name` }
		}

		variables.preset_count = { name: 'Saved Preset Position Count' }
	}

	self.setVariableDefinitions(variables)
}

export function CheckVariables(self: OBSBOTInstance): void {
	const variableValues: CompanionVariableValues = {}

	self.setVariableValues(variableValues)
}
