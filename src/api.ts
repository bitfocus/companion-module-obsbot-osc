import { InstanceStatus, OSCMetaArgument } from '@companion-module/base'
import type { OBSBOTInstance } from './main.js'
import osc from 'osc'

export async function InitConnection(self: OBSBOTInstance): Promise<void> {
	const { ip, port, transport, verbose } = self.config

	if (verbose) {
		self.log('debug', `Connecting to OBSBOT at ${ip}:${port} via ${transport.toUpperCase()}`)
	}

	self.updateStatus(InstanceStatus.Connecting)

	// Close existing socket if needed
	if (self.oscPort) {
		try {
			self.oscPort.close()
		} catch (e) {
			self.log('warn', `Failed to close previous OSC port: ${e}`)
		}
	}

	// Create a new OSC port
	if (transport === 'udp') {
		self.oscPort = new osc.UDPPort({
			localAddress: '0.0.0.0',  // listen on all interfaces
			localPort: 57110,         // bind to 57110, matching what OBSBOT expects
		})
	} else {
		self.oscPort = new osc.TCPSocketPort({
			address: ip,
			port: port,
		})
	}

	// Common event handlers
	self.oscPort.on('ready', () => {
		self.log('debug', `OSC Port ready on ${transport.toUpperCase()} (port ${port})`)

		// Send initial handshake command
		self.sendCommand('/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
	})

	self.oscPort.on('error', (err: any) => {
		if (!err || !err.code) {
			self.log('error', `Unknown error: ${JSON.stringify(err)}`)
			return
		}

		const messages: Record<string, string> = {
			EADDRNOTAVAIL: `Address not available: ${ip}`,
			ECONNREFUSED: `Connection refused: ${ip}:${port}`,
			EADDRINUSE:   `Address in use: ${ip}:${port}`,
			ETIMEDOUT:    `Connection timed out: ${ip}:${port}`,
			ECONNRESET:   `Connection reset: ${ip}:${port}`,
			EHOSTUNREACH: `Host unreachable: ${ip}:${port}`,
			ENETUNREACH:  `Network unreachable: ${ip}:${port}`,
		}

		self.log('error', messages[err.code] || `Error: ${err.code}`)
		self.updateStatus(InstanceStatus.ConnectionFailure)
	})

	self.oscPort.on('message', (msg: any) => {
		self.log('debug', `Received: ${msg.address} ${JSON.stringify(msg.args)}`)
		processData(self, msg.address, msg.args)
	})

	self.oscPort.open()
}

function processData(self: OBSBOTInstance, address: string, args: OSCMetaArgument[]): void {
	if (self.config.verbose) {
		self.log('debug', `Processing message: ${address} ${JSON.stringify(args)}`)
	}

	if (address === '/OBSBOT/WebCam/General/ConnectedResp') {
		self.updateStatus(InstanceStatus.Ok)
		self.log('info', 'Connected to OBSBOT device successfully.')

		self.sendCommand('/OBSBOT/WebCam/General/GetDeviceInfo', [{ type: 'i', value: 0 }])
	}
}

export function SendCommand(self: OBSBOTInstance, address: string, args: OSCMetaArgument[]): void {
	if (!self.oscPort) {
		self.log('error', `OSC Port is not open. Cannot send command: ${address}`)
		return
	}

	const { verbose, transport, ip, port, model, device } = self.config

	if (verbose) {
		self.log('debug', `Sending command: ${address} ${JSON.stringify(args)} via ${transport.toUpperCase()} to ${ip}:${port}`)
	}

	// Prepend device ID if needed
	if (model.toString().includes('OBSBOT_CENTER')) {
		const deviceArg: OSCMetaArgument = { type: 'i', value: device }
		args = [deviceArg, ...args]
	}

	const message = {
		address: address,
		args: args,
	}

	if (transport === 'udp') {
		self.oscPort.send(message, ip, port)
	} else {
		self.oscPort.send(message)
	}
}
