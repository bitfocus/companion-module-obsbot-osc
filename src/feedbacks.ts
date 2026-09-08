import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import type { OBSBOTInstance } from './main.js'

export function UpdateFeedbacks(self: OBSBOTInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	const foregroundColor = combineRgb(0, 0, 0)
	const backgroundColor = combineRgb(255, 255, 0)

	//These are driven by replies every model sends, so they apply to hardware and Center App alike
	feedbacks.zoomLevel = {
		type: 'boolean',
		name: 'Zoom Level',
		description: 'Change style based on the current zoom level',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Comparison',
				id: 'comparison',
				default: 'eq',
				choices: [
					{ id: 'eq', label: 'Equal to' },
					{ id: 'gte', label: 'Greater than or equal to' },
					{ id: 'lte', label: 'Less than or equal to' },
				],
			},
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
		callback: (feedback) => {
			if (self.STATE.zoom === undefined) {
				return false
			}

			const target = parseInt(feedback.options.zoom?.toString() || '0')

			switch (feedback.options.comparison) {
				case 'gte':
					return self.STATE.zoom >= target
				case 'lte':
					return self.STATE.zoom <= target
				default:
					return self.STATE.zoom === target
			}
		},
	}

	feedbacks.fieldOfView = {
		type: 'boolean',
		name: 'Field of View',
		description: 'Change style when the camera is at the selected field of view',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Field of View',
				id: 'fov',
				default: '0',
				choices: [
					{ id: '0', label: '86 Degrees' },
					{ id: '1', label: '78 Degrees' },
					{ id: '2', label: '65 Degrees' },
				],
			},
		],
		callback: (feedback) => {
			return self.STATE.fov === parseInt(feedback.options.fov?.toString() || '0')
		},
	}

	feedbacks.gimbalPosition = {
		type: 'boolean',
		name: 'Gimbal Position In Range',
		description: 'Change style when the gimbal axis is within the given range',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Axis',
				id: 'axis',
				default: 'yaw',
				choices: [
					{ id: 'yaw', label: 'Yaw (Pan)' },
					{ id: 'pitch', label: 'Pitch (Tilt)' },
					{ id: 'roll', label: 'Roll' },
				],
			},
			{
				type: 'number',
				label: 'Minimum Degrees',
				id: 'min',
				default: -5,
				min: -180,
				max: 180,
				step: 1,
				required: true,
			},
			{
				type: 'number',
				label: 'Maximum Degrees',
				id: 'max',
				default: 5,
				min: -180,
				max: 180,
				step: 1,
				required: true,
			},
		],
		callback: (feedback) => {
			let value

			switch (feedback.options.axis) {
				case 'pitch':
					value = self.STATE.gimbalPitch
					break
				case 'roll':
					value = self.STATE.gimbalRoll
					break
				default:
					value = self.STATE.gimbalYaw
			}

			if (value === undefined) {
				return false
			}

			const min = parseFloat(feedback.options.min?.toString() || '0')
			const max = parseFloat(feedback.options.max?.toString() || '0')

			return value >= min && value <= max
		},
	}

	feedbacks.deviceConnected = {
		type: 'boolean',
		name: 'Device Connected',
		description: 'Change style when the given device reports as connected',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		options: [
			{
				type: 'number',
				label: 'Device',
				id: 'device',
				default: 1,
				min: 1,
				max: 4,
				step: 1,
				required: true,
				tooltip: 'Device number as reported in the device info. Hardware devices only report device 1',
			},
		],
		callback: (feedback) => {
			const index = parseInt(feedback.options.device?.toString() || '1') - 1
			return self.STATE.devices[index]?.connected === true
		},
	}

	feedbacks.selectedDeviceAwake = {
		type: 'boolean',
		name: 'Selected Device Awake',
		description: 'Change style when the selected device is running rather than asleep',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColor,
		},
		options: [],
		callback: () => {
			return self.STATE.selectedDeviceAwake === true
		},
	}

	if (self.config.model === 'OBSBOT_CENTER_TINY') {
		feedbacks.aiTrackingLocked = {
			type: 'boolean',
			name: 'AI Tracking Locked',
			description: 'Change style when the AI tracking target is locked',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			options: [],
			callback: () => {
				return self.STATE.aiTrackingLocked === true
			},
		}
	}

	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		feedbacks.virtualBackground = {
			type: 'boolean',
			name: 'Virtual Background Mode',
			description: 'Change style when the virtual background is in the selected mode',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
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
			callback: (feedback) => {
				return self.STATE.virtualBackground === parseInt(feedback.options.virtualBackground?.toString() || '0')
			},
		}

		feedbacks.autoFraming = {
			type: 'boolean',
			name: 'Auto Framing Mode',
			description: 'Change style when auto framing is in the selected mode',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
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
			callback: (feedback) => {
				return self.STATE.autoFraming === parseInt(feedback.options.autoFraming?.toString() || '0')
			},
		}
	}

	if (self.config.model === 'OBSBOT_CENTER_TINY' || self.config.model === 'OBSBOT_CENTER_MEET') {
		feedbacks.presetExists = {
			type: 'boolean',
			name: 'Preset Position Saved',
			description: 'Change style when the selected preset position has been saved on the device',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColor,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Preset Position',
					id: 'preset',
					default: '0',
					choices: [
						{ id: '0', label: 'Preset Position 1' },
						{ id: '1', label: 'Preset Position 2' },
						{ id: '2', label: 'Preset Position 3' },
					],
				},
			],
			callback: (feedback) => {
				const index = parseInt(feedback.options.preset?.toString() || '0')
				return self.STATE.presets[index]?.exists === true
			},
		}
	}

	self.setFeedbackDefinitions(feedbacks)
}
