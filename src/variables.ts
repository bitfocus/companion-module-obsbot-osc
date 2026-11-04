import type { CompanionVariableDefinitions } from '@companion-module/base'

import type OBSBOTInstance from './main.js'
import { findModel } from './models.js'

export function UpdateVariableDefinitions(self: OBSBOTInstance): void {
	const model = findModel(self.config.model)
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

	if (model?.reportsZoom) {
		variables.zoom = { name: 'Zoom Level' }
		variables.fov = { name: 'Field of View' }
	}
	variables.gimbal_pitch = { name: 'Gimbal Pitch' }
	variables.gimbal_yaw = { name: 'Gimbal Yaw' }

	if (model?.family === 'tiny') {
		variables.ai_tracking = { name: 'AI Tracking Lock State' }
	}

	if (model?.family === 'meet') {
		variables.virtual_background = { name: 'Virtual Background Mode' }
		variables.auto_framing = { name: 'Auto Framing Mode' }
	}

	if (model?.hasPositionPresets) {
		for (let i = 1; i <= 3; i++) {
			variables[`preset${i}_exists`] = { name: `Preset Position ${i} Saved` }
			variables[`preset${i}_name`] = { name: `Preset Position ${i} Name` }
		}

		variables.preset_count = { name: 'Saved Preset Position Count' }
	}

	self.setVariableDefinitions(variables)
}
