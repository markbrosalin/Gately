import type { ApiUpdateItemInput_Result, ApiUpdateItemOutput_Result } from "@cnbn/engine";
import type { LogicValue } from "@cnbn/schema";
import type { Node } from "@antv/x6";
import {
    getValueClassFromNode,
    logicClassToValue,
    portIdToPinRef,
} from "@gately/shared/infrastructure/ui-engine/lib";
import type { EngineSignalEvent } from "@gately/shared/types";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { createArduinoAgentClient } from "./client";
import type {
    AgentPin,
    AgentToClientMessage,
    BoardStatus,
    DigitalValue,
    HardwareDirection,
} from "./protocol";
import type {
    ArduinoHardwareAssignment,
    ArduinoConnectionStatus,
    ArduinoHardwareController,
    ArduinoHardwareDeps,
    NodeRemovedPayload,
    VirtualPortOption,
} from "./types";

const DEFAULT_AGENT_URL = "ws://localhost:8787";

type NodeData = {
    hash?: string;
};

const logicValueToDigital = (value?: LogicValue): DigitalValue | undefined => {
    if (value === "0") return 0;
    if (value === "1") return 1;
    return undefined;
};

const digitalToLogicValue = (value: DigitalValue): LogicValue => (value === 1 ? "1" : "0");

const createRequestId = (prefix: string): string => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    return `${prefix}:${id}`;
};

const readNodeHash = (node: Node): string => {
    const data = (node.getData?.() ?? {}) as NodeData;
    return data.hash ?? node.id;
};

const createAssignmentId = (
    tabId: string,
    scopeId: string,
    pin: number,
    virtualPort: VirtualPortOption,
): string =>
    [
        "arduino",
        tabId,
        scopeId,
        virtualPort.itemId,
        virtualPort.portId,
        pin,
        createRequestId("assignment"),
    ].join(":");

