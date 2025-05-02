import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'

export function UpdateVariableDefinitions(self: OBSBOTInstance): void {
	const variables: CompanionVariableDefinition[] = []

	console.log('devices le ngth', self.DEVICES.length)
	if ((self.DEVICES.length as number) > 1) {
		for (let i = 0; i < self.DEVICES.length; i++) {
			variables.push({ variableId: `device${i + 1}_connected`, name: `Device ${i + 1} Connected` })
			variables.push({ variableId: `device${i + 1}_name`, name: `Device ${i + 1} Name` })
		}

		variables.push({ variableId: 'selected_index', name: 'Selected Device Index' })
		variables.push({ variableId: 'selected_state', name: 'Selected Device Run State' })
		variables.push({ variableId: 'selected_type', name: 'Selected Device Type' })
		variables.push({ variableId: 'selected_name', name: 'Selected Device Name' })
		variables.push({ variableId: 'selected_connected', name: 'Selected Device Connected' })
	} else if ((self.DEVICES.length as number) === 1) {
		variables.push({ variableId: 'device_name', name: 'Device Name' })
	}

	variables.push({ variableId: 'zoom', name: 'Zoom Level' })
	variables.push({ variableId: 'fov', name: 'Field of View' })
	variables.push({ variableId: 'gimbal_pitch', name: 'Gimbal Pitch' })
	variables.push({ variableId: 'gimbal_yaw', name: 'Gimbal Yaw' })

	self.setVariableDefinitions(variables)
}

export function CheckVariables(self: OBSBOTInstance): void {
	const variableValues: CompanionVariableValues = {}

	self.setVariableValues(variableValues)
}
