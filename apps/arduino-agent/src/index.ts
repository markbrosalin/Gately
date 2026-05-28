/* eslint-disable no-console -- The local hardware agent is a CLI process. */
import "dotenv/config";
import { WebSocketServer, type RawData } from "ws";
import { ArduinoAgent } from "./agent.js";
import { parseClientMessage } from "./messages.js";

const DEFAULT_WS_PORT = 8787;
const DEFAULT_BOARD_TIMEOUT_MS = 15_000;

const readPort = (): number => {
    const value = Number.parseInt(process.env.ARDUINO_AGENT_PORT ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_WS_PORT;
};

const readBoardTimeout = (): number => {
    const value = Number.parseInt(process.env.ARDUINO_BOARD_TIMEOUT_MS ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_BOARD_TIMEOUT_MS;
};

const decodeMessage = (raw: RawData): string => {
    if (typeof raw === "string") return raw;
    if (Buffer.isBuffer(raw)) return raw.toString("utf8");
    if (Array.isArray(raw)) return Buffer.concat(raw).toString("utf8");
    return Buffer.from(raw).toString("utf8");
};

const port = readPort();
const agent = new ArduinoAgent({
    arduinoPort: process.env.ARDUINO_PORT,
    boardTimeoutMs: readBoardTimeout(),
});
const server = new WebSocketServer({ port });

server.on("connection", (socket) => {
    agent.attach(socket);
    socket.on("message", (raw) => {
        agent.handleMessage(socket, parseClientMessage(decodeMessage(raw)));
    });
});

server.on("listening", () => {
    console.log(`[arduino-agent] WebSocket server is listening at ws://localhost:${port}`);
    console.log("[arduino-agent] Waiting for Arduino UNO with StandardFirmata...");
});

server.on("error", (error) => {
    console.error("[arduino-agent] WebSocket server error:", error);
});

agent.start();