export const useArduinoHardwareController = (
    deps: ArduinoHardwareDeps,
): ArduinoHardwareController => {
    const [url, setUrl] = createSignal(DEFAULT_AGENT_URL);
    const [connectionStatus, setConnectionStatus] =
        createSignal<ArduinoConnectionStatus>("disconnected");
    const [boardStatus, setBoardStatus] = createSignal<BoardStatus>("unavailable");
    const [boardMessage, setBoardMessage] = createSignal<string | undefined>();
    const [lastError, setLastError] = createSignal<string | undefined>();
    const [pins, setPins] = createSignal<AgentPin[]>([]);
    const [assignments, setAssignments] = createSignal<ArduinoHardwareAssignment[]>([]);
    const [graphVersion, setGraphVersion] = createSignal(0);
    const pendingAssignments = new Map<string, ArduinoHardwareAssignment>();

    const upsertAssignment = (assignment: ArduinoHardwareAssignment): void => {
        setAssignments((items) => [
            ...items.filter(
                (item) =>
                    item.assignmentId !== assignment.assignmentId &&
                    item.hardwarePin !== assignment.hardwarePin,
            ),
            assignment,
        ]);
    };

    const removeAssignmentByPin = (pin: number): void => {
        setAssignments((items) => items.filter((item) => item.hardwarePin !== pin));
    };

    const updateAssignmentValue = (assignmentId: string, value: DigitalValue): void => {
        setAssignments((items) =>
            items.map((item) =>
                item.assignmentId === assignmentId ? { ...item, lastValue: value } : item,
            ),
        );
    };

    const virtualPorts = createMemo<VirtualPortOption[]>(() => {
        graphVersion();
        const graph = deps.uiEngine.debug.graph();
        if (!graph) return [];

        return graph.getNodes().flatMap((node) => {
            const hash = readNodeHash(node);
            return (node.getPorts?.() ?? [])
                .filter((port) => typeof port.id === "string")
                .map((port) => {
                    const portId = port.id as string;
                    const pinRef = portIdToPinRef(portId);

                    return {
                        key: `${node.id}:${portId}`,
                        itemId: node.id,
                        portId,
                        pinSide: pinRef.side,
                        pinIndex: pinRef.index,
                        label: `${hash} ${node.id} ${pinRef.side} ${pinRef.index}`,
                    };
                });
        });
    });

    const sendAssignmentToAgent = (assignment: ArduinoHardwareAssignment): boolean => {
        const requestId = createRequestId("pin.assign");
        pendingAssignments.set(requestId, assignment);
        const isSent = client.send({
            type: "pin.assign",
            requestId,
            pin: assignment.hardwarePin,
            assignmentId: assignment.assignmentId,
            direction: assignment.direction,
            label: assignment.label,
        });

        if (!isSent) {
            pendingAssignments.delete(requestId);
            setLastError("Arduino agent is not connected.");
        }

        return isSent;
    };

    const writeAssignmentValue = (
        assignment: ArduinoHardwareAssignment,
        value: DigitalValue,
    ): void => {
        const isSent = client.send({
            type: "pin.write",
            requestId: createRequestId("pin.write"),
            pin: assignment.hardwarePin,
            value,
        });

        if (isSent) {
            updateAssignmentValue(assignment.assignmentId, value);
        }
    };

    const readCurrentDigitalValue = (
        assignment: ArduinoHardwareAssignment,
    ): DigitalValue | undefined => {
        const graph = deps.uiEngine.debug.graph();
        const cell = graph?.getCellById(assignment.itemId);
        if (!cell?.isNode?.()) return;

        const valueClass = getValueClassFromNode(cell as Node, assignment.portId);
        return logicValueToDigital(logicClassToValue(valueClass));
    };

    const syncAssignmentsToAgent = (): void => {
        assignments().forEach(sendAssignmentToAgent);
    };

    const applyHardwareValueToCircuit = async (
        assignment: ArduinoHardwareAssignment,
        value: DigitalValue,
    ): Promise<void> => {
        updateAssignmentValue(assignment.assignmentId, value);

        if (
            assignment.tabId !== deps.getActiveTabId() ||
            assignment.scopeId !== deps.getActiveScopeId()
        ) {
            return;
        }

        const payload = {
            tabId: assignment.tabId,
            itemId: assignment.itemId,
            pin: assignment.pinIndex,
            value: digitalToLogicValue(value),
        };

        if (assignment.pinSide === "output") {
            const result = (await deps.logicEngine.call(
                "/item/updateOutput",
                payload,
            )) as ApiUpdateItemOutput_Result;
            deps.uiEngine.commands.applySignalEvents(result.outputEvents);
        } else {
            const result = (await deps.logicEngine.call(
                "/item/updateInput",
                payload,
            )) as ApiUpdateItemInput_Result;
            deps.uiEngine.commands.applySignalEvents(result.inputEvents);
        }

        deps.requestSimulationNow();
    };

    const handleAgentMessage = (message: AgentToClientMessage): void => {
        if (message.type === "agent.hello") {
            return;
        }

        if (message.type === "board.status") {
            setBoardStatus(message.status);
            setBoardMessage(message.message);
            return;
        }

        if (message.type === "pins.list") {
            setPins(message.pins);
            return;
        }

        if (message.type === "pin.assigned") {
            const pending = message.requestId
                ? pendingAssignments.get(message.requestId)
                : undefined;
            if (message.requestId) {
                pendingAssignments.delete(message.requestId);
            }
            if (pending) {
                upsertAssignment(pending);

                if (pending.direction === "circuit-to-hardware") {
                    const currentValue = readCurrentDigitalValue(pending);
                    if (currentValue !== undefined) {
                        writeAssignmentValue(pending, currentValue);
                    }
                }
            }
            return;
        }

        if (message.type === "pin.unassigned") {
            removeAssignmentByPin(message.pin);
            return;
        }

        if (message.type === "pin.read.change") {
            const assignment = assignments().find(
                (item) =>
                    item.assignmentId === message.assignmentId ||
                    item.hardwarePin === message.pin,
            );
            if (!assignment) return;

            void applyHardwareValueToCircuit(assignment, message.value);
            return;
        }

        if (message.type === "error") {
            if (message.requestId) {
                pendingAssignments.delete(message.requestId);
            }
            setLastError(message.message);
        }
    };

    const client = createArduinoAgentClient({
        onOpen: () => {
            setConnectionStatus("connected to agent");
            setLastError(undefined);
            syncAssignmentsToAgent();
        },
        onClose: () => {
            setConnectionStatus("disconnected");
            setBoardStatus("unavailable");
        },
        onMessage: handleAgentMessage,
        onError: setLastError,
    });

    const connect = (): void => {
        setConnectionStatus("connecting");
        setLastError(undefined);
        client.connect(url());
    };

    const disconnect = (): void => {
        client.disconnect();
        setConnectionStatus("disconnected");
        setBoardStatus("unavailable");
    };

    const assign = (
        pin: number,
        direction: HardwareDirection,
        virtualPortKey: string,
    ): void => {
        const tabId = deps.getActiveTabId();
        const scopeId = deps.getActiveScopeId();
        const virtualPort = virtualPorts().find((port) => port.key === virtualPortKey);

        if (!client.isOpen()) {
            setLastError("Arduino agent is not connected.");
            return;
        }

        if (!tabId || !scopeId || !virtualPort) {
            setLastError("Select an active workspace port before assigning a pin.");
            return;
        }

        const assignment: ArduinoHardwareAssignment = {
            assignmentId: createAssignmentId(tabId, scopeId, pin, virtualPort),
            tabId,
            scopeId,
            itemId: virtualPort.itemId,
            portId: virtualPort.portId,
            pinSide: virtualPort.pinSide,
            pinIndex: virtualPort.pinIndex,
            hardwarePin: pin,
            direction,
            label: virtualPort.label,
        };

        sendAssignmentToAgent(assignment);
    };

    const unassignPin = (pin: number): void => {
        const requestId = createRequestId("pin.unassign");
        const isSent = client.send({
            type: "pin.unassign",
            requestId,
            pin,
        });

        if (!isSent) {
            removeAssignmentByPin(pin);
        }
    };

    const focusAssignment = (assignmentId: string): void => {
        const assignment = assignments().find((item) => item.assignmentId === assignmentId);
        if (!assignment) return;

        deps.uiEngine.commands.openTab(assignment.tabId);
        deps.uiEngine.commands.openScope(assignment.scopeId, assignment.tabId);

        queueMicrotask(() => {
            const graph = deps.uiEngine.debug.graph();
            const cell = graph?.getCellById(assignment.itemId);
            if (!graph || !cell?.isNode?.()) return;

            graph.resetSelection(cell);
            graph.centerCell(cell);
        });
    };

    const handleSignalEvents = (events: EngineSignalEvent[]): void => {
        const activeTabId = deps.getActiveTabId();
        const activeScopeId = deps.getActiveScopeId();

        for (const event of events) {
            const matchingAssignments = assignments().filter(
                (assignment) =>
                    assignment.direction === "circuit-to-hardware" &&
                    assignment.tabId === activeTabId &&
                    assignment.scopeId === activeScopeId &&
                    assignment.itemId === event.itemId &&
                    assignment.pinSide === event.kind &&
                    assignment.pinIndex === event.pin,
            );

            const value = logicValueToDigital(event.value);
            if (value === undefined) continue;

            matchingAssignments.forEach((assignment) => writeAssignmentValue(assignment, value));
        }
    };

    createEffect(() => {
        const tabIds = new Set(deps.uiEngine.state.tabs().map((tab) => tab.id));
        assignments()
            .filter((assignment) => !tabIds.has(assignment.tabId))
            .forEach((assignment) => unassignPin(assignment.hardwarePin));
    });

    createEffect(() => {
        const graph = deps.uiEngine.debug.graph();
        if (!graph) return;

        const bumpGraphVersion = (): void => setGraphVersion((version) => version + 1);
        const onNodeRemoved = (payload: NodeRemovedPayload): void => {
            bumpGraphVersion();

            const node = payload.node ?? payload.cell;
            if (!node) return;

            assignments()
                .filter((assignment) => assignment.itemId === node.id)
                .forEach((assignment) => unassignPin(assignment.hardwarePin));
        };

        bumpGraphVersion();
        graph.on("node:added", bumpGraphVersion);
        graph.on("node:removed", onNodeRemoved);
        graph.on("node:change:ports", bumpGraphVersion);
        onCleanup(() => {
            graph.off("node:added", bumpGraphVersion);
            graph.off("node:removed", onNodeRemoved);
            graph.off("node:change:ports", bumpGraphVersion);
        });
    });

    onCleanup(disconnect);

    return {
        url,
        setUrl,
        connectionStatus,
        boardStatus,
        boardMessage,
        lastError,
        pins,
        assignments,
        virtualPorts,
        connect,
        disconnect,
        assign,
        unassignPin,
        focusAssignment,
        handleSignalEvents,
        dispose: disconnect,
    };
};
