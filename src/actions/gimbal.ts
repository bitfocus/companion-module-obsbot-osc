import type OBSBOTInstance from '../main.js'
import type { Model } from '../models.js'
import { commandAction, intArgs, numberField, toInt, type Actions } from './helpers.js'

const Directions = ['Up', 'Down', 'Left', 'Right'] as const

export function addGimbalActions(self: OBSBOTInstance, actions: Actions, model: Model): void {
	const { pan, pitch } = model.gimbalLimits

	actions.resetGimbal = commandAction(self, {
		name: 'Gimbal | Reset Position',
		description: 'Resets the gimbal to its default position',
		address: '/OBSBOT/WebCam/General/ResetGimbal',
		value: 0,
		log: 'Resetting gimbal.',
	})

	for (const direction of Directions) {
		const lower = direction.toLowerCase()
		const address = `/OBSBOT/WebCam/General/SetGimbal${direction}` as const

		actions[`moveGimbal${direction}`] = {
			name: `Gimbal | Move ${direction}`,
			description: `Move the gimbal ${lower}`,
			options: [numberField('moveSpeed', 'Move Speed', { default: 1, min: 1, max: 100 })],
			callback: ({ options }) => {
				self.log('info', `Moving gimbal ${lower} at speed ${options.moveSpeed}.`)
				self.sendCommand(address, intArgs(toInt(options.moveSpeed)))
			},
		}

		// Speed 0 is how the spec says to stop
		actions[`stopGimbal${direction}`] = commandAction(self, {
			name: `Gimbal | Stop Moving ${direction}`,
			description: `Stop moving the gimbal ${lower}`,
			address,
			value: 0,
			log: `Stopping gimbal ${lower}.`,
		})
	}

	actions.setGimMotorDegree = {
		name: 'Gimbal | Set Motor Degree',
		description: 'Set the motor degrees of the gimbal',
		options: [
			numberField('speed', 'Speed', { default: 0, min: 0, max: 90 }),
			numberField('pan', 'Pan', { default: 0, min: -pan, max: pan }),
			numberField('pitch', 'Pitch', { default: 0, min: -pitch, max: pitch }),
		],
		callback: ({ options }) => {
			self.log('info', `Setting gimbal motor degree to ${options.pan} ${options.pitch}.`)
			self.sendCommand(
				'/OBSBOT/WebCam/General/SetGimMotorDegree',
				intArgs(toInt(options.speed), toInt(options.pan), toInt(options.pitch)),
			)
		},
	}

	if (model.isCenterApp) {
		const preciseField = (id: string, label: string, limit: number, min = -limit) =>
			numberField(id, label, { default: 0, min, max: limit, step: 0.1, range: false })

		actions.setGimMotorDegreeEx = {
			name: 'Gimbal | Set Motor Degree (Precise)',
			description: 'Set the motor degrees of the gimbal using fractional degrees',
			options: [
				preciseField('speed', 'Speed', 90, 0),
				preciseField('pan', 'Pan', pan),
				preciseField('pitch', 'Pitch', pitch),
			],
			callback: ({ options }) => {
				self.log('info', `Setting gimbal motor degree to ${options.pan} ${options.pitch}.`)
				self.sendCommand(
					'/OBSBOT/WebCam/General/SetGimMotorDegreeEx',
					[options.speed, options.pan, options.pitch].map((value) => ({
						type: 'f',
						value: parseFloat(value?.toString() || '0'),
					})),
				)
			},
		}
	}
}
