import {
	combineRgb,
	type CompanionPresetDefinitions,
	type CompanionPresetSection,
	type CompanionSimplePresetDefinition,
} from '@companion-module/base'
import { OBSBOT_ICONS as Icons } from './icons.js'
import type OBSBOTInstance from './main.js'
import type { OBSBOTTypes } from './main.js'
import { findModel, type Model } from './models.js'

type Preset = CompanionSimplePresetDefinition<OBSBOTTypes>
type Presets = Record<string, Preset>
type PresetAction = Preset['steps'][number]['down'][number]

interface Section {
	id: string
	name: string
	presets: Presets
}

const White = combineRgb(255, 255, 255)
const Black = combineRgb(0, 0, 0)

function act(actionId: string, options: Record<string, string | number> = {}): PresetAction {
	return { actionId, options }
}

function iconPreset(name: string, icon: string, down: PresetAction, up?: PresetAction): Preset {
	return {
		type: 'simple',
		name,
		style: {
			text: '',
			size: '14',
			color: White,
			bgcolor: Black,
			show_topbar: false,
			png64: icon,
			pngalignment: 'center:center',
		},
		feedbacks: [],
		steps: [{ down: [down], up: up ? [up] : [] }],
	}
}

function gimbalMovePreset(direction: 'Up' | 'Down' | 'Left' | 'Right', icon: string): Preset {
	return iconPreset(
		`Move Gimbal ${direction}`,
		icon,
		act(`moveGimbal${direction}`, { moveSpeed: 100 }),
		act(`stopGimbal${direction}`),
	)
}

function positionPresets(presetPrefix: string, actionPrefix: string): Presets {
	const icons = [Icons.PRESET_1, Icons.PRESET_2, Icons.PRESET_3]

	return Object.fromEntries(
		icons.map((icon, index) => [
			`${presetPrefix}_preset_${index + 1}`,
			iconPreset(`Preset ${index + 1}`, icon, act(`${actionPrefix}_triggerPreset`, { presetNumber: index + 1 })),
		]),
	)
}

/** The same recording, snapshot and preset buttons, for each Tail variant's own actions */
function cameraControlPresets(presetPrefix: string, actionPrefix: string): Presets {
	return {
		[`${presetPrefix}_start_recording`]: iconPreset(
			'Start Recording',
			Icons.START_RECORDING,
			act(`${actionPrefix}_startRecording`),
		),
		[`${presetPrefix}_stop_recording`]: iconPreset(
			'Stop Recording',
			Icons.STOP_RECORDING,
			act(`${actionPrefix}_stopRecording`),
		),
		[`${presetPrefix}_snapshot`]: iconPreset('Take Snapshot', Icons.TAKE_SNAPSHOT, act(`${actionPrefix}_takeSnapshot`)),
		...positionPresets(presetPrefix, actionPrefix),
	}
}

