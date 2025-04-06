import { OSCMetaArgument, CompanionActionDefinitions } from '@companion-module/base'
import type { OBSBOTInstance } from './main.js'
import { Models } from './models.js'

export function UpdateActions(self: OBSBOTInstance): void {
	//get the model from the config and then get the model from the Models array
	const model = Models.find((m) => m.id === self.config.model)
	if (!model) {
		self.log('error', `Model ${self.config.model} not found.`)
		return
	}

	const actions: CompanionActionDefinitions = {}

	//Cameras that should have these actions - other future models may not have these
	const CommonActions = [
		'OBSBOT_TAIL_2',
		'OBSBOT_TAIL_AIR',
		'OBSBOT_TALENT',
		'OBSBOT_CENTER',
		'OBSBOT_CENTER_TINY',
		'OBSBOT_CENTER_TAIL_AIR',
		'OBSBOT_CENTER_TAIL_2',
		'OBSBOT_CENTER_MEET',
	]

	if (self.config.model in CommonActions) {
		//ZOOM
		actions.setZoom = {
			name: 'Zoom | Set Zoom Level',
			description: 'Set the zoom level of the camera',
			options: [
				{
					type: 'number',
					label: 'Zoom Level',
					id: 'zoom',
					default: 0,
					min: 0,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Setting zoom to ${action.options.zoom}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.zoom?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetZoom', args)
			},
		}

		actions.setZoomSpeed = {
			name: 'Zoom | Set Zoom Speed',
			description: 'Set the zoom speed of the camera',
			options: [
				{
					type: 'number',
					label: 'Target Zoom Value',
					id: 'zoomValue',
					default: 0,
					min: 0,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
				{
					type: 'number',
					label: 'Target Zoom Speed',
					id: 'zoomSpeed',
					default: 0,
					min: 0,
					max: 10,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Setting zoom speed to ${action.options.zoomSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.zoomValue?.toString() || '0'),
				})
				args.push({
					type: 'i',
					value: parseInt(action.options.zoomSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetZoomSpeed', args)
			},
		}

		actions.setZoomMax = {
			name: 'Zoom | Set Zoom Max',
			description: 'Set the maximum zoom level of the camera',
			options: [
				{
					type: 'number',
					label: 'Zoom Level',
					id: 'zoomLevel',
					default: 0,
					min: 0,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Setting zoom max to ${action.options.zoomLevel}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.zoomLevel?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetZoomMax', args)
			},
		}

		actions.setZoomMin = {
			name: 'Zoom | Set Zoom Min',
			description: 'Set the minimum zoom level of the camera',
			options: [
				{
					type: 'number',
					label: 'Zoom Level',
					id: 'zoomLevel',
					default: 0,
					min: 0,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Setting zoom min to ${action.options.zoomLevel}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.zoomLevel?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetZoomMin', args)
			},
		}

		//GIMBAL
		actions.resetGimbal = {
			name: 'Gimbal | Reset Position',
			description: 'Resets the gimbal to its default position',
			options: [],
			callback: () => {
				self.log('info', 'Resetting gimbal.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/ResetGimbal', args)
			},
		}

		actions.moveGimbalUp = {
			name: 'Gimbal | Move Up',
			description: 'Move the gimbal up',
			options: [
				{
					type: 'number',
					label: 'Move Speed',
					id: 'moveSpeed',
					default: 1,
					min: 1,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Moving gimbal up at speed ${action.options.moveSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.moveSpeed?.toString() || '0'),
				})

				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalUp', args)
			},
		}

		actions.stopGimbalUp = {
			name: 'Gimbal | Stop Moving Up',
			description: 'Stop moving the gimbal up',
			options: [],
			callback: () => {
				self.log('info', 'Stopping gimbal up.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalUp', args)
			},
		}

		actions.moveGimbalDown = {
			name: 'Gimbal | Move Down',
			description: 'Move the gimbal down',
			options: [
				{
					type: 'number',
					label: 'Move Speed',
					id: 'moveSpeed',
					default: 1,
					min: 1,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Moving gimbal down at speed ${action.options.moveSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.moveSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalDown', args)
			},
		}

		actions.stopGimbalDown = {
			name: 'Gimbal | Stop Moving Down',
			description: 'Stop moving the gimbal down',
			options: [],
			callback: () => {
				self.log('info', 'Stopping gimbal down.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalDown', args)
			},
		}

		actions.moveGimbalLeft = {
			name: 'Gimbal | Move Left',
			description: 'Move the gimbal left',
			options: [
				{
					type: 'number',
					label: 'Move Speed',
					id: 'moveSpeed',
					default: 1,
					min: 1,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Moving gimbal left at speed ${action.options.moveSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.moveSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalLeft', args)
			},
		}

		actions.stopGimbalLeft = {
			name: 'Gimbal | Stop Moving Left',
			description: 'Stop moving the gimbal left',
			options: [],
			callback: () => {
				self.log('info', 'Stopping gimbal left.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalLeft', args)
			},
		}

		actions.moveGimbalRight = {
			name: 'Gimbal | Move Right',
			description: 'Move the gimbal right',
			options: [
				{
					type: 'number',
					label: 'Move Speed',
					id: 'moveSpeed',
					default: 1,
					min: 1,
					max: 100,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Moving gimbal right at speed ${action.options.moveSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.moveSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalRight', args)
			},
		}

		actions.stopGimbalRight = {
			name: 'Gimbal | Stop Moving Right',
			description: 'Stop moving the gimbal right',
			options: [],
			callback: () => {
				self.log('info', 'Stopping gimbal right.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimbalRight', args)
			},
		}

		let gimbalMotorPanMin = -129
		let gimbalMotorPanMax = 129
		let gimbalMotorPitchMin = -59
		let gimbalMotorPitchMax = 59
		if (model.id === 'OBSBOT_TAIL_2') {
			gimbalMotorPanMin = -159
			gimbalMotorPanMax = 159
			gimbalMotorPitchMin = -62
			gimbalMotorPitchMax = 62
		}

		actions.setGimMotorDegree = {
			name: 'Gimbal | Set Motor Degree',
			description: 'Set the motor degrees of the gimbal',
			options: [
				{
					type: 'number',
					label: 'Speed',
					id: 'speed',
					default: 0,
					min: 0,
					max: 90,
					step: 1,
					required: true,
					range: true,
				},
				{
					type: 'number',
					label: 'Pan',
					id: 'pan',
					default: 0,
					min: gimbalMotorPanMin,
					max: gimbalMotorPanMax,
					step: 1,
					required: true,
					range: true,
				},
				{
					type: 'number',
					label: 'Pitch',
					id: 'pitch',
					default: 0,
					min: gimbalMotorPitchMin,
					max: gimbalMotorPitchMax,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Setting gimbal motor degree to ${action.options.pan} ${action.options.pitch}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.speed?.toString() || '0'),
				})
				args.push({
					type: 'i',
					value: parseInt(action.options.pan?.toString() || '0'),
				})
				args.push({
					type: 'i',
					value: parseInt(action.options.pitch?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetGimMotorDegree', args)
			},
		}

		actions.setMirror = {
			name: 'Other | Set Mirror Mode',
			description: 'Set the mirror mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Mirror Mode',
					id: 'mirrorMode',
					default: '0',
					choices: [
						{ id: '0', label: 'Normal' },
						{ id: '1', label: 'Mirror' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting mirror mode to ${action.options.mirrorMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.mirrorMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetMirror', args)
			},
		}
	}

	//general commands specific to CENTER APP
	if (self.config.model === 'OBSBOT_CENTER') {
		actions.setView = {
			name: 'Center App | Set View',
			description: 'Set the view of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'View Angle',
					id: 'viewAngle',
					default: '0',
					choices: [
						{ id: '0', label: '86 Degrees' },
						{ id: '1', label: '78 Degrees' },
						{ id: '2', label: '65 Degrees' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting view angle to ${action.options.viewAngle}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.viewAngle?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetView', args)
			},
		}

		actions.startPCRecording = {
			name: 'Center App | Start PC Recording',
			description: 'Start recording on the PC',
			options: [],
			callback: () => {
				self.log('info', 'Starting PC recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('SetPCRecording', args)
			},
		}

		actions.stopPCRecording = {
			name: 'Center App | Stop PC Recording',
			description: 'Stop recording on the PC',
			options: [],
			callback: () => {
				self.log('info', 'Stopping PC recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetPCRecording', args)
			},
		}

		actions.PCSnapshot = {
			name: 'Center App | Take PC Snapshot',
			description: 'Take a snapshot on the PC',
			options: [],
			callback: () => {
				self.log('info', 'Taking PC snapshot.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/WebCam/General/SetPCSnapshot', args)
			},
		}
	}

	//IMAGE
	actions.setAutoFocus = {
		name: 'Image | Set Auto Focus On/Off',
		description: 'Set the auto focus of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'Auto Focus',
				id: 'autoFocus',
				default: '0',
				choices: [
					{ id: '0', label: 'Off' },
					{ id: '1', label: 'On' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting auto focus to ${action.options.autoFocus}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.autoFocus?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetAutoFocus', args)
		},
	}

	actions.setManualFocus = {
		name: 'Image | Set Manual Focus Value',
		description: 'Set the manual focus value of the camera',
		options: [
			{
				type: 'number',
				label: 'Focus Value',
				id: 'focusValue',
				default: 0,
				min: 0,
				max: 100,
				step: 1,
				required: true,
				range: true,
			},
		],
		callback: (action) => {
			self.log('info', `Setting manual focus value to ${action.options.focusValue}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.focusValue?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetManualFocus', args)
		},
	}

	//Set Focus Mode - for CENTER APP only
	if (self.config.model === 'OBSBOT_CENTER') {
		actions.setFocusMode = {
			name: 'Center App | Set Focus Mode',
			description: 'Set the focus mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Focus Mode',
					id: 'focusMode',
					default: '0',
					choices: [
						{ id: '0', label: 'AF-S' },
						{ id: '1', label: 'AF-C' },
						{ id: '2', label: 'MF' },
					],
				},
				{
					type: 'number',
					label: 'Manual Focus Value',
					id: 'focusValue',
					default: 0,
					min: 0,
					max: 100,
					step: 1,
					required: true,
					range: true,
					isVisible: (config) => config.focusMode === '2',
				},
			],
			callback: (action) => {
				self.log('info', `Setting focus mode to ${action.options.focusMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.focusMode?.toString() || '0'),
				})
				if (action.options.focusMode === '2') {
					args.push({
						type: 'i',
						value: parseInt(action.options.focusValue?.toString() || '0'),
					})
				}
				self.sendCommand('/OBSBOT/WebCam/General/SetFocusMode', args)
			},
		}
	}

	actions.setAutoExposure = {
		name: 'Image | Set Auto Exposure On/Off',
		description: 'Set the auto exposure of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'Auto Exposure',
				id: 'autoExposure',
				default: '0',
				choices: [
					{ id: '0', label: 'Off' },
					{ id: '1', label: 'On' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting auto exposure to ${action.options.autoExposure}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.autoExposure?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetAutoExposure', args)
		},
	}

	actions.setExposureCompensate = {
		name: 'Image | Set Exposure Compensate Value',
		description: 'Set the exposure compensate value of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'Exposure Compensate Value',
				id: 'exposureCompensateValue',
				default: '0',
				choices: [
					{ id: '-30', label: '-3.0' },
					{ id: '-27', label: '-2.7' },
					{ id: '-23', label: '-2.3' },
					{ id: '-20', label: '-2.0' },
					{ id: '-17', label: '-1.7' },
					{ id: '-13', label: '-1.3' },
					{ id: '-10', label: '-1.0' },
					{ id: '-7', label: '-0.7' },
					{ id: '-3', label: '-0.3' },
					{ id: '0', label: '0.0' },
					{ id: '3', label: '0.3' },
					{ id: '7', label: '0.7' },
					{ id: '10', label: '1.0' },
					{ id: '13', label: '1.3' },
					{ id: '17', label: '1.7' },
					{ id: '20', label: '2.0' },
					{ id: '23', label: '2.3' },
					{ id: '27', label: '2.7' },
					{ id: '30', label: '3.0' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting exposure compensate value to ${action.options.exposureCompensateValue}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.exposureCompensateValue?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetExposureCompensate', args)
		},
	}

	actions.setShutterSpeed = {
		name: 'Image | Set Shutter Speed',
		description: 'Set the shutter speed of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'Shutter Speed Value',
				id: 'shutterSpeedValue',
				default: '100',
				choices: [
					{ id: '6400', label: '1/6400' },
					{ id: '5000', label: '1/5000' },
					{ id: '3200', label: '1/3200' },
					{ id: '2500', label: '1/2500' },
					{ id: '2000', label: '1/2000' },
					{ id: '1600', label: '1/1600' },
					{ id: '1250', label: '1/1250' },
					{ id: '1000', label: '1/1000' },
					{ id: '800', label: '1/800' },
					{ id: '640', label: '1/640' },
					{ id: '500', label: '1/500' },
					{ id: '400', label: '1/400' },
					{ id: '320', label: '1/320' },
					{ id: '240', label: '1/240' },
					{ id: '200', label: '1/200' },
					{ id: '160', label: '1/160' },
					{ id: '120', label: '1/120' },
					{ id: '100', label: '1/100' },
					{ id: '80', label: '1/80' },
					{ id: '60', label: '1/60' },
					{ id: '50', label: '1/50' },
					{ id: '40', label: '1/40' },
					{ id: '30', label: '1/30' },
					{ id: '25', label: '1/25' },
					{ id: '20', label: '1/20' },
					{ id: '15', label: '1/15' },
					{ id: '12.5', label: '1/12.5' },
					{ id: '10', label: '1/10' },
					{ id: 8, label: '1/8' },
					{ id: 6.25, label: '1/6.25' },
					{ id: 5, label: '1/5' },
					{ id: 4, label: '1/4' },
					{ id: 3, label: '1/3' },
					{ id: 2.5, label: '1/2.5' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting shutter speed to ${action.options.shutterSpeedValue}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.shutterSpeedValue?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetShutterSpeed', args)
		},
	}

	actions.setISO = {
		name: 'Image | Set ISO',
		description: 'Set the ISO of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'ISO Value',
				id: 'isoValue',
				default: '100',
				choices: [
					{ id: '100', label: '100' },
					{ id: '200', label: '200' },
					{ id: '400', label: '400' },
					{ id: '800', label: '800' },
					{ id: '1600', label: '1600' },
					{ id: '3200', label: '3200' },
					{ id: '6400', label: '6400' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting ISO to ${action.options.isoValue}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.isoValue?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetISO', args)
		},
	}

	actions.setAutoWhiteBalance = {
		name: 'Image | Set Auto White Balance On/Off',
		description: 'Set the auto white balance of the camera',
		options: [
			{
				type: 'dropdown',
				label: 'Auto White Balance',
				id: 'autoWhiteBalance',
				default: '0',
				choices: [
					{ id: '0', label: 'Off' },
					{ id: '1', label: 'On' },
				],
			},
		],
		callback: (action) => {
			self.log('info', `Setting auto white balance to ${action.options.autoWhiteBalance}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.autoWhiteBalance?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetAutoWhiteBalance', args)
		},
	}

	actions.setColorTemperature = {
		name: 'Image | Set Color Temperature',
		description: 'Set the color temperature of the camera',
		options: [
			{
				type: 'number',
				label: 'Color Temperature',
				id: 'colorTemperature',
				default: 0,
				min: 2000,
				max: 10000,
				step: 1,
				required: true,
				range: true,
			},
		],
		callback: (action) => {
			self.log('info', `Setting color temperature to ${action.options.colorTemperature}.`)
			let args: OSCMetaArgument[] = []
			args.push({
				type: 'i',
				value: parseInt(action.options.colorTemperature?.toString() || '0'),
			})
			self.sendCommand('/OBSBOT/WebCam/General/SetColorTemperature', args)
		},
	}

	//Tail2 Specific Actions
	if (self.config.model === 'OBSBOT_TAIL_2') {
		actions.OBSBOT_TAIL_2_setAIMode = {
			name: 'Tail 2 | Set AI Mode and Auto Zoom Mode',
			description: 'Set the AI mode and auto zoom mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'AI Mode',
					id: 'aiMode',
					default: '0',
					choices: [
						{ id: '0', label: 'Single-person' },
						{ id: '1', label: 'Multi-person' },
					],
				},
				{
					type: 'dropdown',
					label: 'Auto Zoom Mode',
					id: 'autoZoomModeSingle',
					default: '0',
					choices: [
						{ id: '0', label: 'None' },
						{ id: '1', label: 'Close Up' },
					],
					isVisible: (config) => config.aiMode === '0',
				},
				{
					type: 'dropdown',
					label: 'Auto Zoom Mode',
					id: 'autoZoomModeMulti',
					default: '0',
					choices: [
						{ id: '0', label: 'None' },
						{ id: '2', label: 'Half Body' },
						{ id: '3', label: 'Above The Knees' },
						{ id: '4', label: 'Nine Head Portrait' },
						{ id: '5', label: 'Full Body' },
						{ id: '6', label: 'Long Shot 1' },
						{ id: '7', label: 'Long Shot 2' },
					],
					isVisible: (config) => config.aiMode === '1',
				},
			],
			callback: (action) => {
				self.log('info', `Setting AI mode to ${action.options.aiMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.aiMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/SetAIMode', args)

				if (action.options.aiMode === '0') {
					args.push({
						type: 'i',
						value: parseInt(action.options.autoZoomModeSingle?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail2/SetAutoZoom', args)
				} else {
					args.push({
						type: 'i',
						value: parseInt(action.options.autoZoomModeMulti?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail2/SetAutoZoom', args)
				}
			},
		}

		actions.OBSBOT_TAIL_2_setTrackingSpeed = {
			name: 'Tail 2 | Set Tracking Speed',
			description: 'Set the tracking speed of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: '0',
					choices: [
						{ id: '0', label: 'Super Lazy' },
						{ id: '1', label: 'Lazy' },
						{ id: '2', label: 'Slow' },
						{ id: '3', label: 'Fast' },
						{ id: '4', label: 'Crazy' },
						{ id: '5', label: 'Custom' },
					],
				},
				{
					type: 'dropdown',
					label: 'Pan Mode',
					id: 'panMode',
					default: '0',
					choices: [
						{ id: '0', label: 'Manual' },
						{ id: '1', label: 'Auto' },
					],
					isVisible: (config) => config.mode === '5',
				},
				{
					type: 'number',
					label: 'Pan Speed',
					id: 'panSpeed',
					default: 1,
					min: 1,
					max: 10,
					step: 1,
					required: true,
					range: true,
					isVisible: (config) => config.mode === '5',
				},
				{
					type: 'dropdown',
					label: 'Pitch Mode',
					id: 'pitchMode',
					default: '0',
					choices: [
						{ id: '0', label: 'Manual' },
						{ id: '1', label: 'Auto' },
					],
					isVisible: (config) => config.mode === '5',
				},
				{
					type: 'number',
					label: 'Pitch Speed',
					id: 'pitchSpeed',
					default: 1,
					min: 1,
					max: 10,
					step: 1,
					required: true,
					range: true,
					isVisible: (config) => config.mode === '5',
				},
			],
			callback: (action) => {
				self.log('info', `Setting tracking speed to ${action.options.mode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.mode?.toString() || '0'),
				})
				if (action.options.mode === '5') {
					args.push({
						type: 'i',
						value: parseInt(action.options.panMode?.toString() || '0'),
					})
					args.push({
						type: 'i',
						value: parseInt(action.options.panSpeed?.toString() || '0'),
					})
					args.push({
						type: 'i',
						value: parseInt(action.options.pitchMode?.toString() || '0'),
					})
					args.push({
						type: 'i',
						value: parseInt(action.options.pitchSpeed?.toString() || '0'),
					})
				}
				self.sendCommand('/OBSBOT/Camera/Tail2/SetTrackingSpeed', args)
			},
		}

		actions.OBSBOT_TAIL_2_setOnlyMe = {
			name: 'Tail 2 | Set Only Me On/Off',
			description: 'Set the Only Me mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Only Me',
					id: 'onlyMe',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting Only Me to ${action.options.onlyMe}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.onlyMe?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/SetOnlyMe', args)
			},
		}

		actions.OBSBOT_TAIL_2_startRecording = {
			name: 'Tail 2 | Start Recording',
			description: 'Start recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Starting recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/SetRecording', args)
			},
		}

		actions.OBSBOT_TAIL_2_stopRecording = {
			name: 'Tail 2 | Stop Recording',
			description: 'Stop recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Stopping recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/SetRecording', args)
			},
		}

		actions.OBSBOT_TAIL_2_takeSnapshot = {
			name: 'Tail 2 | Take Snapshot',
			description: 'Take a snapshot on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Taking snapshot.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/Snapshot', args)
			},
		}

		actions.OBSBOT_TAIL_2_triggerPreset = {
			name: 'Tail 2 | Trigger Preset',
			description: 'Trigger a preset on the camera',
			options: [
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					default: 1,
					min: 1,
					max: 3,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Triggering preset ${action.options.presetNumber}.`)
				let args: OSCMetaArgument[] = []

				//OBSBOT_TAIL_2 only supports 1-3 - 0 based
				args.push({
					type: 'i',
					value: parseInt(action.options.presetNumber?.toString() || '0') - 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail2/TriggerPreset', args)
			},
		}
	}

	//Tail Air Specific Actions
	if (self.config.model === 'OBSBOT_TAIL_AIR') {
		actions.OBSBOT_TAIL_AIR_setAIMode = {
			name: 'Tail Air | Set AI Mode',
			description: 'Set the AI Mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'AI Mode',
					id: 'aiMode',
					default: '0',
					choices: [
						{ id: '0', label: 'No Tracking' },
						{ id: '1', label: 'Normal Tracking' },
						{ id: '2', label: 'Upper Body' },
						{ id: '3', label: 'Close Up' },
						{ id: '6', label: 'Animal Tracking' },
						{ id: '7', label: 'Group' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting AI mode to ${action.options.aiMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.aiMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/SetAIMode', args)
			},
		}

		actions.OBSBOT_TAIL_AIR_setTrackingSpeed = {
			name: 'Tail Air | Set Tracking Speed',
			description: 'Set the tracking speed of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Tracking Speed',
					id: 'trackingSpeed',
					default: '0',
					choices: [
						{ id: '0', label: 'Slow' },
						{ id: '1', label: 'Standard' },
						{ id: '2', label: 'Fast' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting tracking speed to ${action.options.trackingSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.trackingSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/SetTrackingSpeed', args)
			},
		}

		actions.OBSBOT_TAIL_AIR_startRecording = {
			name: 'Tail Air | Start Recording',
			description: 'Start recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Starting recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/SetRecording', args)
			},
		}

		actions.OBSBOT_TAIL_AIR_stopRecording = {
			name: 'Tail Air | Stop Recording',
			description: 'Stop recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Stopping recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/SetRecording', args)
			},
		}

		actions.OBSBOT_TAIL_AIR_takeSnapshot = {
			name: 'Tail Air | Take Snapshot',
			description: 'Take a snapshot on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Taking snapshot.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/Snapshot', args)
			},
		}

		actions.OBSBOT_TAIL_AIR_triggerPreset = {
			name: 'Tail Air | Trigger Preset',
			description: 'Trigger a preset on the camera',
			options: [
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					default: 1,
					min: 1,
					max: 3,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Triggering preset ${action.options.presetNumber}.`)
				let args: OSCMetaArgument[] = []

				//OBSBOT_TAIL_AIR only supports 1-3 - 0 based
				args.push({
					type: 'i',
					value: parseInt(action.options.presetNumber?.toString() || '0') - 1,
				})
				self.sendCommand('/OBSBOT/Camera/TailAir/TriggerPreset', args)
			},
		}
	}

	//CENTER APP TINY Specific Actions
	if (self.config.model === 'OBSBOT_CENTER_TINY') {
		actions.OBSBOT_CENTER_TINY_aiLock = {
			name: 'Center App | Tiny Series | AI Lock On/Off',
			description: 'Set the AI Lock of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'AI Lock',
					id: 'aiLock',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting AI lock to ${action.options.aiLock}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.aiLock?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/Tiny/ToggleAILock', args)
			},
		}

		actions.OBSBOT_CENTER_TINY_triggerPreset = {
			name: 'Center App | Tiny Series | Trigger Preset',
			description: 'Trigger a preset on the camera',
			options: [
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					default: 1,
					min: 1,
					max: 3,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Triggering preset ${action.options.presetNumber}.`)
				let args: OSCMetaArgument[] = []

				args.push({
					type: 'i',
					value: parseInt(action.options.presetNumber?.toString() || '0') - 1,
				})
				self.sendCommand('/OBSBOT/WebCam/Tiny/TriggerPreset', args)
			},
		}

		actions.OBSBOT_CENTER_TINY_aiMode = {
			name: 'Center App | Tiny Series | AI Mode',
			description: 'Set the AI Mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'AI Mode',
					id: 'aiMode',
					default: '0',
					choices: [
						{ id: '0', label: 'No Tracking' },
						{ id: '1', label: 'Normal Tracking' },
						{ id: '2', label: 'Upper Body' },
						{ id: '3', label: 'Close Up' },
						{ id: '4', label: 'Headless' },
						{ id: '5', label: 'Lower Body' },
						{ id: '6', label: 'Desk Mode' },
						{ id: '7', label: 'Whiteboard' },
						{ id: '8', label: 'Hand' },
						{ id: '9', label: 'Group' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting AI mode to ${action.options.aiMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.aiMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/Tiny/SetAiMode', args)
			},
		}

		actions.OBSBOT_CENTER_TINY_setTrackingMode = {
			name: 'Center App | Tiny Series | Set Tracking Mode',
			description: 'Set the tracking mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Tracking Mode',
					id: 'trackingMode',
					default: '0',
					choices: [
						{ id: '0', label: 'Headroom' },
						{ id: '1', label: 'Standard' },
						{ id: '2', label: 'Motion' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting tracking mode to ${action.options.trackingMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.trackingMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/Tiny/SetTrackingMode', args)
			},
		}
	}

	//CENTER APP Tail Specific Actions
	if (self.config.model === 'OBSBOT_CENTER_TAIL_AIR' || self.config.model === 'OBSBOT_CENTER_TAIL_2') {
		let aiModes = [
			{ id: '0', label: 'No Tracking' },
			{ id: '1', label: 'Normal Tracking' },
			{ id: '2', label: 'Upper Body' },
			{ id: '3', label: 'Close Up' },
			{ id: '4', label: 'Headless' },
			{ id: '6', label: 'Animal Tracking' },
			{ id: '7', label: 'Group' },
		]

		if (self.config.model === 'OBSBOT_CENTER_TAIL_2') {
			aiModes = [
				{ id: '0', label: 'Human Tracking - Single' },
				{ id: '1', label: 'Human Tracking - Group' },
				{ id: '2', label: 'Animal Tracking - Normal' },
				{ id: '3', label: 'Animal Tracking - Close Up' },
			]
		}

		actions.OBSBOT_CENTER_TAIL_aiMode = {
			name: 'Center App | Tail Series | AI Mode',
			description: 'Set the AI Mode of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'AI Mode',
					id: 'aiMode',
					default: '0',
					choices: aiModes,
				},
			],
			callback: (action) => {
				self.log('info', `Setting AI mode to ${action.options.aiMode}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.aiMode?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/Tail/SetAiMode', args)
			},
		}

		let trackingSpeeds = [
			{ id: '0', label: 'Slow' },
			{ id: '1', label: 'Standard' },
			{ id: '2', label: 'Fast' },
		]

		if (self.config.model === 'OBSBOT_CENTER_TAIL_2') {
			trackingSpeeds = [
				{ id: '0', label: 'Super Lazy' },
				{ id: '1', label: 'Lazy' },
				{ id: '2', label: 'Slow' },
				{ id: '3', label: 'Fast' },
				{ id: '4', label: 'Crazy' },
				{ id: '5', label: 'Auto' },
			]
		}

		actions.OBSBOT_CENTER_TAIL_setTrackingSpeed = {
			name: 'Center App | Tail Series | Set Tracking Speed',
			description: 'Set the tracking speed of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Tracking Speed',
					id: 'trackingSpeed',
					default: '0',
					choices: trackingSpeeds,
				},
			],
			callback: (action) => {
				self.log('info', `Setting tracking speed to ${action.options.trackingSpeed}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.trackingSpeed?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/Camera/Tail/SetTrackingSpeed', args)
			},
		}

		//Tail 2 only actions
		if (self.config.model === 'OBSBOT_CENTER_TAIL_2') {
			//set pan tracking speed
			actions.OBSBOT_CENTER_TAIL_setPanTrackingSpeed = {
				name: 'Center App | Tail 2 | Set Pan Tracking Speed',
				description: 'Set the pan tracking speed of the camera',
				options: [
					{
						type: 'number',
						label: 'Pan Tracking Speed',
						id: 'panTrackingSpeed',
						default: 1,
						min: 1,
						max: 10,
						step: 1,
						required: true,
						range: true,
					},
				],
				callback: (action) => {
					self.log('info', `Setting pan tracking speed to ${action.options.panTrackingSpeed}.`)
					let args: OSCMetaArgument[] = []
					args.push({
						type: 'i',
						value: parseInt(action.options.panTrackingSpeed?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail/SetPanTrackingSpeed', args)
				},
			}

			//set tilt tracking speed
			actions.OBSBOT_CENTER_TAIL_setTiltTrackingSpeed = {
				name: 'Center App | Tail 2 | Set Tilt Tracking Speed',
				description: 'Set the tilt tracking speed of the camera',
				options: [
					{
						type: 'number',
						label: 'Tilt Tracking Speed',
						id: 'tiltTrackingSpeed',
						default: 1,
						min: 1,
						max: 10,
						step: 1,
						required: true,
						range: true,
					},
				],
				callback: (action) => {
					self.log('info', `Setting tilt tracking speed to ${action.options.tiltTrackingSpeed}.`)
					let args: OSCMetaArgument[] = []
					args.push({
						type: 'i',
						value: parseInt(action.options.tiltTrackingSpeed?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail/SetTiltTrackingSpeed', args)
				},
			}

			///set pan axis lock
			actions.OBSBOT_CENTER_TAIL_setPanAxisLock = {
				name: 'Center App | Tail 2 | Set Pan Axis Lock',
				description: 'Set the pan axis lock of the camera',
				options: [
					{
						type: 'dropdown',
						label: 'Pan Axis Lock',
						id: 'panAxisLock',
						default: '0',
						choices: [
							{ id: '0', label: 'Unlocked' },
							{ id: '1', label: 'Locked' },
						],
					},
				],
				callback: (action) => {
					self.log('info', `Setting pan axis lock to ${action.options.panAxisLock}.`)
					let args: OSCMetaArgument[] = []
					args.push({
						type: 'i',
						value: parseInt(action.options.panAxisLock?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail/SetPanAxisLock', args)
				},
			}

			//set tilt axis lock
			actions.OBSBOT_CENTER_TAIL_setTiltAxisLock = {
				name: 'Center App | Tail 2 | Set Tilt Axis Lock',
				description: 'Set the tilt axis lock of the camera',
				options: [
					{
						type: 'dropdown',
						label: 'Tilt Axis Lock',
						id: 'tiltAxisLock',
						default: '0',
						choices: [
							{ id: '0', label: 'Unlocked' },
							{ id: '1', label: 'Locked' },
						],
					},
				],
				callback: (action) => {
					self.log('info', `Setting tilt axis lock to ${action.options.tiltAxisLock}.`)
					let args: OSCMetaArgument[] = []
					args.push({
						type: 'i',
						value: parseInt(action.options.tiltAxisLock?.toString() || '0'),
					})
					self.sendCommand('/OBSBOT/Camera/Tail/SetTiltAxisLock', args)
				},
			}
		}

		//start/stop recording
		actions.OBSBOT_CENTER_TAIL_startRecording = {
			name: 'Center App | Tail Series | Start Recording',
			description: 'Start recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Starting recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail/SetRecording', args)
			},
		}

		actions.OBSBOT_CENTER_TAIL_stopRecording = {
			name: 'Center App | Tail Series | Stop Recording',
			description: 'Stop recording on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Stopping recording.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 0,
				})
				self.sendCommand('/OBSBOT/Camera/Tail/SetRecording', args)
			},
		}

		//take snapshot
		actions.OBSBOT_CENTER_TAIL_takeSnapshot = {
			name: 'Center App | Tail Series | Take Snapshot',
			description: 'Take a snapshot on the camera',
			options: [],
			callback: () => {
				self.log('info', 'Taking snapshot.')
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail/Snapshot', args)
			},
		}

		//trigger preset
		actions.OBSBOT_CENTER_TAIL_triggerPreset = {
			name: 'Center App | Tail Series | Trigger Preset',
			description: 'Trigger a preset on the camera',
			options: [
				{
					type: 'number',
					label: 'Preset Number',
					id: 'presetNumber',
					default: 1,
					min: 1,
					max: 3,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				self.log('info', `Triggering preset ${action.options.presetNumber}.`)
				let args: OSCMetaArgument[] = []

				//OBSBOT_CENTER_TAIL only supports 1-3 - 0 based
				args.push({
					type: 'i',
					value: parseInt(action.options.presetNumber?.toString() || '0') - 1,
				})
				self.sendCommand('/OBSBOT/Camera/Tail/TriggerPreset', args)
			},
		}
	}

	//CENTER APP Meet Specific Actions
	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		actions.OBSBOT_CENTER_MEET_setVirtualBackground = {
			name: 'Center App | Meet Series | Set Virtual Background',
			description: 'Set the virtual background of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Virtual Background',
					id: 'virtualBackground',
					default: '0',
					choices: [
						{ id: '0', label: 'Disable' },
						{ id: '1', label: 'Blur' },
						{ id: '2', label: 'Green Screen' },
						{ id: '3', label: 'Replacement' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting virtual background to ${action.options.virtualBackground}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.virtualBackground?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/Meet/SetVirtualBackground', args)
			},
		}

		//set auto framing
		actions.OBSBOT_CENTER_MEET_setAutoFraming = {
			name: 'Center App | Meet Series | Set Auto Framing',
			description: 'Set the auto framing of the camera',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Framing',
					id: 'autoFraming',
					default: '0',
					choices: [
						{ id: '0', label: 'Disabled' },
						{ id: '1', label: 'Single Mode' },
						{ id: '2', label: 'Group Mode' },
					],
				},
			],
			callback: (action) => {
				self.log('info', `Setting auto framing to ${action.options.autoFraming}.`)
				let args: OSCMetaArgument[] = []
				args.push({
					type: 'i',
					value: parseInt(action.options.autoFraming?.toString() || '0'),
				})
				self.sendCommand('/OBSBOT/WebCam/Meet/SetAutoFraming', args)
			},
		}

		//set standard mode (disables virtual background and auto framing)
		actions.OBSBOT_CENTER_MEET_setStandardMode = {
			name: 'Center App | Meet Series | Set to Standard Mode',
			description: 'Set the camera to standard mode - disables virtual background and auto framing',
			options: [],
			callback: () => {
				self.log('info', 'Setting standard mode.')
				let args: OSCMetaArgument[] = []
				self.sendCommand('/OBSBOT/WebCam/Meet/SetStandardMode', args)
			},
		}
	}

	self.setActionDefinitions(actions)
}
