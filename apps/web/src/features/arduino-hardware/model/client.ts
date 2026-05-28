import type { AgentToClientMessage, ClientToAgentMessage } from "./protocol";

type ArduinoAgentClientHandlers = {
    onOpen: () => void;
    onClose: () => void;
    onMessage: (message: AgentToClientMessage) => void;
    onError: (message: string) => void;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const parseAgentMessage = (raw: string): AgentToClientMessage | undefined => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return;
    }

    if (!isObject(parsed) || typeof parsed.type !== "string") return;
    return parsed as AgentToClientMessage;
};

export const createArduinoAgentClient = (handlers: ArduinoAgentClientHandlers) => {
    let socket: WebSocket | undefined;

    const disconnect = (): void => {
        const current = socket;
        socket = undefined;
        current?.close();
    };

    const connect = (url: string): void => {
        disconnect();

        const nextSocket = new WebSocket(url);
        socket = nextSocket;

        nextSocket.addEventListener("open", handlers.onOpen);
        nextSocket.addEventListener("close", handlers.onClose);
        nextSocket.addEventListener("error", () => {
            handlers.onError("WebSocket connection error.");
        });
        nextSocket.addEventListener("message", (event) => {
            if (typeof event.data !== "string") return;

            const message = parseAgentMessage(event.data);
            if (message) {
                handlers.onMessage(message);
            } else {
                handlers.onError("Received malformed agent message.");
            }
        });
    };

    const send = (message: ClientToAgentMessage): boolean => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return false;
        socket.send(JSON.stringify(message));
        return true;
    };

    const isOpen = (): boolean => socket?.readyState === WebSocket.OPEN;

    return {
        connect,
        disconnect,
        send,
        isOpen,
    };
};
