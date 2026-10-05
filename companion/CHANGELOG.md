# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
