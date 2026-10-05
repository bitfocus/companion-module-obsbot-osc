// types.d.ts
declare module 'osc' {
	export interface OSCMessage {
		address: string
		args: OSCValue[]
	}

	export interface OSCBundle {
		packets: OSCMessage[]
	}

	const osc: {
		readPacket(buffer: Buffer, options: Record<string, unknown>): OSCMessage | OSCBundle
		writePacket(message: { address: string; args: OSCArgument[] }): Uint8Array
	}

	export default osc
}

/** Either transport the module can be talking over */
type OSCSocket = import('@companion-module/base').SharedUdpSocket | import('./tcp.js').OSCTCPPort

/** OSC type tags used by the OBSBOT protocol, per the definitions in docs/ */
type OSCArgTag = 'i' | 'f' | 's' | 'b'

/** Values carried by an OSC argument, as delivered by osc.js on receive */
type OSCValue = number | string | boolean

type OSCArgument = {
	type: OSCArgTag
	value: OSCValue
}

/**
 * Every OSC address defined by the OBSBOT specs in docs/, covering both the
 * commands the module sends and the replies it receives.
 */
type OSCAddress =
	| '/OBSBOT/Camera/Tail/SetAiMode'
	| '/OBSBOT/Camera/Tail/SetFocusMode'
	| '/OBSBOT/Camera/Tail/SetPanAxisLock'
	| '/OBSBOT/Camera/Tail/SetPanTrackingSpeed'
	| '/OBSBOT/Camera/Tail/SetRecording'
	| '/OBSBOT/Camera/Tail/SetTiltAxisLock'
	| '/OBSBOT/Camera/Tail/SetTiltTrackingSpeed'
	| '/OBSBOT/Camera/Tail/SetTrackingSpeed'
	| '/OBSBOT/Camera/Tail/Snapshot'
	| '/OBSBOT/Camera/Tail/TriggerPreset'
	| '/OBSBOT/Camera/Tail2/SetAiEnable'
	| '/OBSBOT/Camera/Tail2/SetAiMode'
	| '/OBSBOT/Camera/Tail2/SetAutoZoom'
	| '/OBSBOT/Camera/Tail2/SetOnlyMe'
	| '/OBSBOT/Camera/Tail2/SetRecording'
	| '/OBSBOT/Camera/Tail2/SetTrackingSpeed'
	| '/OBSBOT/Camera/Tail2/Snapshot'
	| '/OBSBOT/Camera/Tail2/TriggerPreset'
	| '/OBSBOT/Camera/TailAir/SetAiMode'
	| '/OBSBOT/Camera/TailAir/SetRecording'
	| '/OBSBOT/Camera/TailAir/SetTrackingSpeed'
	| '/OBSBOT/Camera/TailAir/Snapshot'
	| '/OBSBOT/Camera/TailAir/TriggerPreset'
	| '/OBSBOT/WebCam/General/Connected'
	| '/OBSBOT/WebCam/General/ConnectedResp'
	| '/OBSBOT/WebCam/General/DeviceInfo'
	| '/OBSBOT/WebCam/General/Disconnected'
	| '/OBSBOT/WebCam/General/GetDeviceInfo'
	| '/OBSBOT/WebCam/General/GetGimbalPosInfo'
	| '/OBSBOT/WebCam/General/GetGimbalPosInfoResp'
	| '/OBSBOT/WebCam/General/GetZoomInfo'
	| '/OBSBOT/WebCam/General/PCSnapshot'
	| '/OBSBOT/WebCam/General/PresetPositionInfo'
	| '/OBSBOT/WebCam/General/ResetGimbal'
	| '/OBSBOT/WebCam/General/SelectDevice'
	| '/OBSBOT/WebCam/General/SetAutoExposure'
	| '/OBSBOT/WebCam/General/SetAutoFocus'
	| '/OBSBOT/WebCam/General/SetAutoWhiteBalance'
	| '/OBSBOT/WebCam/General/SetColorTemperature'
	| '/OBSBOT/WebCam/General/SetExposureCompensate'
	| '/OBSBOT/WebCam/General/SetGimMotorDegree'
	| '/OBSBOT/WebCam/General/SetGimMotorDegreeEx'
	| '/OBSBOT/WebCam/General/SetGimbalDown'
	| '/OBSBOT/WebCam/General/SetGimbalLeft'
	| '/OBSBOT/WebCam/General/SetGimbalRight'
	| '/OBSBOT/WebCam/General/SetGimbalUp'
	| '/OBSBOT/WebCam/General/SetHighfpsRecording'
	| '/OBSBOT/WebCam/General/SetISO'
	| '/OBSBOT/WebCam/General/SetManualFocus'
	| '/OBSBOT/WebCam/General/SetMirror'
	| '/OBSBOT/WebCam/General/SetPCRecording'
	| '/OBSBOT/WebCam/General/SetRBGain'
	| '/OBSBOT/WebCam/General/SetShutterSpeed'
	| '/OBSBOT/WebCam/General/SetView'
	| '/OBSBOT/WebCam/General/SetWhiteBalanceShift'
	| '/OBSBOT/WebCam/General/SetZoom'
	| '/OBSBOT/WebCam/General/SetZoomMax'
	| '/OBSBOT/WebCam/General/SetZoomMin'
	| '/OBSBOT/WebCam/General/SetZoomSpeed'
	| '/OBSBOT/WebCam/General/WakeSleep'
	| '/OBSBOT/WebCam/General/ZoomInfo'
	| '/OBSBOT/WebCam/Meet/AutoFramingInfo'
	| '/OBSBOT/WebCam/Meet/GetAutoFramingInfo'
	| '/OBSBOT/WebCam/Meet/GetPresetPositionInfo'
	| '/OBSBOT/WebCam/Meet/GetVirtualBackgroundInfo'
	| '/OBSBOT/WebCam/Meet/PresetPositionInfo'
	| '/OBSBOT/WebCam/Meet/SetAutoFraming'
	| '/OBSBOT/WebCam/Meet/SetStandardMode'
	| '/OBSBOT/WebCam/Meet/SetVirtualBackground'
	| '/OBSBOT/WebCam/Meet/VirtualBackgroundInfo'
	| '/OBSBOT/WebCam/Tiny/AiTrackingInfo'
	| '/OBSBOT/WebCam/Tiny/GetAiTrackingInfo'
	| '/OBSBOT/WebCam/Tiny/GetPresetPositionInfo'
	| '/OBSBOT/WebCam/Tiny/PresetPositionInfo'
	| '/OBSBOT/WebCam/Tiny/SetAiMode'
	| '/OBSBOT/WebCam/Tiny/SetTrackingMode'
	| '/OBSBOT/WebCam/Tiny/SetTrackingSpeed'
	| '/OBSBOT/WebCam/Tiny/ToggleAILock'
	| '/OBSBOT/WebCam/Tiny/TriggerPreset'
