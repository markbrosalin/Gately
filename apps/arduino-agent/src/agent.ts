/* eslint-disable no-console -- The local hardware agent is a CLI process. */
import five from "johnny-five";
import type { WebSocket } from "ws";
import type {
    AgentErrorMessage,
    AgentToClientMessage,
    BoardStatus,
    ClientToAgentMessage,
    DigitalValue,
} from "./protocol.js";
import {
    canAssignPin,
    createPinsList,
    type PinAssignment,
    type PinAssignments,
    toDigitalValue,
} from "./pins.js";
import { serializeAgentMessage } from "./messages.js";

type JohnnyBoard = import("johnny-five").Board;
type BoardOption = import("johnny-five").BoardOption;

type ArduinoAgentOptions = {
    arduinoPort?: string;
    boardTimeoutMs: number;
};

const READ_POLL_MS = 20;

export class ArduinoAgent {
    private boardStatus: BoardStatus = "connecting";
    private boardMessage: string | undefined;
    private board: JohnnyBoard | undefined;
    private readonly assignments: PinAssignments = new Map();
    private readonly sockets = new Set<WebSocket>();
    private readonly readSubscriptions = new Set<number>();

    public constructor(private readonly options: ArduinoAgentOptions) {}

    public start(): void {
        const boardOptions: BoardOption = {
            repl: false,
            timeout: this.options.boardTimeoutMs,
        };

        if (this.options.arduinoPort) {
            boardOptions.port = this.options.arduinoPort;
        }

        this.board = new five.Board(boardOptions);
        this.board.on("ready", () => {
            this.boardStatus = "ready";
            this.boardMessage = this.board?.port ? `Board ready on ${this.board.port}` : "Board ready";
            this.board?.samplingInterval(READ_POLL_MS);
            this.applyAllAssignments();
            this.broadcastStatus();
            this.broadcastPins();
        });
        this.board.on("error", (error) => this.handleBoardError(error));
        this.board.on("fail", (event) => this.handleBoardError(new Error(event.message)));
        this.board.on("close", () => {
            this.boardStatus = "unavailable";
            this.boardMessage = "Board connection closed.";
            this.broadcastStatus();
        });
    }

    public attach(socket: WebSocket): void {
        this.sockets.add(socket);
        this.send(socket, {
            type: "agent.hello",
            protocolVersion: 1,
            agentName: "gately-arduino-agent",
            board: "arduino-uno",
        });
        this.sendStatus(socket);
        this.sendPins(socket);

        socket.on("close", () => {
            this.sockets.delete(socket);
        });
    }

    public handleMessage(socket: WebSocket, message: ClientToAgentMessage | AgentErrorMessage): void {
        if (message.type === "error") {
            this.send(socket, message);
            return;
        }

        if (message.type === "pin.assign") {
            this.assignPin(socket, {
                assignmentId: message.assignmentId,
                direction: message.direction,
                label: message.label,
                pin: message.pin,
                requestId: message.requestId,
            });
            return;
        }

        if (message.type === "pin.unassign") {
            this.unassignPin(socket, message.pin, message.requestId);
            return;
        }

        if (message.type === "pin.reset") {
            this.unassignPin(socket, message.pin, message.requestId);
            return;
        }

        if (message.type === "pin.write") {
            this.writePin(socket, message.pin, message.value, message.requestId);
        }
    }

    private assignPin(
        socket: WebSocket,
        data: PinAssignment & { pin: number; requestId: string },
    ): void {
        if (!canAssignPin(data.pin)) {
            this.sendError(socket, {
                requestId: data.requestId,
                code: "pin-unavailable",
                message: `D${data.pin} is not available for MVP digital I/O.`,
            });
            return;
        }

        const existing = this.assignments.get(data.pin);
        if (existing && existing.assignmentId !== data.assignmentId) {
            this.sendError(socket, {
                requestId: data.requestId,
                code: "pin-busy",
                message: `D${data.pin} is already assigned.`,
            });
            return;
        }

        this.assignments.set(data.pin, {
            assignmentId: data.assignmentId,
            direction: data.direction,
            label: data.label,
            value: existing?.value,
        });

        this.applyPinAssignment(data.pin);
        this.broadcast({
            type: "pin.assigned",
            requestId: data.requestId,
            pin: data.pin,
            assignmentId: data.assignmentId,
            direction: data.direction,
        });
        this.broadcastPins();
    }

