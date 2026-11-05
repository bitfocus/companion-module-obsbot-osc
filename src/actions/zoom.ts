import type OBSBOTInstance from '../main.js'
import type { Model } from '../models.js'
import { intArgs, numberField, toInt, valueAction, type Actions } from './helpers.js'

const percentField = (id: string, label: string) => numberField(id, label, { default: 0, min: 0, max: 100 })

export function addZoomActions(self: OBSBOTInstance, actions: Actions, model: Model): void {
	actions.setZoom = valueAction(self, {
		name: 'Zoom | Set Zoom Level',
		description: 'Set the zoom level of the camera',
		address: '/OBSBOT/WebCam/General/SetZoom',
		field: percentField('zoom', 'Zoom Level'),
		logName: 'zoom',
	})

	actions.setZoomSpeed = {
		name: 'Zoom | Set Zoom Speed',
		description: 'Set the zoom speed of the camera',
		options: [
			percentField('zoomValue', 'Target Zoom Value'),
			numberField('zoomSpeed', 'Target Zoom Speed', { default: 0, min: 0, max: model.zoomSpeedMax }),
		],
		callback: ({ options }) => {
			self.log('info', `Setting zoom speed to ${options.zoomSpeed}.`)
			self.sendCommand(
				'/OBSBOT/WebCam/General/SetZoomSpeed',
				intArgs(toInt(options.zoomValue), toInt(options.zoomSpeed)),
			)
		},
	}

	actions.setZoomMax = valueAction(self, {
		name: 'Zoom | Set Zoom Max',
		description: 'Set the maximum zoom level of the camera',
		address: '/OBSBOT/WebCam/General/SetZoomMax',
		field: percentField('zoomLevel', 'Zoom Level'),
		logName: 'zoom max',
	})

	actions.setZoomMin = valueAction(self, {
		name: 'Zoom | Set Zoom Min',
		description: 'Set the minimum zoom level of the camera',
		address: '/OBSBOT/WebCam/General/SetZoomMin',
		field: percentField('zoomLevel', 'Zoom Level'),
		logName: 'zoom min',
	})
}
