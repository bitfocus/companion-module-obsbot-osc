import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const config = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...config,
	{
		files: ['test/**/*.ts', 'vitest.config.ts'],
		rules: {
			'n/no-unpublished-import': 'off',
		},
	},
]
