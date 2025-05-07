import { InstanceBase, InstanceStatus, runEntrypoint, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateVariableDefinitions } from './variables.js'
import { InitConnection, SendCommand } from './api.js'
import { UpdatePresets } from './presets.js'

export class OBSBOTInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	_socket: any // Socket for communication, type can be more specific based on implementation
	DEVICES: [] = [] // Device list, type can be more specific based on implementation

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions() // export actions
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets
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

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	async initConnection(): Promise<void> {
		await InitConnection(this)
	}

	sendCommand(address: string, args: OSCArgument[]): void {
		SendCommand(this, address, args)
	}
}

runEntrypoint(OBSBOTInstance, UpgradeScripts)
