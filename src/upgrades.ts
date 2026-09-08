import type {
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionStaticUpgradeScript,
} from '@companion-module/base'
import type { ModuleConfig } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function tiny3Upgrade(
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig>,
	): CompanionStaticUpgradeResult<ModuleConfig> {
		for (const action of props.actions) {
			if (action.actionId === 'OBSBOT_CENTER_TINY_aiMode') {
				if (action.options.camera === undefined) {
					action.options.camera = 'tiny2'
				}
			}
		}
		return {
			updatedConfig: null,
			updatedActions: props.actions,
			updatedFeedbacks: [],
		}
	},

	//Polling did not exist before this, so leave existing connections behaving as they did.
	//New connections pick up the field default instead, as upgrade scripts do not run for them.
	function pollIntervalUpgrade(
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig>,
	): CompanionStaticUpgradeResult<ModuleConfig> {
		let updatedConfig: ModuleConfig | null = null

		if (props.config && props.config.pollinterval === undefined) {
			props.config.pollinterval = 0
			updatedConfig = props.config
		}

		return {
			updatedConfig,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
]
