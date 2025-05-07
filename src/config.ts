import type { SomeCompanionConfigField } from '@companion-module/base'
import { Models } from './models.js'

export interface ModuleConfig {
	ip: string
	port: number
	transport: string
	listenport: number
	model: string
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
				'This module will communicate with OBSBOT products over OSC. It can be applied to the OBSBOT Center App (software), OBSBOT Tail 2 (hardware), OBSBOT Tail Air (hardware), and OBSBOT Talent (hardware). The OSC application on OBSBOT Center is compatible with the OBSBOT Tiny series (Tiny, Tiny 4K, Tiny 2, Tiny 2 Lite, Tiny SE), OBSBOT Meet series (Meet, Meet 4K, Meet 2, Meet SE), and OBSBOT Tail series (Tail Air, Tail 2). However, when using the OSC protocol with OBSBOT Center, the software must be running.',
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
			tooltip:
				'Port for receiving OSC messages over UDP. 57120 is the default for OBSBOT devices, however the CENTER app may differ.',
			isVisible: (config) => config.transport === 'udp',
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
			choices: Models,
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
			isVisible: (config) => config.model?.toString().indexOf('OBSBOT_CENTER') !== -1,
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
