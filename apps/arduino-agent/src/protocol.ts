export type HardwareDirection = "hardware-to-circuit" | "circuit-to-hardware";

export type BoardStatus = "unavailable" | "connecting" | "ready" | "error";

export type PinMode = "reserved" | "free" | "assigned";

export type DigitalValue = 0 | 1;

export type AgentPin = {
    pin: number;
    label: string;
    mode: PinMode;
    value?: DigitalValue;
    assignmentId?: string;
    direction?: HardwareDirection;
};

export type AgentHelloMessage = {
    type: "agent.hello";
    protocolVersion: 1;
    agentName: "gately-arduino-agent";
    board: "arduino-uno";
};

export type BoardStatusMessage = {
    type: "board.status";
    status: BoardStatus;
    message?: string;
};

export type PinsListMessage = {
    type: "pins.list";
    pins: AgentPin[];
};

export type PinAssignMessage = {
    type: "pin.assign";
    requestId: string;
    pin: number;
    assignmentId: string;
    direction: HardwareDirection;
    label?: string;
};

export type PinAssignedMessage = {
    type: "pin.assigned";
    requestId?: string;
    pin: number;
    assignmentId: string;
    direction: HardwareDirection;
};

export type PinUnassignMessage = {
    type: "pin.unassign";
    requestId: string;
    pin: number;
};

export type PinUnassignedMessage = {
    type: "pin.unassigned";
    requestId?: string;
    pin: number;
};

export type PinWriteMessage = {
    type: "pin.write";
    requestId?: string;
    pin: number;
    value: DigitalValue;
};

export type PinReadChangeMessage = {
    type: "pin.read.change";
    pin: number;
    assignmentId?: string;
    value: DigitalValue;
};

export type PinResetMessage = {
    type: "pin.reset";
    requestId: string;
    pin: number;
};

export type AgentErrorMessage = {
    type: "error";
    requestId?: string;
    code: string;
    message: string;
};

export type ClientToAgentMessage =
    | PinAssignMessage
    | PinUnassignMessage
    | PinWriteMessage
    | PinResetMessage;

export type AgentToClientMessage =
    | AgentHelloMessage
    | BoardStatusMessage
    | PinsListMessage
    | PinAssignedMessage
    | PinUnassignedMessage
    | PinReadChangeMessage
    | AgentErrorMessage;
