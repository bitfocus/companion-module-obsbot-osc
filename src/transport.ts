import type { EventEmitter } from 'node:events'
import type { OSCMessage } from 'osc'

export interface OSCTransportEvents {
	ready: []
	close: []
	error: [Error]
	message: [OSCMessage]
	malformed: [Error]
}

export interface OSCOutgoingMessage {
	address: string
	args: OSCArgument[]
}

export interface OSCTransport extends EventEmitter<OSCTransportEvents> {
	open(): void
	close(): void
	send(message: OSCOutgoingMessage): void
}
