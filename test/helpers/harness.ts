import type OBSBOTInstance from '../../src/main.js'
import type { ModuleConfig } from '../../src/config.js'
import type { ModelId } from '../../src/models.js'
import { BuildMessage } from '../../src/api.js'
import { CreateState } from '../../src/state.js'

export interface SentMessage {
	address: string
	args: unknown[]
}

export interface FakeDefinitions {
	actions: Record<string, any>
	feedbacks: Record<string, any>
	variables: Record<string, any>
	presets: Record<string, any>
	structure: any[]
}

export interface FakeInstance {
	self: OBSBOTInstance
	sent: SentMessage[]
	definitions: FakeDefinitions
	logs: { level: string; message: string }[]
	statuses: { status: string; message: string | undefined }[]
	variableValues: Record<string, unknown>
}

export function defaultConfig(model: ModelId): ModuleConfig {
	return {
		ip: '127.0.0.1',
		port: 57110,
		transport: 'udp',
		listenport: 57120,
		pollinterval: 0,
		model,
		device: 1,
		verbose: false,
	}
}

/** An instance with the Companion host stubbed out, recording what would reach the wire */
export function createFakeInstance(model: ModelId, config: Partial<ModuleConfig> = {}): FakeInstance {
	const sent: SentMessage[] = []
	const definitions: FakeDefinitions = { actions: {}, feedbacks: {}, variables: {}, presets: {}, structure: [] }
	const logs: FakeInstance['logs'] = []
	const statuses: FakeInstance['statuses'] = []
	const variableValues: Record<string, unknown> = {}

	const self: any = {
		config: { ...defaultConfig(model), ...config },
		STATE: CreateState(),
		log: (level: string, message: string) => logs.push({ level, message }),
		updateStatus: (status: string, message?: string) => statuses.push({ status, message }),
		setActionDefinitions: (actions: FakeDefinitions['actions']) => (definitions.actions = actions),
		setFeedbackDefinitions: (feedbacks: FakeDefinitions['feedbacks']) => (definitions.feedbacks = feedbacks),
		setVariableDefinitions: (variables: FakeDefinitions['variables']) => (definitions.variables = variables),
		setPresetDefinitions: (structure: any[], presets: FakeDefinitions['presets']) => {
			definitions.structure = structure
			definitions.presets = presets
		},
		setVariableValues: (values: Record<string, unknown>) => Object.assign(variableValues, values),
		checkFeedbacks: () => {},
		updateVariableDefinitions: () => {},
		sendCommand: (address: OSCAddress, args: OSCArgument[]) => {
			const message = BuildMessage(self.config, address, args)
			sent.push({ address: message.address, args: message.args.map((arg) => arg.value) })
		},
	}

	return { self: self as OBSBOTInstance, sent, definitions, logs, statuses, variableValues }
}
