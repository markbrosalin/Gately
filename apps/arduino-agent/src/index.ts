const DEFAULT_WS_PORT = 8787;

const port = Number.parseInt(process.env.ARDUINO_AGENT_PORT ?? "", 10) || DEFAULT_WS_PORT;

console.log("[arduino-agent] Scaffold is ready.");
console.log("[arduino-agent] Install dependencies before running the real agent.");
console.log(`[arduino-agent] Planned WebSocket URL: ws://localhost:${port}`);
