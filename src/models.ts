/** Which set of model specific actions and presets a model gets */
export type ModelFamily = 'tail2' | 'tail2Adv' | 'tailAir' | 'tailAir2' | 'center' | 'tiny' | 'centerTail' | 'meet'

interface ModelCapabilities {
	family: ModelFamily
	label: string
	/** Commands go through the OBSBOT Center App, and most need a leading device ID */
	isCenterApp: boolean
	/** Tail 2 and Tail 2 ADV hardware zoom on command, but always report zoom 0 and FOV -1 */
	reportsZoom: boolean
	/** The device reports which preset positions are saved */
	hasPositionPresets: boolean
	autoFocus: boolean
	/** Auto focus has single and continuous modes, rather than just on and off */
	continuousAutoFocus: boolean
	iris: boolean
	focusMode: boolean
	zoomSpeedMax: number
	isoMax: number
	/** Shutter speeds as the denominator of 1/x seconds */
	shutterSpeeds: { fastest: number; slowest: number }
	gimbalLimits: { pan: number; pitchMin: number; pitchMax: number }
	/** The order of the two values in a gimbal reply, as the spec's three value form isn't what devices send */
	gimbalReplyOrder: 'pitchYaw' | 'yawPitch'
	pollQueries: readonly OSCAddress[]
	/** Where the shared General commands and replies live. Tail Air 2 moved them from WebCam to Camera */
	generalPrefix: '/OBSBOT/WebCam/General/' | '/OBSBOT/Camera/General/'
}

const DefaultGimbalLimits = { pan: 129, pitchMin: -59, pitchMax: 59 }

const DefaultShutterSpeeds = { fastest: 6400, slowest: 2.5 }

const CommonPollQueries = [
	'/OBSBOT/WebCam/General/GetDeviceInfo',
	'/OBSBOT/WebCam/General/GetZoomInfo',
	'/OBSBOT/WebCam/General/GetGimbalPosInfo',
] as const satisfies readonly OSCAddress[]

export const Models = [
	{
		id: 'OBSBOT_TAIL_2',
		label: 'OBSBOT Tail 2',
		family: 'tail2',
		isCenterApp: false,
		reportsZoom: false,
		hasPositionPresets: true,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: false,
		zoomSpeedMax: 10,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: { pan: 159, pitchMin: -62, pitchMax: 62 },
		gimbalReplyOrder: 'pitchYaw',
		// Tail 2 hardware ignores every Get* query, but answers each Connected with its full state
		pollQueries: ['/OBSBOT/WebCam/General/Connected'],
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_TAIL_2_ADV',
		label: 'OBSBOT Tail 2 ADV',
		family: 'tail2Adv',
		isCenterApp: false,
		reportsZoom: false,
		hasPositionPresets: true,
		autoFocus: true,
		continuousAutoFocus: true,
		iris: true,
		focusMode: false,
		zoomSpeedMax: 10,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: { pan: 159, pitchMin: -62, pitchMax: 62 },
		gimbalReplyOrder: 'pitchYaw',
		// Like Tail 2, it ignores every Get* query but answers each Connected with its full state
		pollQueries: ['/OBSBOT/WebCam/General/Connected'],
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_TAIL_AIR',
		label: 'OBSBOT Tail Air',
		family: 'tailAir',
		isCenterApp: false,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: false,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_TAIL_AIR_2',
		label: 'OBSBOT Tail Air 2',
		family: 'tailAir2',
		isCenterApp: false,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: false,
		zoomSpeedMax: 11,
		isoMax: 25600,
		shutterSpeeds: { fastest: 8000, slowest: 3 },
		gimbalLimits: { pan: 150, pitchMin: -80, pitchMax: 63 },
		// The spec only documents the three value [roll, pitch, yaw] reply
		gimbalReplyOrder: 'pitchYaw',
		pollQueries: CommonPollQueries,
		generalPrefix: '/OBSBOT/Camera/General/',
	},
	{
		id: 'OBSBOT_CENTER',
		label: 'OBSBOT Center App',
		family: 'center',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: true,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_CENTER_TINY',
		label: 'OBSBOT Center App (Tiny Series)',
		family: 'tiny',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: true,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: false,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: [
			...CommonPollQueries,
			'/OBSBOT/WebCam/Tiny/GetAiTrackingInfo',
			'/OBSBOT/WebCam/Tiny/GetPresetPositionInfo',
		],
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_CENTER_TAIL_AIR',
		label: 'OBSBOT Center App (Tail Series - Tail Air)',
		family: 'centerTail',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: false,
		continuousAutoFocus: false,
		iris: false,
		focusMode: true,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_CENTER_TAIL_2',
		label: 'OBSBOT Center App (Tail Series - Tail 2)',
		family: 'centerTail',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: false,
		continuousAutoFocus: false,
		iris: false,
		focusMode: true,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
	{
		id: 'OBSBOT_CENTER_MEET',
		label: 'OBSBOT Center App (Meet Series)',
		family: 'meet',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: true,
		autoFocus: true,
		continuousAutoFocus: false,
		iris: false,
		focusMode: false,
		zoomSpeedMax: 11,
		isoMax: 6400,
		shutterSpeeds: DefaultShutterSpeeds,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: [
			...CommonPollQueries,
			'/OBSBOT/WebCam/Meet/GetVirtualBackgroundInfo',
			'/OBSBOT/WebCam/Meet/GetAutoFramingInfo',
			'/OBSBOT/WebCam/Meet/GetPresetPositionInfo',
		],
		generalPrefix: '/OBSBOT/WebCam/General/',
	},
] as const satisfies readonly (ModelCapabilities & { id: string })[]

export type ModelId = (typeof Models)[number]['id']
export type Model = ModelCapabilities & { id: ModelId }

/** Undefined when a saved config names a model this version doesn't have */
export function findModel(id: ModelId): Model | undefined {
	return Models.find((model) => model.id === id)
}
