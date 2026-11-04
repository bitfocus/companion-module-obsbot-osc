import { findModel, type ModelId } from './models.js'
import type { DeviceEntry, PresetPosition } from './state.js'

export type ParsedReply =
	| { kind: 'deviceInfo'; devices: DeviceEntry[]; selectedDeviceIndex: number; selectedDeviceRunState: 'Run' | 'Sleep' }
	| { kind: 'zoom'; zoom: number; fov: number; fovLabel: string }
	| { kind: 'gimbal'; pitch: number; yaw: number }
	| { kind: 'aiTracking'; locked: boolean }
	| { kind: 'presets'; presets: PresetPosition[] }
	| { kind: 'virtualBackground'; value: number; label: string }
	| { kind: 'autoFraming'; value: number; label: string }
	/** Too short or the wrong types, so it can't be trusted */
	| { kind: 'malformed' }

const Malformed: ParsedReply = { kind: 'malformed' }

// osc.js hands back whatever the device encoded, so narrow before using it
function toNumber(value: OSCValue | undefined): number {
	return typeof value === 'number' ? value : Number(value ?? NaN)
}

function toText(value: OSCValue | undefined): string {
	return value === undefined ? '' : String(value)
}

function parseDeviceInfo(args: OSCValue[], model: ModelId): ParsedReply {
	if (args.length < 2) {
		return Malformed
	}

	const devices = [
		{ connected: args[0] === 1, name: toText(args[1]) },
		{ connected: args[2] === 1, name: toText(args[3]) },
		{ connected: args[4] === 1, name: toText(args[5]) },
		{ connected: args[6] === 1, name: toText(args[7]) },
	]
	const selectedDeviceIndex = toNumber(args[8])

	return {
		kind: 'deviceInfo',
		//if not OBS_CENTER_APP, strip off all but first entry
		devices: findModel(model)?.isCenterApp ? devices : [devices[0]],
		selectedDeviceIndex: Number.isFinite(selectedDeviceIndex) ? selectedDeviceIndex : 0,
		selectedDeviceRunState: args[9] === 1 ? 'Run' : 'Sleep',
	}
}

function parseZoomInfo(args: OSCValue[], model: ModelId): ParsedReply | undefined {
	if (!findModel(model)?.reportsZoom) {
		return undefined // Always [0, -1] on Tail 2 hardware
	}

	const zoom = toNumber(args[0])
	const fov = toNumber(args[1])

	return Number.isFinite(zoom) && Number.isFinite(fov)
		? { kind: 'zoom', zoom, fov, fovLabel: getFovLabel(fov) }
		: Malformed
}

function getFovLabel(value: number): string {
	switch (value) {
		case -1:
			return 'Custom' // The current zoom doesn't match any of the three FOV presets
		case 0:
			return '86°'
		case 1:
			return '78°'
		case 2:
			return '65°'
		default:
			return `Unknown (${value})`
	}
}

// The spec documents [roll, pitch, yaw], but devices send just two values:
// Center App sends [yaw, pitch] and Tail 2 hardware sends [pitch, yaw]
function parseGimbalPosInfo(args: OSCValue[], model: ModelId): ParsedReply {
	let pitch: number
	let yaw: number

	if (args.length >= 3) {
		pitch = toNumber(args[1])
		yaw = toNumber(args[2])
	} else if (findModel(model)?.gimbalReplyOrder === 'pitchYaw') {
		pitch = toNumber(args[0])
		yaw = toNumber(args[1])
	} else {
		pitch = toNumber(args[1])
		yaw = toNumber(args[0])
	}

	return Number.isFinite(pitch) && Number.isFinite(yaw) ? { kind: 'gimbal', pitch, yaw } : Malformed
}

function parseAiTracking(args: OSCValue[]): ParsedReply {
	return args.length >= 1 ? { kind: 'aiTracking', locked: args[0] === 1 } : Malformed
}

