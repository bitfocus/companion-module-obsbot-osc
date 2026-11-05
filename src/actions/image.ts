import type { DropdownChoice } from '@companion-module/base'
import type OBSBOTInstance from '../main.js'
import type { Model } from '../models.js'
import { dropdownField, intArg, intArgs, numberField, OnOff, toInt, valueAction, type Actions } from './helpers.js'

const ExposureCompensateValues = [-30, -27, -23, -20, -17, -13, -10, -7, -3, 0, 3, 7, 10, 13, 17, 20, 23, 27, 30]

// The mixed types are as saved in existing configs
const ShutterSpeeds: (string | number)[] = [
	'6400',
	'5000',
	'3200',
	'2500',
	'2000',
	'1600',
	'1250',
	'1000',
	'800',
	'640',
	'500',
	'400',
	'320',
	'240',
	'200',
	'160',
	'120',
	'100',
	'80',
	'60',
	'50',
	'40',
	'30',
	'25',
	'20',
	'15',
	'12.5',
	'10',
	8,
	6.25,
	5,
	4,
	3,
	2.5,
]

const IsoValues = ['100', '200', '400', '800', '1600', '3200', '6400']

export function addImageActions(self: OBSBOTInstance, actions: Actions, model: Model): void {
	actions.setMirror = valueAction(self, {
		name: 'Other | Set Mirror Mode',
		description: 'Set the mirror mode of the camera',
		address: '/OBSBOT/WebCam/General/SetMirror',
		field: dropdownField('mirrorMode', 'Mirror Mode', [
			{ id: '0', label: 'Normal' },
			{ id: '1', label: 'Mirror' },
		]),
		logName: 'mirror mode',
	})

	if (model.autoFocus) {
		actions.setAutoFocus = valueAction(self, {
			name: 'Image | Set Auto Focus On/Off',
			description: 'Set the auto focus of the camera',
			address: '/OBSBOT/WebCam/General/SetAutoFocus',
			field: dropdownField('autoFocus', 'Auto Focus', OnOff),
			logName: 'auto focus',
		})
	}

	actions.setManualFocus = valueAction(self, {
		name: 'Image | Set Manual Focus Value',
		description: 'Set the manual focus value of the camera',
		address: '/OBSBOT/WebCam/General/SetManualFocus',
		field: numberField('focusValue', 'Focus Value', { default: 0, min: 0, max: 100 }),
		logName: 'manual focus value',
	})

	if (model.focusMode) {
		actions.setFocusMode = {
			name: 'Center App | Set Focus Mode',
			description: 'Set the focus mode of the camera',
			options: [
				dropdownField(
					'focusMode',
					'Focus Mode',
					[
						{ id: '0', label: 'AF-S' },
						{ id: '1', label: 'AF-C' },
						{ id: '2', label: 'MF' },
					],
					{ disableAutoExpression: true },
				),
				numberField('focusValue', 'Manual Focus Value', {
					default: 0,
					min: 0,
					max: 100,
					isVisibleExpression: '$(options:focusMode) === "2"',
				}),
			],
			callback: ({ options }) => {
				self.log('info', `Setting focus mode to ${options.focusMode}.`)
				const args = [intArg(toInt(options.focusMode))]
				if (options.focusMode === '2') {
					args.push(intArg(toInt(options.focusValue)))
				}
				self.sendCommand('/OBSBOT/Camera/Tail/SetFocusMode', args)
			},
		}
	}

	actions.setAutoExposure = valueAction(self, {
		name: 'Image | Set Auto Exposure On/Off',
		description: 'Set the auto exposure of the camera',
		address: '/OBSBOT/WebCam/General/SetAutoExposure',
		field: dropdownField('autoExposure', 'Auto Exposure', OnOff),
		logName: 'auto exposure',
	})

	actions.setExposureCompensate = valueAction(self, {
		name: 'Image | Set Exposure Compensate Value',
		description: 'Set the exposure compensate value of the camera',
		address: '/OBSBOT/WebCam/General/SetExposureCompensate',
		field: dropdownField(
			'exposureCompensateValue',
			'Exposure Compensate Value',
			ExposureCompensateValues.map((value) => ({ id: String(value), label: (value / 10).toFixed(1) })),
		),
		logName: 'exposure compensate value',
	})

	actions.setShutterSpeed = valueAction(self, {
		name: 'Image | Set Shutter Speed',
		description: 'Set the shutter speed of the camera',
		address: '/OBSBOT/WebCam/General/SetShutterSpeed',
		field: dropdownField(
			'shutterSpeedValue',
			'Shutter Speed Value',
			ShutterSpeeds.map((id): DropdownChoice => ({ id, label: `1/${id}` })),
			{ default: '100' },
		),
		logName: 'shutter speed',
	})

	actions.setISO = valueAction(self, {
		name: 'Image | Set ISO',
		description: 'Set the ISO of the camera',
		address: '/OBSBOT/WebCam/General/SetISO',
		field: dropdownField(
			'isoValue',
			'ISO Value',
			IsoValues.map((id) => ({ id, label: id })),
			{ default: '100' },
		),
		logName: 'ISO',
	})

	actions.setAutoWhiteBalance = valueAction(self, {
		name: 'Image | Set Auto White Balance On/Off',
		description: 'Set the auto white balance of the camera',
		address: '/OBSBOT/WebCam/General/SetAutoWhiteBalance',
		field: dropdownField('autoWhiteBalance', 'Auto White Balance', OnOff),
		logName: 'auto white balance',
	})

	actions.setColorTemperature = valueAction(self, {
		name: 'Image | Set Color Temperature',
		description: 'Set the color temperature of the camera',
		address: '/OBSBOT/WebCam/General/SetColorTemperature',
		field: numberField('colorTemperature', 'Color Temperature', { default: 5000, min: 2000, max: 10000 }),
		logName: 'color temperature',
	})

	// At this time these image controls are only Tiny 3 / Tiny 3 Lite capable.
	if (model.family === 'tiny') {
		const shiftField = (id: string, label: string) =>
			numberField(id, label, { default: 0, min: -7, max: 7, step: 0.25 })
		const gainField = (id: string, label: string) => numberField(id, label, { default: 127, min: 0, max: 255 })

		actions.setWhiteBalanceShift = {
			name: 'Image | Set White Balance Shift (Tiny 3 only)',
			description: 'Set the white balance shift of the camera. Only available for Tiny 3 and Tiny 3 Lite.',
			options: [shiftField('blueAmber', 'Blue - Amber'), shiftField('greenMagenta', 'Green - Magenta')],
			callback: ({ options }) => {
				self.log('info', `Setting white balance shift to B-A ${options.blueAmber} G-M ${options.greenMagenta}.`)
				self.sendCommand('/OBSBOT/WebCam/General/SetWhiteBalanceShift', [
					{ type: 'f', value: parseFloat(options.blueAmber?.toString() || '0') },
					{ type: 'f', value: parseFloat(options.greenMagenta?.toString() || '0') },
				])
			},
		}

		actions.setRBGain = {
			name: 'Image | Set Red/Blue Gain (Tiny 3 only)',
			description: 'Set the Red and Blue gain of the camera. Only available for Tiny 3 and Tiny 3 Lite.',
			options: [gainField('redGain', 'Red Gain'), gainField('blueGain', 'Blue Gain')],
			callback: ({ options }) => {
				self.log('info', `Setting red gain to ${options.redGain}. Setting blue gain to ${options.blueGain}.`)
				self.sendCommand('/OBSBOT/WebCam/General/SetRBGain', intArgs(toInt(options.redGain), toInt(options.blueGain)))
			},
		}
	}
}
