// types.d.ts
declare module 'osc' {
	const osc: any
	export default osc
}

type OSCArgument = {
	type: string
	value: number | string | boolean
}
