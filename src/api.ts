import { InstanceStatus, OSCMetaArgument } from '@companion-module/base'
import type { OBSBOTInstance } from './main.js'
import osc from 'osc'

export async function InitConnection(self: OBSBOTInstance): Promise<void> {
	// Initialize Socket.IO connection
	const ip = self.config.ip
	const port = self.config.port

	if (self.config.verbose) {
		self.log('debug', `Connecting to OBSBOT at ${ip}:${port}`)
	}

	self.updateStatus(InstanceStatus.Connecting)

	// Close out the OSC socket if it already exists
	if (self.oscPort) {
		self.oscPort.close()
	}

	// Create the OSC socket based on the selected transport protocol
	if (self.config.transport === 'udp') {
		self.log('debug', 'Using UDP transport.')
		self.oscPort = new osc.UDPPort({
			address: ip,
			port: port,
		})
	} else {
		self.log('debug', 'Using TCP transport.')
		self.oscPort = new osc.TCPSocketPort({
			address: ip,
			port: port,
		})
	}

	self.oscPort.on('ready', function() {
		self.log('debug', `Listening on Port ${port}`)
		//self.updateStatus(InstanceStatus.Ok)

		// Connect to the OBSBOT device by sending /OBSBOT/WebCam/General/Connected
		self.sendCommand('/OBSBOT/WebCam/General/Connected', [{ type: 'i', value: 0 }])
	})

	self.oscPort.on('error', function (err: any) {
		if (err && err.code && err.code === 'EADDRNOTAVAIL') {
			self.log('error', `Error: Address not available. Please check the IP address: ${self.config.ip}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'ECONNREFUSED') {
			self.log('error', `Error: Connection refused. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'EADDRINUSE') {
			self.log('error', `Error: Address in use. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'ETIMEDOUT') {
			self.log('error', `Error: Connection timed out. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'ECONNRESET') {
			self.log('error', `Error: Connection reset. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'EHOSTUNREACH') {
			self.log('error', `Error: Host unreachable. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else if (err && err.code && err.code === 'ENETUNREACH') {
			self.log('error', `Error: Network unreachable. Please check the IP address and port: ${self.config.ip}:${self.config.port}`)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			return
		}
		else {
			self.log('error', JSON.stringify(err));
		}		
	})

	self.oscPort.on('message', function (msg: any) {
		self.log('debug', `Message: ${msg.address} ${msg.args}`)
		processData(self, msg.address, msg.args)
	})

	self.oscPort.open()	
}

function processData(self: OBSBOTInstance, address: string, args: OSCMetaArgument[]): void {
	// Handle incoming messages from the OBSBOT device
	if (self.config.verbose) {
		self.log('debug', `Received message from OBSBOT: ${address} ${args}`)
	}

	if (address === '/OBSBOT/WebCam/General/ConnectedResp') {
		self.updateStatus(InstanceStatus.Ok)
		self.log('info', 'Connected to OBSBOT device successfully.')

		// get device info
		self.sendCommand('/OBSBOT/WebCam/General/GetDeviceInfo', [{ type: 'i', value: 0 }])
		return
	}
}

export function SendCommand(self: OBSBOTInstance, address: string, args: OSCMetaArgument[]): void {
	if (self.config.verbose) {
		self.log('debug', `Sending command to OBSBOT: ${address} ${args} via ${self.config.transport} to ${self.config.ip}:${self.config.port}`)
	}

	//if the model is the Center App, we need to add the Device choice to the args
	if (self.config.model.toString().indexOf('OBSBOT_CENTER') !== -1) {
		// Add the device ID to the arguments at the beginning
		const deviceId = self.config.device
		const deviceArg: OSCMetaArgument = {
			type: 'i',
			value: deviceId,
		}
		args = [deviceArg, ...args] as OSCMetaArgument[]
	}

	// Send the command to the OBSBOT device
	if (self.config.transport === 'udp') {
		self.oscPort.send({
			address: address,
			args: args,
		}, self.config.ip, self.config.port)
	}
	else {
		self.oscPort.send({
			address: address,
			args: args,
		})
	}
}
