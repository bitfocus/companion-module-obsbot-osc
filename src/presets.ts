import { CompanionButtonPresetDefinition, combineRgb } from '@companion-module/base'
import type { OBSBOTInstance } from './main.js'
import { Models } from './models.js'
import { ICONS } from './icons.js'

// Define colors for different categories
const colors = {
	white: combineRgb(255, 255, 255),
	black: combineRgb(0, 0, 0),
	red: combineRgb(255, 0, 0),
	green: combineRgb(0, 200, 0),
	blue: combineRgb(0, 80, 255),
	yellow: combineRgb(255, 255, 0),
	orange: combineRgb(255, 102, 0),
	purple: combineRgb(128, 0, 128),
	teal: combineRgb(0, 128, 128),
	lightBlue: combineRgb(0, 176, 255),
	grey: combineRgb(128, 128, 128),
	darkBlue: combineRgb(0, 0, 100),
}

export function UpdatePresets(self: OBSBOTInstance): void {
	const presets: { [id: string]: CompanionButtonPresetDefinition } = {}

	const model = Models.find((m) => m.id === self.config.model)
	if (!model) {
		self.log('error', `Model ${self.config.model} not found.`)
		return
	}

	// Common presets for all models
	const CommonModels = [
		'OBSBOT_TAIL_2',
		'OBSBOT_TAIL_AIR',
		'OBSBOT_TALENT',
		'OBSBOT_CENTER',
		'OBSBOT_CENTER_TINY',
		'OBSBOT_CENTER_TAIL_AIR',
		'OBSBOT_CENTER_TAIL_2',
		'OBSBOT_CENTER_MEET',
	]

	if (CommonModels.includes(self.config.model)) {
		// ==================
		// Zoom Presets
		// ==================
		presets['zoom_0'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom 0%',
			style: {
				text: 'Zoom\n0%',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoom',
							options: {
								zoom: 0,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['zoom_50'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom 50%',
			style: {
				text: 'Zoom\n50%',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoom',
							options: {
								zoom: 50,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['zoom_100'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom 100%',
			style: {
				text: 'Zoom\n100%',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoom',
							options: {
								zoom: 100,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['zoom_speed'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom Speed',
			style: {
				text: 'Zoom\nSpeed',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoomSpeed',
							options: {
								zoomValue: 50,
								zoomSpeed: 5,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['zoom_max'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom Max',
			style: {
				text: 'Zoom\nMax',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoomMax',
							options: {
								zoomLevel: 100,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['zoom_min'] = {
			type: 'button',
			category: 'Zoom',
			name: 'Zoom Min',
			style: {
				text: 'Zoom\nMin',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setZoomMin',
							options: {
								zoomLevel: 0,
							},
						},
					],
					up: [],
				},
			],
		}

		// ==================
		// Gimbal Presets
		// ==================
		presets['gimbal_up'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Move Gimbal Up',
			style: {
                text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
                png64: ICONS.UP,
                pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'moveGimbalUp',
							options: {
								moveSpeed: 100,
							},
						},
					],
					up: [
						{
							actionId: 'stopGimbalUp',
							options: {},
						},
					],
				},
			],
		}

		presets['gimbal_down'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Move Gimbal Down',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
                png64: ICONS.DOWN,
                pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'moveGimbalDown',
							options: {
								moveSpeed: 100,
							},
						},
					],
					up: [
						{
							actionId: 'stopGimbalDown',
							options: {},
						},
					],
				},
			],
		}

		presets['gimbal_left'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Move Gimbal Left',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
                png64: ICONS.LEFT,
                pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'moveGimbalLeft',
							options: {
								moveSpeed: 100,
							},
						},
					],
					up: [
						{
							actionId: 'stopGimbalLeft',
							options: {},
						},
					],
				},
			],
		}

		presets['gimbal_right'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Move Gimbal Right',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
                png64: ICONS.RIGHT,
                pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'moveGimbalRight',
							options: {
								moveSpeed: 100,
							},
						},
					],
					up: [
						{
							actionId: 'stopGimbalRight',
							options: {},
						},
					],
				},
			],
		}
        // ! Uncomment when gimbal diagonal movement is supported by OBSBOT
        // presets['gimbal_up_left'] = {
        //     type: 'button',
        //     category: 'Gimbal',
        //     name: 'Move Gimbal Up-Left',
        //     style: {
        //         text: '',
        //         size: '14',
        //         color: colors.white,
        //         bgcolor: colors.teal,
        //         png64: ICONS.UP_LEFT,
        //         pngalignment: 'center:center',
        //     },
        //     feedbacks: [],
        //     steps: [
        //         {
        //             down: [
        //                 {
        //                     actionId: 'moveGimbalUp',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //                 {
        //                     actionId: 'moveGimbalLeft',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //             ],
        //             up: [
        //                 {
        //                     actionId: 'stopGimbalUp',
        //                     options: {},
        //                 },
        //                 {
        //                     actionId: 'stopGimbalLeft',
        //                     options: {},
        //                 },
        //             ],
        //         },
        //     ],
        // }

        // presets['gimbal_up_right'] = {
        //     type: 'button',
        //     category: 'Gimbal',
        //     name: 'Move Gimbal Up-Right',
        //     style: {
        //         text: '',
        //         size: '14',
        //         color: colors.white,
        //         bgcolor: colors.teal,
        //         png64: ICONS.UP_RIGHT,
        //         pngalignment: 'center:center',
        //     },
        //     feedbacks: [],
        //     steps: [
        //         {
        //             down: [
        //                 {
        //                     actionId: 'moveGimbalUp',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //                 {
        //                     actionId: 'moveGimbalRight',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //             ],
        //             up: [
        //                 {
        //                     actionId: 'stopGimbalUp',
        //                     options: {},
        //                 },
        //                 {
        //                     actionId: 'stopGimbalRight',
        //                     options: {},
        //                 },
        //             ],
        //         },
        //     ],
        // }

        // presets['gimbal_down_left'] = {
        //     type: 'button',
        //     category: 'Gimbal',
        //     name: 'Move Gimbal Down-Left',
        //     style: {
        //         text: '',
        //         size: '14',
        //         color: colors.white,
        //         bgcolor: colors.teal,
        //         png64: ICONS.DOWN_LEFT,
        //         pngalignment: 'center:center',
        //     },
        //     feedbacks: [],
        //     steps: [
        //         {
        //             down: [
        //                 {
        //                     actionId: 'moveGimbalDown',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //                 {
        //                     actionId: 'moveGimbalLeft',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //             ],
        //             up: [
        //                 {
        //                     actionId: 'stopGimbalDown',
        //                     options: {},
        //                 },
        //                 {
        //                     actionId: 'stopGimbalLeft',
        //                     options: {},
        //                 },
        //             ],
        //         },
        //     ],
        // }

        // presets['gimbal_down_right'] = {
        //     type: 'button',
        //     category: 'Gimbal',
        //     name: 'Move Gimbal Down-Right',
        //     style: {
        //         text: '',
        //         size: '14',
        //         color: colors.white,
        //         bgcolor: colors.teal,
        //         png64: ICONS.DOWN_RIGHT,
        //         pngalignment: 'center:center',
        //     },
        //     feedbacks: [],
        //     steps: [
        //         {
        //             down: [
        //                 {
        //                     actionId: 'moveGimbalDown',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //                 {
        //                     actionId: 'moveGimbalRight',
        //                     options: {
        //                         moveSpeed: 100,
        //                     },
        //                 },
        //             ],
        //             up: [
        //                 {
        //                     actionId: 'stopGimbalDown',
        //                     options: {},
        //                 },
        //                 {
        //                     actionId: 'stopGimbalRight',
        //                     options: {},
        //                 },
        //             ],
        //         },
        //     ],
        // }

		presets['gimbal_motor_degree'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Set Gimbal Position',
			style: {
				text: 'Set\nPosition',
				size: '14',
				color: colors.white,
				bgcolor: colors.purple,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setGimMotorDegree',
							options: {
								speed: 30,
								pan: 0,
								pitch: 0,
							},
						},
					],
					up: [],
				},
			],
		}

        presets['gimbal_reset'] = {
			type: 'button',
			category: 'Gimbal',
			name: 'Reset Gimbal',
			style: {
				text: 'Reset\nGimbal',
				size: '14',
				color: colors.white,
				bgcolor: colors.purple,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'resetGimbal',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		// ==================
		// Other Presets
		// ==================
		presets['mirror_mode_on'] = {
			type: 'button',
			category: 'Other',
			name: 'Mirror Mode On',
			style: {
				text: 'Mirror\nMode\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.grey,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setMirror',
							options: {
								mirrorMode: '1',
							},
						},
					],
					up: [],
				},
			],
		}

        presets['mirror_mode_off'] = {
			type: 'button',
			category: 'Other',
			name: 'Mirror Mode Off',
			style: {
				text: 'Mirror\nMode\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.grey,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setMirror',
							options: {
								mirrorMode: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		// ==================
		// Image Presets
		// ==================
		presets['autofocus_on'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto Focus On',
			style: {
				text: 'Auto\nFocus\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoFocus',
							options: {
								autoFocus: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['autofocus_off'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto Focus Off',
			style: {
				text: 'Auto\nFocus\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoFocus',
							options: {
								autoFocus: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['autoexposure_on'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto Exposure On',
			style: {
				text: 'Auto\nExposure\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoExposure',
							options: {
								autoExposure: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['autoexposure_off'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto Exposure Off',
			style: {
				text: 'Auto\nExposure\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoExposure',
							options: {
								autoExposure: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['auto_wb_on'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto White Balance On',
			style: {
				text: 'Auto\nWB\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoWhiteBalance',
							options: {
								autoWhiteBalance: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['auto_wb_off'] = {
			type: 'button',
			category: 'Image',
			name: 'Auto White Balance Off',
			style: {
				text: 'Auto\nWB\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setAutoWhiteBalance',
							options: {
								autoWhiteBalance: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['manual_focus_50'] = {
			type: 'button',
			category: 'Image',
			name: 'Manual Focus 50',
			style: {
				text: 'Manual\nFocus\n50',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setManualFocus',
							options: {
								focusValue: 50,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['color_temp_5000'] = {
			type: 'button',
			category: 'Image',
			name: 'Color Temp 5000K',
			style: {
				text: 'Color\nTemp\n5000K',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setColorTemperature',
							options: {
								colorTemperature: 5000,
							},
						},
					],
					up: [],
				},
			],
		}
	}

	// Model-specific presets
	if (self.config.model === 'OBSBOT_CENTER') {
		presets['center_view_86'] = {
			type: 'button',
			category: 'Center App',
			name: 'View 86°',
			style: {
				text: 'View\n86°',
				size: '14',
				color: colors.white,
				bgcolor: colors.orange,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setView',
							options: {
								viewAngle: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_view_78'] = {
			type: 'button',
			category: 'Center App',
			name: 'View 78°',
			style: {
				text: 'View\n78°',
				size: '14',
				color: colors.white,
				bgcolor: colors.orange,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setView',
							options: {
								viewAngle: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_view_65'] = {
			type: 'button',
			category: 'Center App',
			name: 'View 65°',
			style: {
				text: 'View\n65°',
				size: '14',
				color: colors.white,
				bgcolor: colors.orange,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setView',
							options: {
								viewAngle: '2',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_focus_afs'] = {
			type: 'button',
			category: 'Center App',
			name: 'Focus Mode AF-S',
			style: {
				text: 'Focus\nAF-S',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setFocusMode',
							options: {
								focusMode: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_focus_afc'] = {
			type: 'button',
			category: 'Center App',
			name: 'Focus Mode AF-C',
			style: {
				text: 'Focus\nAF-C',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setFocusMode',
							options: {
								focusMode: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_focus_mf'] = {
			type: 'button',
			category: 'Center App',
			name: 'Focus Mode MF',
			style: {
				text: 'Focus\nMF',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setFocusMode',
							options: {
								focusMode: '2',
								focusValue: 50,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_recording_start'] = {
			type: 'button',
			category: 'Center App',
			name: 'Start Recording',
			style: {
				text: 'Start\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'startPCRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['center_recording_stop'] = {
			type: 'button',
			category: 'Center App',
			name: 'Stop Recording',
			style: {
				text: 'Stop\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'stopPCRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['center_snapshot'] = {
			type: 'button',
			category: 'Center App',
			name: 'Take Snapshot',
			style: {
				text: 'Take\nSnapshot',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'PCSnapshot',
							options: {},
						},
					],
					up: [],
				},
			],
		}
	}

	// Center App Meet Series presets
	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		presets['meet_autoframe_off'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Auto Framing Off',
			style: {
				text: 'Auto\nFraming\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setAutoFraming',
							options: {
								autoFraming: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['meet_autoframe_single'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Auto Framing Single',
			style: {
				text: 'Auto\nFraming\nSingle',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setAutoFraming',
							options: {
								autoFraming: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['meet_autoframe_group'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Auto Framing Group',
			style: {
				text: 'Auto\nFraming\nGroup',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setAutoFraming',
							options: {
								autoFraming: '2',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['meet_vb_disable'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Virtual BG Disable',
			style: {
				text: 'VB\nDisable',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setVirtualBackground',
							options: {
								virtualBackground: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['meet_vb_blur'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Virtual BG Blur',
			style: {
				text: 'VB\nBlur',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setVirtualBackground',
							options: {
								virtualBackground: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['meet_standard_mode'] = {
			type: 'button',
			category: 'Meet Series',
			name: 'Standard Mode',
			style: {
				text: 'Standard\nMode',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_MEET_setStandardMode',
							options: {},
						},
					],
					up: [],
				},
			],
		}
	}

	// Center App Tiny Series
	if (self.config.model === 'OBSBOT_CENTER_TINY') {
		presets['tiny_ai_lock_on'] = {
			type: 'button',
			category: 'Tiny Series',
			name: 'AI Lock On',
			style: {
				text: 'AI Lock\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TINY_aiLock',
							options: {
								aiLock: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tiny_ai_lock_off'] = {
			type: 'button',
			category: 'Tiny Series',
			name: 'AI Lock Off',
			style: {
				text: 'AI Lock\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TINY_aiLock',
							options: {
								aiLock: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tiny_ai_mode_normal'] = {
			type: 'button',
			category: 'Tiny Series',
			name: 'AI Mode Normal',
			style: {
				text: 'AI Mode\nNormal',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TINY_aiMode',
							options: {
								aiMode: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tiny_tracking_headroom'] = {
			type: 'button',
			category: 'Tiny Series',
			name: 'Tracking Headroom',
			style: {
				text: 'Tracking\nHeadroom',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TINY_setTrackingMode',
							options: {
								trackingMode: '0',
							},
						},
					],
					up: [],
				},
			],
		}

        presets['tiny_preset_1'] = {
            type: 'button',
            category: 'Tiny Series',
            name: 'Preset 1',
            style: {
                text: 'Preset\n1',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TINY_triggerPreset',
                            options: {
                                presetNumber: 1,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tiny_preset_2'] = {
            type: 'button',
            category: 'Tiny Series',
            name: 'Preset 2',
            style: {
                text: 'Preset\n2',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TINY_triggerPreset',
                            options: {
                                presetNumber: 2,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tiny_preset_3'] = {
            type: 'button',
            category: 'Tiny Series',
            name: 'Preset 3',
            style: {
                text: 'Preset\n3',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TINY_triggerPreset',
                            options: {
                                presetNumber: 3,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }
	}

	// Tail 2 specific presets
	if (self.config.model === 'OBSBOT_TAIL_2') {
		presets['tail2_ai_single'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'AI Single-person',
			style: {
				text: 'AI\nSingle',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setAIMode',
							options: {
								aiMode: '0',
								autoZoomModeSingle: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_ai_multi'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'AI Multi-person',
			style: {
				text: 'AI\nMulti',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setAIMode',
							options: {
								aiMode: '1',
								autoZoomModeMulti: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_tracking_slow'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Tracking Slow',
			style: {
				text: 'Tracking\nSlow',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setTrackingSpeed',
							options: {
								mode: '2',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_tracking_fast'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Tracking Fast',
			style: {
				text: 'Tracking\nFast',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setTrackingSpeed',
							options: {
								mode: '3',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_only_me_on'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Only Me On',
			style: {
				text: 'Only Me\nON',
				size: '14',
				color: colors.white,
				bgcolor: colors.green,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setOnlyMe',
							options: {
								onlyMe: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_only_me_off'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Only Me Off',
			style: {
				text: 'Only Me\nOFF',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setOnlyMe',
							options: {
								onlyMe: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_start_recording'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Start Recording',
			style: {
				text: 'Start\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_startRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_stop_recording'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Stop Recording',
			style: {
				text: 'Stop\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_stopRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_snapshot'] = {
			type: 'button',
			category: 'Tail 2',
			name: 'Take Snapshot',
			style: {
				text: 'Take\nSnapshot',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_takeSnapshot',
							options: {},
						},
					],
					up: [],
				},
			],
		}

        presets['tail2_preset_1'] = {
            type: 'button',
            category: 'Tail 2',
            name: 'Preset 1',
            style: {
                text: 'Preset\n1',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_2_triggerPreset',
                            options: {
                                presetNumber: 1,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tail2_preset_2'] = {
            type: 'button',
            category: 'Tail 2',
            name: 'Preset 2',
            style: {
                text: 'Preset\n2',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_2_triggerPreset',
                            options: {
                                presetNumber: 2,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tail2_preset_3'] = {
            type: 'button',
            category: 'Tail 2',
            name: 'Preset 3',
            style: {
                text: 'Preset\n3',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_2_triggerPreset',
                            options: {
                                presetNumber: 3,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }
	}

	// Tail Air specific presets
	if (self.config.model === 'OBSBOT_TAIL_AIR') {
		presets['tailair_ai_normal'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'AI Normal Tracking',
			style: {
				text: 'AI\nNormal',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_setAIMode',
							options: {
								aiMode: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_ai_closeup'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'AI Close Up',
			style: {
				text: 'AI\nClose Up',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_setAIMode',
							options: {
								aiMode: '3',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_tracking_slow'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'Tracking Slow',
			style: {
				text: 'Tracking\nSlow',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_setTrackingSpeed',
							options: {
								trackingSpeed: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_tracking_fast'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'Tracking Fast',
			style: {
				text: 'Tracking\nFast',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_setTrackingSpeed',
							options: {
								trackingSpeed: '2',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_start_recording'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'Start Recording',
			style: {
				text: 'Start\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_startRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_stop_recording'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'Stop Recording',
			style: {
				text: 'Stop\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_stopRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['tailair_snapshot'] = {
			type: 'button',
			category: 'Tail Air',
			name: 'Take Snapshot',
			style: {
				text: 'Take\nSnapshot',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_AIR_takeSnapshot',
							options: {},
						},
					],
					up: [],
				},
			],
		}

        presets['tailair_preset_1'] = {
            type: 'button',
            category: 'Tail Air',
            name: 'Preset 1',
            style: {
                text: 'Preset\n1',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_AIR_triggerPreset',
                            options: {
                                presetNumber: 1,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tailair_preset_2'] = {
            type: 'button',
            category: 'Tail Air',
            name: 'Preset 2',
            style: {
                text: 'Preset\n2',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_AIR_triggerPreset',
                            options: {
                                presetNumber: 2,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['tailair_preset_3'] = {
            type: 'button',
            category: 'Tail Air',
            name: 'Preset 3',
            style: {
                text: 'Preset\n3',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_TAIL_AIR_triggerPreset',
                            options: {
                                presetNumber: 3,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }
	}

	// Center App Tail Series
	if (self.config.model === 'OBSBOT_CENTER_TAIL_AIR' || self.config.model === 'OBSBOT_CENTER_TAIL_2') {
        let tailCategory = '';
        self.config.model === 'OBSBOT_CENTER_TAIL_AIR' ? tailCategory = 'Center Tail Air' : tailCategory = 'Center Tail 2';

		presets['center_tail_ai_normal'] = {
			type: 'button',
			category: tailCategory,
			name: 'AI Normal Tracking',
			style: {
				text: 'AI\nNormal',
				size: '14',
				color: colors.white,
				bgcolor: colors.blue,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_aiMode',
							options: {
								aiMode: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail_tracking_slow'] = {
			type: 'button',
			category: tailCategory,
			name: 'Tracking Slow',
			style: {
				text: 'Tracking\nSlow',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_setTrackingSpeed',
							options: {
								trackingSpeed: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail_start_recording'] = {
			type: 'button',
			category: tailCategory,
			name: 'Start Recording',
			style: {
				text: 'Start\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_startRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail_stop_recording'] = {
			type: 'button',
			category: tailCategory,
			name: 'Stop Recording',
			style: {
				text: 'Stop\nRecording',
				size: '14',
				color: colors.white,
				bgcolor: colors.red,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_stopRecording',
							options: {},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail_snapshot'] = {
			type: 'button',
			category: tailCategory,
			name: 'Take Snapshot',
			style: {
				text: 'Take\nSnapshot',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_takeSnapshot',
							options: {},
						},
					],
					up: [],
				},
			],
		}

        presets['center_tail_preset_1'] = {
            type: 'button',
            category: tailCategory,
            name: 'Preset 1',
            style: {
                text: 'Preset\n1',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TAIL_triggerPreset',
                            options: {
                                presetNumber: 1,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['center_tail_preset_2'] = {
            type: 'button',
            category: tailCategory,
            name: 'Preset 2',
            style: {
                text: 'Preset\n2',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TAIL_triggerPreset',
                            options: {
                                presetNumber: 2,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }

        presets['center_tail_preset_3'] = {
            type: 'button',
            category: tailCategory,
            name: 'Preset 3',
            style: {
                text: 'Preset\n3',
                size: '14',
                color: colors.white,
                bgcolor: colors.purple,
            },
            feedbacks: [],
            steps: [
                {
                    down: [
                        {
                            actionId: 'OBSBOT_CENTER_TAIL_triggerPreset',
                            options: {
                                presetNumber: 3,
                            },
                        },
                    ],
                    up: [],
                },
            ],
        }
	}

	// Tail 2 specific Center app actions
	if (self.config.model === 'OBSBOT_CENTER_TAIL_2') {
		presets['center_tail2_pan_speed'] = {
			type: 'button',
			category: 'Center Tail 2',
			name: 'Pan Speed 5',
			style: {
				text: 'Pan\nSpeed 5',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_setPanTrackingSpeed',
							options: {
								panTrackingSpeed: 5,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail2_tilt_speed'] = {
			type: 'button',
			category: 'Center Tail 2',
			name: 'Tilt Speed 5',
			style: {
				text: 'Tilt\nSpeed 5',
				size: '14',
				color: colors.white,
				bgcolor: colors.teal,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_setTiltTrackingSpeed',
							options: {
								tiltTrackingSpeed: 5,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail2_pan_lock'] = {
			type: 'button',
			category: 'Center Tail 2',
			name: 'Pan Lock Toggle',
			style: {
				text: 'Pan\nLock',
				size: '14',
				color: colors.white,
				bgcolor: colors.purple,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_setPanAxisLock',
							options: {
								panAxisLock: '1',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_tail2_tilt_lock'] = {
			type: 'button',
			category: 'Center Tail 2',
			name: 'Tilt Lock Toggle',
			style: {
				text: 'Tilt\nLock',
				size: '14',
				color: colors.white,
				bgcolor: colors.purple,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TAIL_setTiltAxisLock',
							options: {
								tiltAxisLock: '1',
							},
						},
					],
					up: [],
				},
			],
		}
	}

	self.setPresetDefinitions(presets)
}
