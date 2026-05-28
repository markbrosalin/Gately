import type {
    AgentErrorMessage,
    AgentToClientMessage,
    ClientToAgentMessage,
    DigitalValue,
    HardwareDirection,
} from "./protocol.js";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value);

const isDigitalValue = (value: unknown): value is DigitalValue => value === 0 || value === 1;

const isHardwareDirection = (value: unknown): value is HardwareDirection =>
    value === "hardware-to-circuit" || value === "circuit-to-hardware";

export const parseClientMessage = (raw: string): ClientToAgentMessage | AgentErrorMessage => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return {
            type: "error",
            code: "invalid-json",
            message: "Message must be valid JSON.",
        };
    }

    if (!isObject(parsed) || !isString(parsed.type)) {
        return {
            type: "error",
            code: "invalid-message",
            message: "Message must contain a string type.",
        };
    }

    if (parsed.type === "pin.assign") {
        if (
            isString(parsed.requestId) &&
            isNumber(parsed.pin) &&
            isString(parsed.assignmentId) &&
            isHardwareDirection(parsed.direction)
        ) {
            return {
                type: "pin.assign",
                requestId: parsed.requestId,
                pin: parsed.pin,
                assignmentId: parsed.assignmentId,
                direction: parsed.direction,
                label: isString(parsed.label) ? parsed.label : undefined,
            };
        }
    }

    if (parsed.type === "pin.unassign") {
        if (isString(parsed.requestId) && isNumber(parsed.pin)) {
            return {
                type: "pin.unassign",
                requestId: parsed.requestId,
                pin: parsed.pin,
            };
        }
    }

    if (parsed.type === "pin.write") {
        if (isNumber(parsed.pin) && isDigitalValue(parsed.value)) {
            return {
                type: "pin.write",
                requestId: isString(parsed.requestId) ? parsed.requestId : undefined,
                pin: parsed.pin,
                value: parsed.value,
            };
        }
    }

    if (parsed.type === "pin.reset") {
        if (isString(parsed.requestId) && isNumber(parsed.pin)) {
            return {
                type: "pin.reset",
                requestId: parsed.requestId,
                pin: parsed.pin,
            };
        }
    }

    return {
        type: "error",
        requestId: isString(parsed.requestId) ? parsed.requestId : undefined,
        code: "invalid-message",
        message: `Unsupported or malformed message: ${parsed.type}.`,
    };
};

export const serializeAgentMessage = (message: AgentToClientMessage): string =>
    JSON.stringify(message);