function commonSections(model: Model): Section[] {
	return [
		{
			id: 'zoom',
			name: 'Zoom',
			presets: {
				zoom_0: iconPreset('Zoom 0%', Icons.ZOOM_0, act('setZoom', { zoom: 0 })),
				zoom_50: iconPreset('Zoom 50%', Icons.ZOOM_50, act('setZoom', { zoom: 50 })),
				zoom_100: iconPreset('Zoom 100%', Icons.ZOOM_100, act('setZoom', { zoom: 100 })),
				zoom_speed: iconPreset('Zoom Speed', Icons.ZOOM_SPEED, act('setZoomSpeed', { zoomValue: 50, zoomSpeed: 5 })),
				zoom_max: iconPreset('Zoom Max', Icons.ZOOM_MAX, act('setZoomMax', { zoomLevel: 100 })),
				zoom_min: iconPreset('Zoom Min', Icons.ZOOM_MIN, act('setZoomMin', { zoomLevel: 0 })),
			},
		},
		{
			id: 'gimbal',
			name: 'Gimbal',
			presets: {
				gimbal_up: gimbalMovePreset('Up', Icons.GIMBAL_MOVE_UP),
				gimbal_down: gimbalMovePreset('Down', Icons.GIMBAL_MOVE_DOWN),
				gimbal_left: gimbalMovePreset('Left', Icons.GIMBAL_MOVE_LEFT),
				gimbal_right: gimbalMovePreset('Right', Icons.GIMBAL_MOVE_RIGHT),
				gimbal_motor_degree: iconPreset(
					'Set Gimbal Position',
					Icons.SET_POSITION,
					act('setGimMotorDegree', { speed: 30, pan: 0, pitch: 0 }),
				),
				gimbal_reset: iconPreset('Reset Gimbal', Icons.RESET_GIMBAL, act('resetGimbal')),
			},
		},
		{
			id: 'other',
			name: 'Other',
			presets: {
				mirror_mode_on: iconPreset('Mirror Mode On', Icons.MIRROR_MODE_ON, act('setMirror', { mirrorMode: '1' })),
				mirror_mode_off: iconPreset('Mirror Mode Off', Icons.MIRROR_MODE_OFF, act('setMirror', { mirrorMode: '0' })),
			},
		},
		{
			id: 'image',
			name: 'Image',
			presets: {
				...(model.autoFocus
					? {
							autofocus_on: iconPreset('Auto Focus On', Icons.AUTO_FOCUS_ON, act('setAutoFocus', { autoFocus: '1' })),
							autofocus_off: iconPreset(
								'Auto Focus Off',
								Icons.AUTO_FOCUS_OFF,
								act('setAutoFocus', { autoFocus: '0' }),
							),
						}
					: {}),
				autoexposure_on: iconPreset(
					'Auto Exposure On',
					Icons.AUTO_EXPOSURE_ON,
					act('setAutoExposure', { autoExposure: '1' }),
				),
				autoexposure_off: iconPreset(
					'Auto Exposure Off',
					Icons.AUTO_EXPOSURE_OFF,
					act('setAutoExposure', { autoExposure: '0' }),
				),
				auto_wb_on: iconPreset(
					'Auto White Balance On',
					Icons.AUTO_WB_ON,
					act('setAutoWhiteBalance', { autoWhiteBalance: '1' }),
				),
				auto_wb_off: iconPreset(
					'Auto White Balance Off',
					Icons.AUTO_WB_OFF,
					act('setAutoWhiteBalance', { autoWhiteBalance: '0' }),
				),
				manual_focus_50: iconPreset(
					'Manual Focus 50',
					Icons.MANUAL_FOCUS_50,
					act('setManualFocus', { focusValue: 50 }),
				),
				color_temp_5000: iconPreset(
					'Color Temp 5000K',
					Icons.COLOR_TEMP_5000K,
					act('setColorTemperature', { colorTemperature: 5000 }),
				),
			},
		},
	]
}

function centerAppSection(model: Model): Section {
	return {
		id: 'center_app',
		name: 'Center App',
		presets: {
			...(model.family === 'center'
				? {
						center_view_86: iconPreset('View 86°', Icons.CENTER_VIEW_86, act('setView', { viewAngle: '0' })),
						center_view_78: iconPreset('View 78°', Icons.CENTER_VIEW_78, act('setView', { viewAngle: '1' })),
						center_view_65: iconPreset('View 65°', Icons.CENTER_VIEW_65, act('setView', { viewAngle: '2' })),
						center_recording_start: iconPreset('Start Recording', Icons.START_RECORDING, act('startPCRecording')),
						center_recording_stop: iconPreset('Stop Recording', Icons.STOP_RECORDING, act('stopPCRecording')),
						center_snapshot: iconPreset('Take Snapshot', Icons.TAKE_SNAPSHOT, act('PCSnapshot')),
					}
				: {}),
			...(model.focusMode
				? {
						center_focus_afs: iconPreset(
							'Focus Mode AF-S',
							Icons.CENTER_AF_S,
							act('setFocusMode', { focusMode: '0', focusValue: 0 }),
						),
						center_focus_afc: iconPreset(
							'Focus Mode AF-C',
							Icons.CENTER_AF_C,
							act('setFocusMode', { focusMode: '1', focusValue: 0 }),
						),
						center_focus_mf: iconPreset(
							'Focus Mode MF',
							Icons.CENTER_MF,
							act('setFocusMode', { focusMode: '2', focusValue: 50 }),
						),
					}
				: {}),
		},
	}
}

