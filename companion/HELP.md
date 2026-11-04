# OBSBOT OSC

This module will communicate with OBSBOT products over OSC. It requires Companion 5.0 or newer.

The OBSBOT OSC standard protocol is based on the touchOSC protocol. It can be applied to the OBSBOT Center App (software), OBSBOT Tail 2 (hardware), and OBSBOT Tail Air (hardware). The OSC application on OBSBOT Center is compatible with the OBSBOT Tiny series (Tiny, Tiny 4K, Tiny 2, Tiny 2 Lite, Tiny 3, Tiny 3 Lite, Tiny SE), OBSBOT Meet series (Meet, Meet 4K, Meet 2, Meet SE), and OBSBOT Tail series (Tail Air, Tail 2). However, when using the OSC protocol with OBSBOT Center, the software must be running and have the OSC server enabled.

Additionally, the OSC can be independently applied to OBSBOT Tail 2, and OBSBOT Tail Air.

Please file any issues you have with the connection on the [Github repo here](https://github.com/bitfocus/companion-module-obsbot-osc/issues)

## Getting started

There are two ways to connect to your OBSBOT camera:

1. Connecting directly via IP to the Tail 2 or Tail Air
2. Connecting via OSC to the OBSBOT Center app (Tail 2, Tail Air, Tiny, Tiny 4K, Tiny 2, Tiny 2 Lite, Tiny 3, Tiny 3 Lite, Tiny SE, Meet, Meet 4K, Meet SE)

### Direct connection

In order to connect directly to the Tail 2 or Tail Air, find the IP of the device in the OBSBOT Center app and enter it into the Device IP Address field in the configuration for the OBSBOT connection. You can leave the ports at the default.

### OBSBOT Center Connection

If you wish to connect to the Tiny series or Meet series of OBSBOT cameras you will need to run the OBSBOT Center app on your computer and enable the OSC server. After enabling the OSC server, update the port and IP in the OBSBOT connection config to match the Receive Port set in the OBSBOT Center app

## Configuration

- **Device IP Address** and **Port**: where to reach the camera or the OBSBOT Center app. Hostnames, including mDNS `.local` names, can be used.
- **Transport Protocol**: UDP or TCP.
- **Listen Port**: the port replies arrive on when using UDP.
- **Poll Interval**: how often to ask the device for its state, in seconds. Set to 0 to disable polling, which stops variables and feedbacks from updating unless you use a **Query** action.
- **Device Model**: decides which actions, presets, feedbacks and variables are available.
- **Device ID**: which camera to control through the Center app. Not used for hardware devices.
- **Enable Verbose Logging**: logs every message sent and received, for troubleshooting.

## Connection status

The module checks on the device every few seconds, even with polling disabled, and shows a connection failure if it stops responding for about 15 seconds. It recovers by itself when the device comes back. TCP connections retry after 1 second, slowing to every 30 seconds while the device stays away.

## Actions and presets

Actions and presets are grouped by name in the Companion interface, and only those that apply to the selected **Device Model** are shown:

- **Zoom**, **Gimbal**, **Image** and **Other**: available on every model, though auto focus depends on the model.
- **Query**: ask the device for its current state on demand.
- **Center App**: device selection, sleep and wake, view, PC recording and snapshots, when connected through the Center app.
- **Model specific**: AI modes, tracking, recording, snapshots and preset positions for Tail 2, Tail Air, the Center app's Tail series and Tiny series, and virtual background and auto framing for the Meet series.

Number fields can also be set from a variable or expression using the expression toggle on the field. Values outside the allowed range are clamped to it.

## Feedbacks

- Zoom Level and Field of View (not on Tail 2 hardware, which does not report them)
- Gimbal Position In Range
- Device Connected
- Selected Device Awake
- AI Tracking Locked (Tiny series)
- Virtual Background Mode and Auto Framing Mode (Meet series)
- Preset Position Saved (Tiny series, Meet series and Tail 2 hardware)

## Variables

- Device name and connection state, plus the selected device and its run state when the Center app reports several devices
- Zoom Level and Field of View (not on Tail 2 hardware)
- Gimbal Pitch and Gimbal Yaw
- AI Tracking Lock State (Tiny series)
- Virtual Background Mode and Auto Framing Mode (Meet series)
- Preset position names and whether they are saved, and the saved count (Tiny series, Meet series and Tail 2 hardware)
