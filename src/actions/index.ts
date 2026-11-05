import type OBSBOTInstance from '../main.js'
import { findModel } from '../models.js'
import { addCenterAppActions } from './centerApp.js'
import { addCenterTailActions } from './centerTail.js'
import { addGimbalActions } from './gimbal.js'
import type { Actions } from './helpers.js'
import { addImageActions } from './image.js'
import { addMeetActions } from './meet.js'
import { addQueryActions } from './queries.js'
import { addTail2Actions } from './tail2.js'
import { addTailAirActions } from './tailAir.js'
import { addTinyActions } from './tiny.js'
import { addZoomActions } from './zoom.js'

export function UpdateActions(self: OBSBOTInstance): void {
	const model = findModel(self.config.model)
	if (!model) {
		self.log('error', `Model ${self.config.model} not found.`)
		return
	}

	const actions: Actions = {}

	addZoomActions(self, actions, model)
	addGimbalActions(self, actions, model)
	addImageActions(self, actions, model)
	addQueryActions(self, actions, model)

	if (model.isCenterApp) {
		addCenterAppActions(self, actions)
	}

	switch (model.family) {
		case 'tail2':
			addTail2Actions(self, actions)
			break
		case 'tailAir':
			addTailAirActions(self, actions)
			break
		case 'tiny':
			addTinyActions(self, actions)
			break
		case 'centerTail':
			addCenterTailActions(self, actions, model)
			break
		case 'meet':
			addMeetActions(self, actions)
			break
	}

	self.setActionDefinitions(actions)
}
