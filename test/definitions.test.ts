import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { UpdateActions } from '../src/actions/index.js'
import { UpdateFeedbacks } from '../src/feedbacks.js'
import { Models, type ModelId } from '../src/models.js'
import { UpdatePresets } from '../src/presets.js'
import { UpdateVariableDefinitions } from '../src/variables.js'
import { createFakeInstance, type SentMessage } from './helpers/harness.js'

type Options = Record<string, unknown>

/** The default options, then each option in turn moved to every other value it can reasonably take */
function optionVariants(fields: any[]): Options[] {
	const defaults: Options = Object.fromEntries(fields.map((field) => [field.id, field.default]))
	const variants: Options[] = [defaults]

	for (const field of fields) {
		const values: unknown[] = field.type === 'dropdown' ? field.choices.map((c: any) => c.id) : [field.min, field.max]

		for (const value of values) {
			if (value !== field.default) {
				variants.push({ ...defaults, [field.id]: value })
			}
		}
	}

	return variants
}

async function captureActionOutput(model: ModelId): Promise<Record<string, unknown>> {
	const { self, sent, definitions } = createFakeInstance(model)
	UpdateActions(self)

	const output: Record<string, unknown> = {}

	for (const [id, action] of Object.entries(definitions.actions)) {
		const runs: { options: Options; sent: SentMessage[] }[] = []

		for (const options of optionVariants(action.options)) {
			sent.length = 0
			await action.callback({ options })
			runs.push({ options, sent: [...sent] })
		}

		output[id] = runs
	}

	return output
}

// Icons are huge base64 strings, and only whether they changed matters
function hashIcons(value: unknown): unknown {
	return JSON.parse(
		JSON.stringify(value, (key, item: unknown) =>
			key === 'png64' && typeof item === 'string'
				? `sha256:${createHash('sha256').update(item).digest('hex').slice(0, 16)}`
				: item,
		),
	)
}

function captureDefinitions(model: ModelId): unknown {
	const { self, definitions } = createFakeInstance(model)
	UpdateActions(self)
	UpdateFeedbacks(self)
	UpdatePresets(self)

	const variablesFor = (deviceCount: number): unknown => {
		self.STATE.devices = Array.from({ length: deviceCount }, () => ({ connected: true, name: 'Camera' }))
		UpdateVariableDefinitions(self)
		return definitions.variables
	}

	return hashIcons({
		actions: definitions.actions,
		feedbacks: definitions.feedbacks,
		structure: definitions.structure,
		presets: definitions.presets,
		variables: { noDevices: variablesFor(0), oneDevice: variablesFor(1), multipleDevices: variablesFor(4) },
	})
}

// Key order means nothing to Companion, but array order does: it's the order of options and choices
function canonicalJson(value: unknown): string {
	return JSON.stringify(
		value,
		(_key, item: unknown) =>
			item && typeof item === 'object' && !Array.isArray(item)
				? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
				: item,
		'\t',
	)
}

// IDs and values here are stored in users' configs, so an unexpected change breaks their buttons
describe.each(Models.map((model) => model.id))('%s', (model) => {
	it('keeps its definitions', async () => {
		await expect(canonicalJson(captureDefinitions(model))).toMatchFileSnapshot(
			`__snapshots__/definitions/${model}.json`,
		)
	})

	it('keeps what its actions send', async () => {
		await expect(canonicalJson(await captureActionOutput(model))).toMatchFileSnapshot(
			`__snapshots__/output/${model}.json`,
		)
	})
})
