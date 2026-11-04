import type OBSBOTInstance from '../main.js'
import { commandAction, dropdownField, valueAction, type Actions } from './helpers.js'

export function addMeetActions(self: OBSBOTInstance, actions: Actions): void {
	actions.OBSBOT_CENTER_MEET_setVirtualBackground = valueAction(self, {
		name: 'Center App | Meet Series | Set Virtual Background',
		description: 'Set the virtual background of the camera',
		address: '/OBSBOT/WebCam/Meet/SetVirtualBackground',
		field: dropdownField('virtualBackground', 'Virtual Background', [
			{ id: '0', label: 'Disable' },
			{ id: '1', label: 'Blur' },
			{ id: '2', label: 'Green Screen' },
			{ id: '3', label: 'Replacement' },
		]),
		logName: 'virtual background',
	})

	actions.OBSBOT_CENTER_MEET_setAutoFraming = valueAction(self, {
		name: 'Center App | Meet Series | Set Auto Framing',
		description: 'Set the auto framing of the camera',
		address: '/OBSBOT/WebCam/Meet/SetAutoFraming',
		field: dropdownField('autoFraming', 'Auto Framing', [
			{ id: '0', label: 'Disabled' },
			{ id: '1', label: 'Single Mode' },
			{ id: '2', label: 'Group Mode' },
		]),
		logName: 'auto framing',
	})

	actions.OBSBOT_CENTER_MEET_setStandardMode = commandAction(self, {
		name: 'Center App | Meet Series | Set to Standard Mode',
		description: 'Set the camera to standard mode - disables virtual background and auto framing',
		address: '/OBSBOT/WebCam/Meet/SetStandardMode',
		value: 0,
		log: 'Setting standard mode.',
	})
}
