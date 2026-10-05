import type { SomeCompanionConfigField } from '@companion-module/base'
import { Models, type ModelId } from './models.js'

export interface ModuleConfig {
	ip: string
	port: number
	transport: 'udp' | 'tcp'
	listenport: number
	pollinterval: number
	model: ModelId
	device: number
	verbose: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'Controls Tail 2 and Tail Air directly, or Tiny, Meet and Tail cameras through the OBSBOT Center App (which must be running with OSC enabled). See the "Help" tab for more information.',
		},
		{
			type: 'textinput',
			id: 'ip',
			width: 4,
			label: 'Device IP Address',
			default: '192.168.0.1',
		},
		{
			type: 'number',
			id: 'port',
			width: 4,
			label: 'Port',
			tooltip:
				'57110 is the default for OBSBOT devices. When using the OBSBOT Center App, this port must match the port set in the app.',
			min: 1,
			max: 65535,
			default: 57110,
		},
		{
			type: 'dropdown',
			id: 'transport',
			label: 'Transport Protocol',
			default: 'udp',
			choices: [
				{ id: 'udp', label: 'UDP' },
				{ id: 'tcp', label: 'TCP' },
			],
			width: 4,
		},
		{
			type: 'number',
			id: 'listenport',
			width: 4,
			label: 'Listen Port',
			default: 57120,
			min: 1,
			max: 65535,
			tooltip: 'Port for receiving OSC messages over UDP. 57120 is the default for OBSBOT devices and Center App',
			isVisibleExpression: '$(options:transport) === "udp"',
		},
		{
			type: 'number',
			id: 'pollinterval',
			width: 4,
			label: 'Poll Interval (seconds)',
			default: 5,
			min: 0,
			max: 3600,
			tooltip:
				'How often to query the device for zoom, gimbal position and other state used by variables and feedbacks. Set to 0 to disable polling.',
		},
		{
			type: 'static-text',
			id: 'hr1',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'dropdown',
			id: 'model',
			label: 'Device Model',
			default: Models[0].id,
			choices: [...Models],
			tooltip: 'Select the model of your OBSBOT device',
			width: 6,
		},
		{
			type: 'number',
			id: 'device',
			label: 'Device ID',
			default: 1,
			min: 1,
			max: 255,
			tooltip: 'Device ID for the OBSBOT Center App. This is not used for hardware devices.',
			width: 4,
			isVisibleExpression: 'includes($(options:model), "OBSBOT_CENTER")',
		},
		{
			type: 'static-text',
			id: 'hr2',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false,
			width: 4,
		},
	]
}
