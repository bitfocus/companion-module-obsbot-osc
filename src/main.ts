import {
	InstanceBase,
	InstanceStatus,
	type CompanionActionSchema,
	type CompanionFeedbackSchema,
	type InstanceTypes,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { CreateState, type OBSBOTState } from './state.js'
import { UpdateVariableDefinitions } from './variables.js'
import { CloseConnection, InitConnection, SendCommand } from './api.js'
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
	_socket: OSCSocket | undefined
	_pollTimer: NodeJS.Timeout | undefined
	_reconnectTimer: NodeJS.Timeout | undefined
	_reconnecting = false
	_resolvedIp: string | undefined // config.ip resolved to an address, so hostnames can be matched against rinfo
	_lastMessageAt = 0
	STATE: OBSBOTState = CreateState()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets
		this.updateStatus(InstanceStatus.Connecting)
		await this.initConnection()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		CloseConnection(this)
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.STATE = CreateState()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		this.updateStatus(InstanceStatus.Connecting)
		await this.initConnection()
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

	async initConnection(): Promise<void> {
		await InitConnection(this)
	}

	sendCommand(address: OSCAddress, args: OSCArgument[]): void {
		SendCommand(this, address, args)
	}
}