function meetSection(): Section {
	const autoFraming = (autoFraming: string) => act('OBSBOT_CENTER_MEET_setAutoFraming', { autoFraming })
	const virtualBackground = (virtualBackground: string) =>
		act('OBSBOT_CENTER_MEET_setVirtualBackground', { virtualBackground })

	return {
		id: 'meet_series',
		name: 'Meet Series',
		presets: {
			meet_autoframe_off: iconPreset('Auto Framing Off', Icons.AUTO_FRAMING_OFF, autoFraming('0')),
			meet_autoframe_single: iconPreset('Auto Framing Single', Icons.AUTO_FRAMING_SINGLE, autoFraming('1')),
			meet_autoframe_group: iconPreset('Auto Framing Group', Icons.AUTO_FRAMING_GROUP, autoFraming('2')),
			meet_vb_disable: iconPreset('Virtual BG Disable', Icons.VB_DISABLE, virtualBackground('0')),
			meet_vb_blur: iconPreset('Virtual BG Blur', Icons.VB_BLUR, virtualBackground('1')),
			meet_standard_mode: iconPreset('Standard Mode', Icons.STANDARD_MODE, act('OBSBOT_CENTER_MEET_setStandardMode')),
		},
	}
}

function tinySection(): Section {
	return {
		id: 'tiny_series',
		name: 'Tiny Series',
		presets: {
			tiny_ai_lock_on: iconPreset('AI Lock On', Icons.AI_LOCK_ON, act('OBSBOT_CENTER_TINY_aiLock', { aiLock: '1' })),
			tiny_ai_lock_off: iconPreset('AI Lock Off', Icons.AI_LOCK_OFF, act('OBSBOT_CENTER_TINY_aiLock', { aiLock: '0' })),
			tiny_ai_mode_normal: iconPreset(
				'AI Mode Normal',
				Icons.AI_MODE_NORMAL,
				act('OBSBOT_CENTER_TINY_aiMode', { camera: 'tiny2', aiMode: '1', aiModeTiny3: '0' }),
			),
			tiny_tracking_headroom: iconPreset(
				'Tracking Headroom (not on Tiny 2)',
				Icons.AI_TRACKING_HEADROOM,
				act('OBSBOT_CENTER_TINY_setTrackingMode', { trackingMode: '0' }),
			),
			...positionPresets('tiny', 'OBSBOT_CENTER_TINY'),
		},
	}
}

function tail2Section(): Section {
	const aiMode = (aiMode: string) =>
		act('OBSBOT_TAIL_2_setAIMode', { aiMode, autoZoomModeSingle: '0', autoZoomModeMulti: '0' })
	const tracking = (mode: string) =>
		act('OBSBOT_TAIL_2_setTrackingSpeed', { mode, panMode: '0', panSpeed: 1, pitchMode: '0', pitchSpeed: 1 })

	return {
		id: 'tail_2',
		name: 'Tail 2',
		presets: {
			tail2_ai_single: iconPreset('AI Single-person', Icons.AI_SINGLE, aiMode('0')),
			tail2_ai_multi: iconPreset('AI Multi-person', Icons.AI_MULTI, aiMode('1')),
			tail2_tracking_slow: iconPreset('Tracking Slow', Icons.TRACKING_SLOW, tracking('2')),
			tail2_tracking_fast: iconPreset('Tracking Fast', Icons.TRACKING_FAST, tracking('3')),
			tail2_only_me_on: iconPreset('Only Me On', Icons.ONLY_ME_ON, act('OBSBOT_TAIL_2_setOnlyMe', { onlyMe: '1' })),
			tail2_only_me_off: iconPreset('Only Me Off', Icons.ONLY_ME_OFF, act('OBSBOT_TAIL_2_setOnlyMe', { onlyMe: '0' })),
			...cameraControlPresets('tail2', 'OBSBOT_TAIL_2'),
		},
	}
}