// Replies carry three preset slots as [exists, name] pairs. Center App names empty slots
// after its "Add" button, so only trust the name of a saved slot
function parsePresetPositionInfo(args: OSCValue[]): ParsedReply {
	if (args.length < 2) {
		return Malformed
	}

	const presets: PresetPosition[] = []

	for (let i = 0; i < 3; i++) {
		const exists = args[i * 2] === 1
		presets.push({ exists, name: exists ? toText(args[i * 2 + 1]) : '' })
	}

	return { kind: 'presets', presets }
}

function parseVirtualBackground(args: OSCValue[]): ParsedReply {
	const value = toNumber(args[0])
	return Number.isFinite(value)
		? { kind: 'virtualBackground', value, label: getVirtualBackgroundLabel(value) }
		: Malformed
}

function getVirtualBackgroundLabel(value: number): string {
	switch (value) {
		case 0:
			return 'Disabled'
		case 1:
			return 'Blur'
		case 2:
			return 'Green Screen'
		case 3:
			return 'Replacement'
		default:
			return `Unknown (${value})`
	}
}

function parseAutoFraming(args: OSCValue[]): ParsedReply {
	const value = toNumber(args[0])
	return Number.isFinite(value) ? { kind: 'autoFraming', value, label: getAutoFramingLabel(value) } : Malformed
}

function getAutoFramingLabel(value: number): string {
	switch (value) {
		case 0:
			return 'Disabled'
		case 1:
			return 'Single Mode'
		case 2:
			return 'Group Mode'
		default:
			return `Unknown (${value})`
	}
}

// Argument counts per the spec. Some Center App builds prefix these replies with the device
// index and others (and hardware) send them bare, so strip a leading index only when present
const ReplyArgCounts: Partial<Record<string, number>> = {
	'/OBSBOT/WebCam/General/DeviceInfo': 11,
	'/OBSBOT/WebCam/General/ZoomInfo': 2,
	'/OBSBOT/WebCam/General/PresetPositionInfo': 6,
	'/OBSBOT/WebCam/Tiny/AiTrackingInfo': 1,
	'/OBSBOT/WebCam/Tiny/PresetPositionInfo': 6,
	'/OBSBOT/WebCam/Meet/VirtualBackgroundInfo': 1,
	'/OBSBOT/WebCam/Meet/AutoFramingInfo': 1,
	'/OBSBOT/WebCam/Meet/PresetPositionInfo': 6,
}

function stripDeviceIndex(address: string, args: OSCValue[]): OSCValue[] {
	const expected = ReplyArgCounts[address]
	return expected !== undefined && args.length === expected + 1 ? args.slice(1) : args
}

const ReplyParsers: Record<string, (args: OSCValue[], model: ModelId) => ParsedReply | undefined> = {
	'/OBSBOT/WebCam/General/DeviceInfo': parseDeviceInfo,
	'/OBSBOT/WebCam/General/ZoomInfo': parseZoomInfo,
	'/OBSBOT/WebCam/General/GetGimbalPosInfoResp': parseGimbalPosInfo,
	'/OBSBOT/WebCam/Tiny/AiTrackingInfo': parseAiTracking,
	'/OBSBOT/WebCam/General/PresetPositionInfo': parsePresetPositionInfo, // Tail 2, not in its spec
	'/OBSBOT/WebCam/Tiny/PresetPositionInfo': parsePresetPositionInfo,
	'/OBSBOT/WebCam/Meet/PresetPositionInfo': parsePresetPositionInfo,
	'/OBSBOT/WebCam/Meet/VirtualBackgroundInfo': parseVirtualBackground,
	'/OBSBOT/WebCam/Meet/AutoFramingInfo': parseAutoFraming,
}

/** Returns undefined for addresses that carry no state this model can use */
export function parseReply(address: string, args: OSCValue[], model: ModelId): ParsedReply | undefined {
	return Object.hasOwn(ReplyParsers, address)
		? ReplyParsers[address](stripDeviceIndex(address, args), model)
		: undefined
}
