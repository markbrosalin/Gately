# Gately Arduino Agent

Local Node.js agent for the Gately Arduino UNO MVP.

## Install Dependencies

Run these commands from the repository root after this package exists:

```bash
pnpm --filter arduino-agent add johnny-five ws dotenv
pnpm --filter arduino-agent add -D tsx @types/node @types/ws @types/johnny-five
```

## Planned Scope

- Arduino UNO only.
- Digital pins only.
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
```
