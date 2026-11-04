import type OBSBOTInstance from '../main.js'
import { commandAction, dropdownField, intArg, numberField, toInt, type Actions } from './helpers.js'

export function addCenterAppActions(self: OBSBOTInstance, actions: Actions): void {
	actions.selectDevice = {
		name: 'Center App | Select Device',
		description: 'Select which connected device subsequent commands target',
		options: [
			numberField('device', 'Device', {
				default: 1,
				min: 1,
				max: 255,
				range: false,
				tooltip: 'Device number as shown in the Center App',
			}),
		],
		callback: ({ options }) => {
			self.log('info', `Selecting device ${options.device}.`)
			//Device ID is 1-based in OBSBOT Center and 0-based with OSC
			self.sendCommand('/OBSBOT/WebCam/General/SelectDevice', [intArg(toInt(options.device, '1') - 1)])
		},
	}

	actions.setWakeSleep = {
		name: 'Center App | Sleep/Wake Device',
		description: 'Put the device to sleep or wake it up',
		options: [
			dropdownField(
				'state',
				'State',
				[
					{ id: '0', label: 'Sleep' },
					{ id: '1', label: 'Awake' },
				],
				{ default: '1' },
			),
		],
		callback: ({ options }) => {
			self.log('info', `Setting device state to ${options.state}.`)
			self.sendCommand('/OBSBOT/WebCam/General/WakeSleep', [intArg(toInt(options.state, '1'))])
		},
	}

	actions.startHighfpsRecording = commandAction(self, {
		name: 'Center App | Start High-fps Recording (Tiny 3 and Tail 2s only)',
		description: 'Start high-fps recording. Only supported on Tail 2s, Tiny 3 and Tiny 3 Lite',
		address: '/OBSBOT/WebCam/General/SetHighfpsRecording',
		value: 1,
		log: 'Starting high-fps recording.',
	})

	actions.stopHighfpsRecording = commandAction(self, {
		name: 'Center App | Stop High-fps Recording (Tiny 3 and Tail 2s only)',
		description: 'Stop high-fps recording. Only supported on Tail 2s, Tiny 3 and Tiny 3 Lite',
		address: '/OBSBOT/WebCam/General/SetHighfpsRecording',
		value: 0,
		log: 'Stopping high-fps recording.',
	})

	actions.setView = {
		name: 'Center App | Set View',
		description: 'Set the view of the camera',
		options: [
			dropdownField('viewAngle', 'View Angle', [
				{ id: '0', label: '86 Degrees' },
				{ id: '1', label: '78 Degrees' },
				{ id: '2', label: '65 Degrees' },
			]),
		],
		callback: ({ options }) => {
			self.log('info', `Setting view angle to ${options.viewAngle}.`)
			self.sendCommand('/OBSBOT/WebCam/General/SetView', [intArg(toInt(options.viewAngle))])
		},
	}

	actions.startPCRecording = commandAction(self, {
		name: 'Center App | Start PC Recording',
		description: 'Start recording on the PC',
		address: '/OBSBOT/WebCam/General/SetPCRecording',
		value: 1,
		log: 'Starting PC recording.',
	})

	actions.stopPCRecording = commandAction(self, {
		name: 'Center App | Stop PC Recording',
		description: 'Stop recording on the PC',
		address: '/OBSBOT/WebCam/General/SetPCRecording',
		value: 0,
		log: 'Stopping PC recording.',
	})

	actions.PCSnapshot = commandAction(self, {
		name: 'Center App | Take PC Snapshot',
		description: 'Take a snapshot on the PC',
		address: '/OBSBOT/WebCam/General/PCSnapshot',
		value: 1,
		log: 'Taking PC snapshot.',
	})
}
