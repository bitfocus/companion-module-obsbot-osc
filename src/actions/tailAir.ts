import type OBSBOTInstance from '../main.js'
import { addCameraControls, dropdownField, valueAction, type Actions } from './helpers.js'

export function addTailAirActions(self: OBSBOTInstance, actions: Actions): void {
	actions.OBSBOT_TAIL_AIR_setAIMode = valueAction(self, {
		name: 'Tail Air | Set AI Mode',
		description: 'Set the AI Mode of the camera',
		address: '/OBSBOT/Camera/TailAir/SetAiMode',
		field: dropdownField('aiMode', 'AI Mode', [
			{ id: '0', label: 'No Tracking' },
			{ id: '1', label: 'Normal Tracking' },
			{ id: '2', label: 'Upper Body' },
			{ id: '3', label: 'Close Up' },
			{ id: '6', label: 'Animal Tracking' },
			{ id: '7', label: 'Group' },
		]),
		logName: 'AI mode',
	})

	actions.OBSBOT_TAIL_AIR_setTrackingSpeed = valueAction(self, {
		name: 'Tail Air | Set Tracking Speed',
		description: 'Set the tracking speed of the camera',
		address: '/OBSBOT/Camera/TailAir/SetTrackingSpeed',
		field: dropdownField('trackingSpeed', 'Tracking Speed', [
			{ id: '0', label: 'Slow' },
			{ id: '1', label: 'Standard' },
			{ id: '2', label: 'Fast' },
		]),
		logName: 'tracking speed',
	})

	addCameraControls(self, actions, {
		idPrefix: 'OBSBOT_TAIL_AIR',
		namePrefix: 'Tail Air',
		address: '/OBSBOT/Camera/TailAir',
	})
}
