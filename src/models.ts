/** Which set of model specific actions and presets a model gets */
export type ModelFamily = 'tail2' | 'tailAir' | 'center' | 'tiny' | 'centerTail' | 'meet'

interface ModelCapabilities {
	family: ModelFamily
	label: string
	/** Commands go through the OBSBOT Center App, and most need a leading device ID */
	isCenterApp: boolean
	/** Tail 2 hardware zooms on command, but always reports zoom 0 and FOV -1 */
	reportsZoom: boolean
	/** The device reports which preset positions are saved */
	hasPositionPresets: boolean
	autoFocus: boolean
	focusMode: boolean
	zoomSpeedMax: number
	gimbalLimits: { pan: number; pitch: number }
	/** The order of the two values in a gimbal reply, as the spec's three value form isn't what devices send */
	gimbalReplyOrder: 'pitchYaw' | 'yawPitch'
	pollQueries: readonly OSCAddress[]
}

const DefaultGimbalLimits = { pan: 129, pitch: 59 }

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
		focusMode: false,
		zoomSpeedMax: 10,
		gimbalLimits: { pan: 159, pitch: 62 },
		gimbalReplyOrder: 'pitchYaw',
		// Tail 2 hardware ignores every Get* query, but answers each Connected with its full state
		pollQueries: ['/OBSBOT/WebCam/General/Connected'],
	},
	{
		id: 'OBSBOT_TAIL_AIR',
		label: 'OBSBOT Tail Air',
		family: 'tailAir',
		isCenterApp: false,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: true,
		focusMode: false,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
	},
	{
		id: 'OBSBOT_CENTER',
		label: 'OBSBOT Center App',
		family: 'center',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: true,
		focusMode: true,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
	},
	{
		id: 'OBSBOT_CENTER_TINY',
		label: 'OBSBOT Center App (Tiny Series)',
		family: 'tiny',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: true,
		autoFocus: true,
		focusMode: false,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: [
			...CommonPollQueries,
			'/OBSBOT/WebCam/Tiny/GetAiTrackingInfo',
			'/OBSBOT/WebCam/Tiny/GetPresetPositionInfo',
		],
	},
	{
		id: 'OBSBOT_CENTER_TAIL_AIR',
		label: 'OBSBOT Center App (Tail Series - Tail Air)',
		family: 'centerTail',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: false,
		focusMode: true,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
	},
	{
		id: 'OBSBOT_CENTER_TAIL_2',
		label: 'OBSBOT Center App (Tail Series - Tail 2)',
		family: 'centerTail',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: false,
		autoFocus: false,
		focusMode: true,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: CommonPollQueries,
	},
	{
		id: 'OBSBOT_CENTER_MEET',
		label: 'OBSBOT Center App (Meet Series)',
		family: 'meet',
		isCenterApp: true,
		reportsZoom: true,
		hasPositionPresets: true,
		autoFocus: true,
		focusMode: false,
		zoomSpeedMax: 11,
		gimbalLimits: DefaultGimbalLimits,
		gimbalReplyOrder: 'yawPitch',
		pollQueries: [
			...CommonPollQueries,
			'/OBSBOT/WebCam/Meet/GetVirtualBackgroundInfo',
			'/OBSBOT/WebCam/Meet/GetAutoFramingInfo',
			'/OBSBOT/WebCam/Meet/GetPresetPositionInfo',
		],
	},
] as const satisfies readonly (ModelCapabilities & { id: string })[]

export type ModelId = (typeof Models)[number]['id']
export type Model = ModelCapabilities & { id: ModelId }

/** Undefined when a saved config names a model this version doesn't have */
export function findModel(id: ModelId): Model | undefined {
	return Models.find((model) => model.id === id)
}
