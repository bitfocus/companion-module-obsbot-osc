// Device state gathered from the OSC reply messages documented in docs/
export interface PresetPosition {
	exists: boolean
	name: string
}

export interface DeviceEntry {
	connected: boolean
	name: string
}

export interface OBSBOTState {
	zoom: number | undefined
	fov: number | undefined
	gimbalPitch: number | undefined
	gimbalYaw: number | undefined
	devices: DeviceEntry[]
	selectedDeviceIndex: number | undefined
	selectedDeviceAwake: boolean | undefined
	aiTrackingLocked: boolean | undefined
	virtualBackground: number | undefined
	autoFraming: number | undefined
	presets: PresetPosition[]
}

export function CreateState(): OBSBOTState {
	return {
		zoom: undefined,
		fov: undefined,
		gimbalPitch: undefined,
		gimbalYaw: undefined,
		devices: [],
		selectedDeviceIndex: undefined,
		selectedDeviceAwake: undefined,
		aiTrackingLocked: undefined,
		virtualBackground: undefined,
		autoFraming: undefined,
		presets: [],
	}
}
