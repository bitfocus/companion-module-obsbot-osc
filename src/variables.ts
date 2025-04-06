import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'

import type { OBSBOTInstance } from './main.js'

export function UpdateVariableDefinitions(self: OBSBOTInstance): void {
	const variables: CompanionVariableDefinition[] = []

	self.setVariableDefinitions(variables)
}

export function CheckVariables(self: OBSBOTInstance): void {
	const variableValues: CompanionVariableValues = {}

	self.setVariableValues(variableValues)
}
