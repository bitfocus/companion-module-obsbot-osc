# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Variables and expressions can be used in action and feedback fields. Number values outside a field's range are clamped to it.

### Changed

- Requires Companion 5.0 or newer. The module now uses API 2.1 and the Node 26 runtime.
- Actions and options that only work on some Tiny and Tail models now say so in their names.
- The module now checks that the device is responding every few seconds, including when polling is disabled.
- Reconnection attempts back off from 1 second to 30 seconds, and a repeated failure is only logged once.

### Fixed

- **Image | Set Color Temperature** now defaults to 5000 instead of 0, which was outside its allowed range.
- A UDP socket error no longer leaves the connection dead until it is reconfigured.
- A device that stops responding is now reported as failed with polling disabled, instead of staying at "Connecting".
- A TCP connection that goes silent without closing now reconnects, and a connection attempt that gets no answer now times out.
- Changing the configuration or removing the connection during a slow hostname lookup no longer leaves an extra socket open.
- An error while handling a reply over TCP no longer takes down the module.
- Replies that are too short are ignored, rather than putting `NaN` into variables and feedbacks.
- A missing address or an invalid port now shows as a configuration problem.

## [1.2.0] - 2026-10-05

### Added

- State polling, with a new **Poll Interval** connection setting (default 5 seconds, 0 disables it). Existing connections are upgraded with polling disabled so they keep their previous behavior.
- Variables for device name and connection state, selected device and run state (Center App), zoom level, field of view, gimbal pan and tilt, AI tracking lock (Tiny), virtual background and auto framing (Meet), and saved preset positions.
- Feedbacks: Zoom Level, Field of View, Gimbal Position In Range, Device Connected, Selected Device Awake, AI Tracking Locked (Tiny), Virtual Background and Auto Framing (Meet), and Preset Position Saved.
- Preset position variables and the Preset Position Saved feedback for Tail 2 hardware.
- Hostnames, including mDNS `.local` names, can be used as the device address
- Connection now reports "No response" when a device stops answering

### Changed

- Zoom speed now goes up to 11 on the Center App, matching its OSC spec. Tail 2 hardware stays at 10.
- Auto Focus actions and presets are only offered on models that support them.
- Field of View reads "Custom" when the current zoom doesn't match one of the three FOV presets.

### Removed

- The Selected Device Type variable (`selected_type`). Devices report type numbers that don't match the OSC spec. Use `selected_name` instead.
- The Gimbal Roll variable (`gimbal_roll`) and the Roll option of the Gimbal Position In Range feedback. No device reports roll over OSC, and existing Roll feedbacks keep evaluating as false..

## [1.1.0] - 2026-01-28

### Added

- Support for Tiny 3 and Tiny 3 Lite, with their actions and AI modes.
- Tail 2 action to turn AI tracking on and off.

### Changed

- Button icons replaced with ones provided by OBSBOT.
- Updated dependencies.

## [1.0.3] - 2025-06-15

### Changed

- Version bump only.

## [1.0.2] - 2025-06-15

### Added

- Getting started section in the help file.

## [1.0.1] - 2025-06-02

### Removed

- Mention of the unsupported OBSBOT Talent.

## [1.0.0] - 2025-05-08

### Added

- Initial module release.

[1.2.0]: https://github.com/bitfocus/companion-module-obsbot-osc/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/bitfocus/companion-module-obsbot-osc/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/bitfocus/companion-module-obsbot-osc/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/bitfocus/companion-module-obsbot-osc/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/bitfocus/companion-module-obsbot-osc/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bitfocus/companion-module-obsbot-osc/releases/tag/v1.0.0
