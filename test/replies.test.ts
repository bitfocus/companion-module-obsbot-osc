import { describe, expect, it, vi } from 'vitest'
import { HandleReply } from '../src/api.js'
import { parseReply } from '../src/replies.js'
import { createFakeInstance } from './helpers/harness.js'

const ZOOM = '/OBSBOT/WebCam/General/ZoomInfo'
const GIMBAL = '/OBSBOT/WebCam/General/GetGimbalPosInfoResp'
const DEVICE_INFO = '/OBSBOT/WebCam/General/DeviceInfo'
const PRESETS = '/OBSBOT/WebCam/Tiny/PresetPositionInfo'
const deviceInfoArgs = [1, 'One', 1, 'Two', 0, '', 0, '', 1, 1, 0]

describe('parseReply', () => {
	it('parses zoom info', () => {
		expect(parseReply(ZOOM, [40, 1], 'OBSBOT_CENTER_TINY')).toEqual({ kind: 'zoom', zoom: 40, fov: 1, fovLabel: '78°' })
		expect(parseReply(ZOOM, [40, -1], 'OBSBOT_CENTER_TINY')).toMatchObject({ fovLabel: 'Custom' })
	})

	it('strips a leading device index only when one is present', () => {
		expect(parseReply(ZOOM, [2, 40, 1], 'OBSBOT_CENTER_TINY')).toMatchObject({ zoom: 40, fov: 1 })
		expect(parseReply(DEVICE_INFO, [0, ...deviceInfoArgs], 'OBSBOT_CENTER')).toMatchObject({ selectedDeviceIndex: 1 })
	})

	it('ignores Tail 2 zoom reports, which are always wrong', () => {
		expect(parseReply(ZOOM, [0, -1], 'OBSBOT_TAIL_2')).toBeUndefined()
	})

	it('reads gimbal values in the order each device sends them', () => {
		expect(parseReply(GIMBAL, [10, 20], 'OBSBOT_TAIL_2')).toEqual({ kind: 'gimbal', pitch: 10, yaw: 20 })
		expect(parseReply(GIMBAL, [10, 20], 'OBSBOT_CENTER_TINY')).toEqual({ kind: 'gimbal', pitch: 20, yaw: 10 })
		expect(parseReply(GIMBAL, [0, 10, 20], 'OBSBOT_TAIL_AIR')).toEqual({ kind: 'gimbal', pitch: 10, yaw: 20 })
	})

	it('only keeps the first device on hardware', () => {
		expect(parseReply(DEVICE_INFO, deviceInfoArgs, 'OBSBOT_TAIL_AIR')).toMatchObject({
			devices: [{ connected: true, name: 'One' }],
			selectedDeviceRunState: 'Run',
		})
		expect(parseReply(DEVICE_INFO, deviceInfoArgs, 'OBSBOT_CENTER')).toMatchObject({
			devices: [{ name: 'One' }, { name: 'Two' }, { connected: false }, { connected: false }],
		})
	})

	it('does not trust the name of an empty preset slot', () => {
		expect(parseReply(PRESETS, [1, 'Stage', 0, 'Add', 0, 'Add'], 'OBSBOT_CENTER_TINY')).toEqual({
			kind: 'presets',
			presets: [
				{ exists: true, name: 'Stage' },
				{ exists: false, name: '' },
				{ exists: false, name: '' },
			],
		})
	})

	it.each([
		['zoom with no values', ZOOM, []],
		['zoom with no field of view', ZOOM, [40]],
		['zoom that is not a number', ZOOM, ['high', 1]],
		['gimbal with one value', GIMBAL, [10]],
		['gimbal with no values', GIMBAL, []],
		['empty device info', DEVICE_INFO, []],
		['empty presets', PRESETS, []],
		['empty virtual background', '/OBSBOT/WebCam/Meet/VirtualBackgroundInfo', []],
		['empty auto framing', '/OBSBOT/WebCam/Meet/AutoFramingInfo', []],
		['empty AI tracking', '/OBSBOT/WebCam/Tiny/AiTrackingInfo', []],
	] as [string, string, OSCValue[]][])('treats %s as malformed', (_name, address, args) => {
		expect(parseReply(address, args, 'OBSBOT_CENTER_TINY')).toEqual({ kind: 'malformed' })
	})

	it('tolerates device info without a selected device', () => {
		expect(parseReply(DEVICE_INFO, [1, 'One'], 'OBSBOT_TAIL_AIR')).toMatchObject({ selectedDeviceIndex: 0 })
	})

	it('returns nothing for unknown addresses', () => {
		expect(parseReply('/something/else', [1], 'OBSBOT_CENTER')).toBeUndefined()
		expect(parseReply('constructor', [1], 'OBSBOT_CENTER')).toBeUndefined()
	})
})

describe('HandleReply', () => {
	it('never puts NaN into state or variables from a short reply', () => {
		const { self, variableValues } = createFakeInstance('OBSBOT_CENTER_TINY')

		HandleReply(self, ZOOM, [40])
		HandleReply(self, GIMBAL, [10])

		expect(self.STATE.zoom).toBeUndefined()
		expect(self.STATE.gimbalPitch).toBeUndefined()
		expect(variableValues).toEqual({})
	})

	it('updates state, variables and feedbacks', () => {
		const { self, variableValues } = createFakeInstance('OBSBOT_CENTER_TINY')
		const checkFeedbacks = vi.spyOn(self, 'checkFeedbacks')

		HandleReply(self, ZOOM, [40, 2])

		expect(self.STATE).toMatchObject({ zoom: 40, fov: 2 })
		expect(variableValues).toEqual({ zoom: 40, fov: '65°' })
		expect(checkFeedbacks).toHaveBeenCalledWith('zoomLevel', 'fieldOfView')
	})

	it('only re-sends variable definitions when the number of devices changes', () => {
		const { self } = createFakeInstance('OBSBOT_CENTER')
		const updateVariableDefinitions = vi.spyOn(self, 'updateVariableDefinitions')

		HandleReply(self, DEVICE_INFO, deviceInfoArgs)
		HandleReply(self, DEVICE_INFO, deviceInfoArgs)
		HandleReply(self, DEVICE_INFO, deviceInfoArgs)

		expect(updateVariableDefinitions).toHaveBeenCalledTimes(1)
	})

	it('reports the selected device with a 1-based number', () => {
		const { self, variableValues } = createFakeInstance('OBSBOT_CENTER')

		HandleReply(self, DEVICE_INFO, deviceInfoArgs)

		expect(variableValues).toMatchObject({
			selected_index: 1,
			selected_device: 2,
			selected_state: 'Run',
			selected_name: 'Two',
			selected_connected: 'Connected',
		})
	})
})
