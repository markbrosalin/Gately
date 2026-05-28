import type { Node } from "@antv/x6";
import type { CinabonoClient } from "@cnbn/engine-worker";
import type { EngineSignalEvent } from "@gately/shared/types";
import type { UIEnginePublicApi } from "@gately/shared/infrastructure/ui-engine";
import type { Accessor } from "solid-js";
import type { AgentPin, BoardStatus, DigitalValue, HardwareDirection } from "./protocol";

export type ArduinoConnectionStatus = "disconnected" | "connecting" | "connected to agent";

export type VirtualPortOption = {
    key: string;
    itemId: string;
    portId: string;
    pinSide: EngineSignalEvent["kind"];
    pinIndex: string;
    label: string;
};

export type ArduinoHardwareAssignment = {
    assignmentId: string;
    tabId: string;
    scopeId: string;
    itemId: string;
    portId: string;
    pinSide: EngineSignalEvent["kind"];
    pinIndex: string;
    hardwarePin: number;
    direction: HardwareDirection;
    label: string;
    lastValue?: DigitalValue;
};

export type ArduinoHardwareController = {
    url: Accessor<string>;
    setUrl: (url: string) => void;
    connectionStatus: Accessor<ArduinoConnectionStatus>;
    boardStatus: Accessor<BoardStatus>;
    boardMessage: Accessor<string | undefined>;
    lastError: Accessor<string | undefined>;
    pins: Accessor<AgentPin[]>;
    assignments: Accessor<ArduinoHardwareAssignment[]>;
    virtualPorts: Accessor<VirtualPortOption[]>;
    connect: () => void;
    disconnect: () => void;
    assign: (pin: number, direction: HardwareDirection, virtualPortKey: string) => void;
    unassignPin: (pin: number) => void;
    focusAssignment: (assignmentId: string) => void;
    handleSignalEvents: (events: EngineSignalEvent[]) => void;
    dispose: () => void;
};

export type ArduinoHardwareDeps = {
    uiEngine: Pick<UIEnginePublicApi, "commands" | "debug" | "state">;
    logicEngine: CinabonoClient;
    getActiveTabId: () => string | undefined;
    getActiveScopeId: () => string | undefined;
    requestSimulationNow: () => void;
};

export type NodeRemovedPayload = {
    node?: Node;
    cell?: Node;
};
