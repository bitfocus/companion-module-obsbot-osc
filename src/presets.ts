import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import type OBSBOTInstance from './main.js'
import type { OBSBOTTypes } from './main.js'
import { Models } from './models.js'
import { OBSBOT_ICONS } from './icons.js'

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
	const presets: CompanionPresetDefinitions<OBSBOTTypes> = {}

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
			type: 'simple',
			name: 'Zoom 0%',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_0,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Zoom 50%',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_50,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Zoom 100%',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_100,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Zoom Speed',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_SPEED,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Zoom Max',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_MAX,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Zoom Min',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ZOOM_MIN,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Move Gimbal Up',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.GIMBAL_MOVE_UP,
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
			type: 'simple',
			name: 'Move Gimbal Down',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.GIMBAL_MOVE_DOWN,
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
			type: 'simple',
			name: 'Move Gimbal Left',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.GIMBAL_MOVE_LEFT,
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
			type: 'simple',
			name: 'Move Gimbal Right',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.GIMBAL_MOVE_RIGHT,
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
		//     type: 'simple',
		//     name: 'Move Gimbal Up-Left',
		//     style: {
		//         text: '',
		//         size: '14',
		//         color: colors.white,
		//         bgcolor: colors.black,
		//         show_topbar: false,
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
		//     type: 'simple',
		//     name: 'Move Gimbal Up-Right',
		//     style: {
		//         text: '',
		//         size: '14',
		//         color: colors.white,
		//         bgcolor: colors.black,
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
		//     type: 'simple',
		//     name: 'Move Gimbal Down-Left',
		//     style: {
		//         text: '',
		//         size: '14',
		//         color: colors.white,
		//         bgcolor: colors.black,
		//         show_topbar: false,
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
		//     type: 'simple',
		//     name: 'Move Gimbal Down-Right',
		//     style: {
		//         text: '',
		//         size: '14',
		//         color: colors.white,
		//         bgcolor: colors.black,
		//         show_topbar: false,
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
			type: 'simple',
			name: 'Set Gimbal Position',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				png64: OBSBOT_ICONS.SET_POSITION,
				show_topbar: false,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Reset Gimbal',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.RESET_GIMBAL,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Mirror Mode On',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.MIRROR_MODE_ON,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Mirror Mode Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.MIRROR_MODE_OFF,
				pngalignment: 'center:center',
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
		// SetAutoFocus is Tiny/Meet (and hardware) only; Center Tail uses SetFocusMode instead
		const autoFocusUnsupported = ['OBSBOT_CENTER_TAIL_AIR', 'OBSBOT_CENTER_TAIL_2']
		if (!autoFocusUnsupported.includes(self.config.model)) {
			presets['autofocus_on'] = {
				type: 'simple',
				name: 'Auto Focus On',
				style: {
					text: '',
					size: '14',
					color: colors.white,
					bgcolor: colors.black,
					show_topbar: false,
					png64: OBSBOT_ICONS.AUTO_FOCUS_ON,
					pngalignment: 'center:center',
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
				type: 'simple',
				name: 'Auto Focus Off',
				style: {
					text: '',
					size: '14',
					color: colors.white,
					bgcolor: colors.black,
					show_topbar: false,
					png64: OBSBOT_ICONS.AUTO_FOCUS_OFF,
					pngalignment: 'center:center',
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
		}

		presets['autoexposure_on'] = {
			type: 'simple',
			name: 'Auto Exposure On',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_EXPOSURE_ON,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Auto Exposure Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_EXPOSURE_OFF,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Auto White Balance On',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_WB_ON,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Auto White Balance Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_WB_OFF,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Manual Focus 50',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.MANUAL_FOCUS_50,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Color Temp 5000K',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.COLOR_TEMP_5000K,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'View 86°',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_VIEW_86,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'View 78°',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_VIEW_78,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'View 65°',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_VIEW_65,
				pngalignment: 'center:center',
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

		presets['center_recording_start'] = {
			type: 'simple',
			name: 'Start Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.START_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Stop Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.STOP_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Take Snapshot',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TAKE_SNAPSHOT,
				pngalignment: 'center:center',
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

	// SetFocusMode is Center App Tail series only
	const focusModeModels = ['OBSBOT_CENTER', 'OBSBOT_CENTER_TAIL_AIR', 'OBSBOT_CENTER_TAIL_2']
	if (focusModeModels.includes(self.config.model)) {
		presets['center_focus_afs'] = {
			type: 'simple',
			name: 'Focus Mode AF-S',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_AF_S,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setFocusMode',
							options: {
								focusMode: '0',
								focusValue: 0,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_focus_afc'] = {
			type: 'simple',
			name: 'Focus Mode AF-C',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_AF_C,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'setFocusMode',
							options: {
								focusMode: '1',
								focusValue: 0,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['center_focus_mf'] = {
			type: 'simple',
			name: 'Focus Mode MF',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_MF,
				pngalignment: 'center:center',
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
	}

	// Center App Meet Series presets
	if (self.config.model === 'OBSBOT_CENTER_MEET') {
		presets['meet_autoframe_off'] = {
			type: 'simple',
			name: 'Auto Framing Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_FRAMING_OFF,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Auto Framing Single',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_FRAMING_SINGLE,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Auto Framing Group',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AUTO_FRAMING_GROUP,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Virtual BG Disable',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.VB_DISABLE,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Virtual BG Blur',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.VB_BLUR,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Standard Mode',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.STANDARD_MODE,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Lock On',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_LOCK_ON,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Lock Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_LOCK_OFF,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Mode Normal',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_MODE_NORMAL,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_CENTER_TINY_aiMode',
							options: {
								camera: 'tiny2',
								aiMode: '1',
								aiModeTiny3: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tiny_tracking_headroom'] = {
			type: 'simple',
			name: 'Tracking Headroom',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_TRACKING_HEADROOM,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 1',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_1,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 2',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_2,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 3',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_3,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Single-person',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_SINGLE,
				pngalignment: 'center:center',
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
								autoZoomModeMulti: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_ai_multi'] = {
			type: 'simple',
			name: 'AI Multi-person',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_MULTI,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setAIMode',
							options: {
								aiMode: '1',
								autoZoomModeSingle: '0',
								autoZoomModeMulti: '0',
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_tracking_slow'] = {
			type: 'simple',
			name: 'Tracking Slow',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TRACKING_SLOW,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setTrackingSpeed',
							options: {
								mode: '2',
								panMode: '0',
								panSpeed: 1,
								pitchMode: '0',
								pitchSpeed: 1,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_tracking_fast'] = {
			type: 'simple',
			name: 'Tracking Fast',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TRACKING_FAST,
				pngalignment: 'center:center',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'OBSBOT_TAIL_2_setTrackingSpeed',
							options: {
								mode: '3',
								panMode: '0',
								panSpeed: 1,
								pitchMode: '0',
								pitchSpeed: 1,
							},
						},
					],
					up: [],
				},
			],
		}

		presets['tail2_only_me_on'] = {
			type: 'simple',
			name: 'Only Me On',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ONLY_ME_ON,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Only Me Off',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.ONLY_ME_OFF,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Start Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.START_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Stop Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.STOP_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Take Snapshot',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TAKE_SNAPSHOT,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 1',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_1,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 2',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_2,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 3',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_3,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Normal Tracking',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_MODE_NORMAL,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'AI Close Up',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_CLOSE_UP,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Tracking Slow',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TRACKING_SLOW,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Tracking Fast',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TRACKING_FAST,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Start Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.START_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Stop Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.STOP_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Take Snapshot',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TAKE_SNAPSHOT,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 1',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_1,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 2',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_2,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 3',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_3,
				pngalignment: 'center:center',
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
		presets['center_tail_ai_normal'] = {
			type: 'simple',
			name: 'AI Normal Tracking',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.AI_MODE_NORMAL,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Tracking Slow',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TRACKING_SLOW,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Start Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.START_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Stop Recording',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.STOP_RECORDING,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Take Snapshot',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.TAKE_SNAPSHOT,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 1',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_1,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 2',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_2,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Preset 3',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.PRESET_3,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Pan Speed 5',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_PAN_SPEED,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Tilt Speed 5',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_TILT_SPEED,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Pan Lock Toggle',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_PAN_LOCK,
				pngalignment: 'center:center',
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
			type: 'simple',
			name: 'Tilt Lock Toggle',
			style: {
				text: '',
				size: '14',
				color: colors.white,
				bgcolor: colors.black,
				show_topbar: false,
				png64: OBSBOT_ICONS.CENTER_TILT_LOCK,
				pngalignment: 'center:center',
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

	const centerTailSectionName = self.config.model === 'OBSBOT_CENTER_TAIL_AIR' ? 'Center Tail Air' : 'Center Tail 2'

	// Lists every preset a section can hold; those not offered on the current model are filtered out below
	const allSections: { id: string; name: string; definitions: string[] }[] = [
		{
			id: 'zoom',
			name: 'Zoom',
			definitions: ['zoom_0', 'zoom_50', 'zoom_100', 'zoom_speed', 'zoom_max', 'zoom_min'],
		},
		{
			id: 'gimbal',
			name: 'Gimbal',
			definitions: [
				'gimbal_up',
				'gimbal_down',
				'gimbal_left',
				'gimbal_right',
				'gimbal_up_left',
				'gimbal_up_right',
				'gimbal_down_left',
				'gimbal_down_right',
				'gimbal_motor_degree',
				'gimbal_reset',
			],
		},
		{
			id: 'other',
			name: 'Other',
			definitions: ['mirror_mode_on', 'mirror_mode_off'],
		},
		{
			id: 'image',
			name: 'Image',
			definitions: [
				'autofocus_on',
				'autofocus_off',
				'autoexposure_on',
				'autoexposure_off',
				'auto_wb_on',
				'auto_wb_off',
				'manual_focus_50',
				'color_temp_5000',
			],
		},
		{
			id: 'center_app',
			name: 'Center App',
			definitions: [
				'center_view_86',
				'center_view_78',
				'center_view_65',
				'center_recording_start',
				'center_recording_stop',
				'center_snapshot',
				'center_focus_afs',
				'center_focus_afc',
				'center_focus_mf',
			],
		},
		{
			id: 'meet_series',
			name: 'Meet Series',
			definitions: [
				'meet_autoframe_off',
				'meet_autoframe_single',
				'meet_autoframe_group',
				'meet_vb_disable',
				'meet_vb_blur',
				'meet_standard_mode',
			],
		},
		{
			id: 'tiny_series',
			name: 'Tiny Series',
			definitions: [
				'tiny_ai_lock_on',
				'tiny_ai_lock_off',
				'tiny_ai_mode_normal',
				'tiny_tracking_headroom',
				'tiny_preset_1',
				'tiny_preset_2',
				'tiny_preset_3',
			],
		},
		{
			id: 'tail_2',
			name: 'Tail 2',
			definitions: [
				'tail2_ai_single',
				'tail2_ai_multi',
				'tail2_tracking_slow',
				'tail2_tracking_fast',
				'tail2_only_me_on',
				'tail2_only_me_off',
				'tail2_start_recording',
				'tail2_stop_recording',
				'tail2_snapshot',
				'tail2_preset_1',
				'tail2_preset_2',
				'tail2_preset_3',
			],
		},
		{
			id: 'tail_air',
			name: 'Tail Air',
			definitions: [
				'tailair_ai_normal',
				'tailair_ai_closeup',
				'tailair_tracking_slow',
				'tailair_tracking_fast',
				'tailair_start_recording',
				'tailair_stop_recording',
				'tailair_snapshot',
				'tailair_preset_1',
				'tailair_preset_2',
				'tailair_preset_3',
			],
		},
		{
			id: 'center_tail',
			name: centerTailSectionName,
			definitions: [
				'center_tail_ai_normal',
				'center_tail_tracking_slow',
				'center_tail_start_recording',
				'center_tail_stop_recording',
				'center_tail_snapshot',
				'center_tail_preset_1',
				'center_tail_preset_2',
				'center_tail_preset_3',
				'center_tail2_pan_speed',
				'center_tail2_tilt_speed',
				'center_tail2_pan_lock',
				'center_tail2_tilt_lock',
			],
		},
	]

	const structure: CompanionPresetSection<OBSBOTTypes>[] = allSections
		.map((section) => ({ ...section, definitions: section.definitions.filter((id) => id in presets) }))
		.filter((section) => section.definitions.length > 0)

	self.setPresetDefinitions(structure, presets)
}