function tailAirSection(): Section {
	const aiMode = (aiMode: string) => act('OBSBOT_TAIL_AIR_setAIMode', { aiMode })
	const tracking = (trackingSpeed: string) => act('OBSBOT_TAIL_AIR_setTrackingSpeed', { trackingSpeed })

	return {
		id: 'tail_air',
		name: 'Tail Air',
		presets: {
			tailair_ai_normal: iconPreset('AI Normal Tracking', Icons.AI_MODE_NORMAL, aiMode('1')),
			tailair_ai_closeup: iconPreset('AI Close Up', Icons.AI_CLOSE_UP, aiMode('3')),
			tailair_tracking_slow: iconPreset('Tracking Slow', Icons.TRACKING_SLOW, tracking('0')),
			tailair_tracking_fast: iconPreset('Tracking Fast', Icons.TRACKING_FAST, tracking('2')),
			...cameraControlPresets('tailair', 'OBSBOT_TAIL_AIR'),
		},
	}
}

function centerTailSection(model: Model): Section {
	const isTail2 = model.id === 'OBSBOT_CENTER_TAIL_2'

	return {
		id: 'center_tail',
		name: isTail2 ? 'Center Tail 2' : 'Center Tail Air',
		presets: {
			center_tail_ai_normal: iconPreset(
				'AI Normal Tracking',
				Icons.AI_MODE_NORMAL,
				act('OBSBOT_CENTER_TAIL_aiMode', { aiMode: '1' }),
			),
			center_tail_tracking_slow: iconPreset(
				'Tracking Slow',
				Icons.TRACKING_SLOW,
				act('OBSBOT_CENTER_TAIL_setTrackingSpeed', { trackingSpeed: '0' }),
			),
			...cameraControlPresets('center_tail', 'OBSBOT_CENTER_TAIL'),
			...(isTail2
				? {
						center_tail2_pan_speed: iconPreset(
							'Pan Speed 5',
							Icons.CENTER_PAN_SPEED,
							act('OBSBOT_CENTER_TAIL_setPanTrackingSpeed', { panTrackingSpeed: 5 }),
						),
						center_tail2_tilt_speed: iconPreset(
							'Tilt Speed 5',
							Icons.CENTER_TILT_SPEED,
							act('OBSBOT_CENTER_TAIL_setTiltTrackingSpeed', { tiltTrackingSpeed: 5 }),
						),
						center_tail2_pan_lock: iconPreset(
							'Pan Lock Toggle',
							Icons.CENTER_PAN_LOCK,
							act('OBSBOT_CENTER_TAIL_setPanAxisLock', { panAxisLock: '1' }),
						),
						center_tail2_tilt_lock: iconPreset(
							'Tilt Lock Toggle',
							Icons.CENTER_TILT_LOCK,
							act('OBSBOT_CENTER_TAIL_setTiltAxisLock', { tiltAxisLock: '1' }),
						),
					}
				: {}),
		},
	}
}

function modelSections(model: Model): Section[] {
	switch (model.family) {
		case 'meet':
			return [meetSection()]
		case 'tiny':
			return [tinySection()]
		case 'tail2':
			return [tail2Section()]
		case 'tailAir':
			return [tailAirSection()]
		case 'centerTail':
			return [centerTailSection(model)]
		case 'center':
			return []
	}
}

export function UpdatePresets(self: OBSBOTInstance): void {
	const model = findModel(self.config.model)
	if (!model) {
		self.log('error', `Model ${self.config.model} not found.`)
		return
	}

	const sections = [...commonSections(model), centerAppSection(model), ...modelSections(model)].filter(
		(section) => Object.keys(section.presets).length > 0,
	)

	const structure: CompanionPresetSection<OBSBOTTypes>[] = sections.map(({ id, name, presets }) => ({
		id,
		name,
		definitions: Object.keys(presets),
	}))
	const presets: CompanionPresetDefinitions<OBSBOTTypes> = Object.assign(
		{},
		...sections.map((section) => section.presets),
	)

	self.setPresetDefinitions(structure, presets)
}
