# Gately Arduino Agent

Local Node.js agent for the Gately Arduino UNO MVP. It connects to Arduino through
Johnny-Five/Firmata and exposes a small WebSocket API for the web app.

## Install Dependencies

Run these commands from the repository root if dependencies are not installed yet:

```bash
pnpm --filter arduino-agent add johnny-five ws dotenv
pnpm --filter arduino-agent add -D tsx @types/node @types/ws @types/johnny-five
```

If the default npm registry is unavailable, use a mirror:

```bash
pnpm --filter arduino-agent add johnny-five ws dotenv --registry=https://registry.npmmirror.com
pnpm --filter arduino-agent add -D tsx @types/node @types/ws @types/johnny-five --registry=https://registry.npmmirror.com
```

## Scope

- Arduino UNO only.
- Digital pins only: `D2`-`D13`.
- D0 and D1 are reserved by default because they are commonly used for Serial/Firmata.
- Mapping between Gately items/ports and Arduino pins stays in the web app.
- The agent only knows physical pins, directions, values, and assignment ids.

## Firmata Setup

Upload StandardFirmata to Arduino UNO before starting the agent:

1. Open Arduino IDE.
2. Select the Arduino UNO board and serial port.
3. Open `File > Examples > Firmata > StandardFirmata`.
4. Upload the sketch.

Optional environment variables:

```bash
ARDUINO_AGENT_PORT=8787
ARDUINO_PORT=COM3
ARDUINO_BOARD_TIMEOUT_MS=15000
```

PowerShell example:

```powershell
$env:ARDUINO_PORT="COM3"
$env:ARDUINO_AGENT_PORT="8787"
pnpm --filter arduino-agent dev
```

Without explicit env variables:

```bash
pnpm --filter arduino-agent dev
```

The agent prints the WebSocket URL, usually:

```text
ws://localhost:8787
```

## Protocol MVP

Directions are named from the integration point of view:

- `hardware-to-circuit`: read a physical Arduino pin and push the value into Gately.
- `circuit-to-hardware`: read a Gately signal and write it to a physical Arduino pin.

Client messages:

- `pin.assign`: reserve a pin for one direction and assignment id.
- `pin.unassign`: release one pin.
- `pin.write`: write `0` or `1` to a `circuit-to-hardware` pin.
- `pin.reset`: reset and release one pin.

Agent messages:

- `agent.hello`: sent after WebSocket connection.
- `board.status`: `connecting`, `ready`, `error`, or `unavailable`.
- `pins.list`: current UNO digital pin list with availability and assignment ids.
- `pin.assigned` / `pin.unassigned`: acknowledgement for pin mapping changes.
- `pin.read.change`: digital value update from Arduino.
- `error`: protocol or board error.
