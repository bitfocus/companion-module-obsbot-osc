import {
	InstanceBase,
	type CompanionActionSchema,
	type CompanionFeedbackSchema,
	type InstanceTypes,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions/index.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { CreateState, type OBSBOTState } from './state.js'
import { UpdateVariableDefinitions } from './variables.js'
import { HandleReply, PollDeviceState } from './api.js'
import { Connection } from './connection.js'
import { UpdatePresets } from './presets.js'

// Every action and feedback option is a dropdown or number field, and Companion validates values against the field
type OptionValues = Record<string, string | number | undefined>

export interface OBSBOTTypes extends InstanceTypes {
	config: ModuleConfig
	actions: Record<string, CompanionActionSchema<OptionValues, void>>
	feedbacks: Record<string, CompanionFeedbackSchema<OptionValues>>
}

export { UpgradeScripts }

export default class OBSBOTInstance extends InstanceBase<OBSBOTTypes> {
	config!: ModuleConfig // Setup in init()
	STATE: OBSBOTState = CreateState()
	readonly connection = new Connection(this)

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets
		await this.connection.connect()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		this.connection.close()
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.STATE = CreateState()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		await this.connection.connect()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	sendCommand(address: OSCAddress, args: OSCArgument[]): void {
		this.connection.send(address, args)
	}

	handleReply(address: string, args: OSCValue[]): void {
		HandleReply(this, address, args)
	}

	pollDeviceState(): void {
		PollDeviceState(this)
	}
}