    private unassignPin(socket: WebSocket, pin: number, requestId: string): void {
        if (!this.assignments.has(pin)) {
            this.send(socket, {
                type: "pin.unassigned",
                requestId,
                pin,
            });
            return;
        }

        this.resetPhysicalPin(pin);
        this.assignments.delete(pin);
        this.broadcast({
            type: "pin.unassigned",
            requestId,
            pin,
        });
        this.broadcastPins();
    }

    private writePin(
        socket: WebSocket,
        pin: number,
        value: DigitalValue,
        requestId?: string,
    ): void {
        const assignment = this.assignments.get(pin);
        if (!assignment || assignment.direction !== "circuit-to-hardware") {
            this.sendError(socket, {
                requestId,
                code: "pin-not-output",
                message: `D${pin} is not assigned for circuit-to-hardware writes.`,
            });
            return;
        }

        if (!this.board?.isReady) {
            this.sendError(socket, {
                requestId,
                code: "board-not-ready",
                message: "Arduino board is not ready.",
            });
            return;
        }

        this.board.pinMode(pin, five.Pin.OUTPUT);
        this.board.digitalWrite(pin, value);
        assignment.value = value;
        this.broadcastPins();
    }

    private applyAllAssignments(): void {
        for (const pin of this.assignments.keys()) {
            this.applyPinAssignment(pin);
        }
    }

    private applyPinAssignment(pin: number): void {
        const assignment = this.assignments.get(pin);
        if (!assignment || !this.board?.isReady) return;

        if (assignment.direction === "hardware-to-circuit") {
            this.board.pinMode(pin, five.Pin.INPUT);
            this.subscribeToRead(pin);
            return;
        }

        this.board.pinMode(pin, five.Pin.OUTPUT);
        const initialValue = assignment.value ?? 0;
        assignment.value = initialValue;
        this.board.digitalWrite(pin, initialValue);
    }

    private subscribeToRead(pin: number): void {
        if (!this.board?.isReady || this.readSubscriptions.has(pin)) return;

        this.readSubscriptions.add(pin);
        this.board.digitalRead(pin, (rawValue) => {
            const value = toDigitalValue(rawValue);
            const assignment = this.assignments.get(pin);
            if (!assignment || assignment.direction !== "hardware-to-circuit" || value === undefined) {
                return;
            }

            if (assignment.value === value) return;

            assignment.value = value;
            this.broadcast({
                type: "pin.read.change",
                pin,
                assignmentId: assignment.assignmentId,
                value,
            });
            this.broadcastPins();
        });
    }

    private resetPhysicalPin(pin: number): void {
        if (!this.board?.isReady) return;

        try {
            this.board.digitalWrite(pin, 0);
            this.board.pinMode(pin, five.Pin.INPUT);
        } catch (error) {
            console.warn(`[arduino-agent] Failed to reset D${pin}`, error);
        }
    }

    private handleBoardError(error: Error): void {
        this.boardStatus = "error";
        this.boardMessage = error.message;
        console.error("[arduino-agent] Board error:", error);
        this.broadcastStatus();
    }

    private sendStatus(socket: WebSocket): void {
        this.send(socket, {
            type: "board.status",
            status: this.boardStatus,
            message: this.boardMessage,
        });
    }

    private broadcastStatus(): void {
        this.broadcast({
            type: "board.status",
            status: this.boardStatus,
            message: this.boardMessage,
        });
    }

    private sendPins(socket: WebSocket): void {
        this.send(socket, {
            type: "pins.list",
            pins: createPinsList(this.assignments),
        });
    }

    private broadcastPins(): void {
        this.broadcast({
            type: "pins.list",
            pins: createPinsList(this.assignments),
        });
    }

    private sendError(
        socket: WebSocket,
        error: Omit<AgentErrorMessage, "type">,
    ): void {
        this.send(socket, {
            type: "error",
            ...error,
        });
    }

    private send(socket: WebSocket, message: AgentToClientMessage): void {
        if (socket.readyState !== socket.OPEN) return;
        socket.send(serializeAgentMessage(message));
    }

    private broadcast(message: AgentToClientMessage): void {
        for (const socket of this.sockets) {
            this.send(socket, message);
        }
    }
}
