import type OBSBOTInstance from '../main.js'
import type { Model } from '../models.js'
import { addCameraControls, dropdownField, numberField, valueAction, type Actions } from './helpers.js'

const AxisLockChoices = [
	{ id: '0', label: 'Unlocked' },
	{ id: '1', label: 'Locked' },
]

export function addCenterTailActions(self: OBSBOTInstance, actions: Actions, model: Model): void {
	const isTail2 = model.id === 'OBSBOT_CENTER_TAIL_2'

	actions.OBSBOT_CENTER_TAIL_aiMode = valueAction(self, {
		name: 'Center App | Tail Series | AI Mode',
		description: 'Set the AI Mode of the camera',
		address: '/OBSBOT/Camera/Tail/SetAiMode',
		field: dropdownField(
			'aiMode',
			'AI Mode',
			isTail2
				? [
						{ id: '0', label: 'Human Tracking - Single' },
						{ id: '1', label: 'Human Tracking - Group' },
						{ id: '2', label: 'Animal Tracking - Normal' },
						{ id: '3', label: 'Animal Tracking - Close Up' },
					]
				: [
						{ id: '0', label: 'No Tracking' },
						{ id: '1', label: 'Normal Tracking' },
						{ id: '2', label: 'Upper Body' },
						{ id: '3', label: 'Close Up' },
						{ id: '4', label: 'Headless' },
						{ id: '6', label: 'Animal Tracking' },
						{ id: '7', label: 'Group' },
					],
		),
		logName: 'AI mode',
	})

	actions.OBSBOT_CENTER_TAIL_setTrackingSpeed = valueAction(self, {
		name: 'Center App | Tail Series | Set Tracking Speed',
		description: 'Set the tracking speed of the camera',
		address: '/OBSBOT/Camera/Tail/SetTrackingSpeed',
		field: dropdownField(
			'trackingSpeed',
			'Tracking Speed',
			isTail2
				? [
						{ id: '0', label: 'Super Lazy' },
						{ id: '1', label: 'Lazy' },
						{ id: '2', label: 'Slow' },
						{ id: '3', label: 'Fast' },
						{ id: '4', label: 'Crazy' },
						{ id: '5', label: 'Auto' },
					]
				: [
						{ id: '0', label: 'Slow' },
						{ id: '1', label: 'Standard' },
						{ id: '2', label: 'Fast' },
					],
		),
		logName: 'tracking speed',
	})

	if (isTail2) {
		actions.OBSBOT_CENTER_TAIL_setPanTrackingSpeed = valueAction(self, {
			name: 'Center App | Tail 2 | Set Pan Tracking Speed',
			description: 'Set the pan tracking speed of the camera',
			address: '/OBSBOT/Camera/Tail/SetPanTrackingSpeed',
			field: numberField('panTrackingSpeed', 'Pan Tracking Speed', { default: 1, min: 1, max: 10 }),
			logName: 'pan tracking speed',
		})

		actions.OBSBOT_CENTER_TAIL_setTiltTrackingSpeed = valueAction(self, {
			name: 'Center App | Tail 2 | Set Tilt Tracking Speed',
			description: 'Set the tilt tracking speed of the camera',
			address: '/OBSBOT/Camera/Tail/SetTiltTrackingSpeed',
			field: numberField('tiltTrackingSpeed', 'Tilt Tracking Speed', { default: 1, min: 1, max: 10 }),
			logName: 'tilt tracking speed',
		})

		actions.OBSBOT_CENTER_TAIL_setPanAxisLock = valueAction(self, {
			name: 'Center App | Tail 2 | Set Pan Axis Lock',
			description: 'Set the pan axis lock of the camera',
			address: '/OBSBOT/Camera/Tail/SetPanAxisLock',
			field: dropdownField('panAxisLock', 'Pan Axis Lock', AxisLockChoices),
			logName: 'pan axis lock',
		})

		actions.OBSBOT_CENTER_TAIL_setTiltAxisLock = valueAction(self, {
			name: 'Center App | Tail 2 | Set Tilt Axis Lock',
			description: 'Set the tilt axis lock of the camera',
			address: '/OBSBOT/Camera/Tail/SetTiltAxisLock',
			field: dropdownField('tiltAxisLock', 'Tilt Axis Lock', AxisLockChoices),
			logName: 'tilt axis lock',
		})
	}

	addCameraControls(self, actions, {
		idPrefix: 'OBSBOT_CENTER_TAIL',
		namePrefix: 'Center App | Tail Series',
		address: '/OBSBOT/Camera/Tail',
	})
}
