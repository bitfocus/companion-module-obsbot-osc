import {
	InstanceBase,
	InstanceStatus,
	OSCMetaArgument,
	runEntrypoint,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateVariableDefinitions } from './variables.js'
import { InitConnection, SendCommand } from './api.js'

export class OBSBOTInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	oscPort?: any

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions() // export actions
		this.updateVariableDefinitions() // export variable definitions
		this.updateStatus(InstanceStatus.Connecting)
		await this.initConnection()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions()
		this.updateVariableDefinitions()
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

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async initConnection(): Promise<void> {
		await InitConnection(this)
	}

	sendCommand(address: string, args: OSCMetaArgument[]): void {
		SendCommand(this, address, args)
	}
}

runEntrypoint(OBSBOTInstance, UpgradeScripts)
