import type { Node } from "@antv/x6";
import type { LogicValue } from "@cnbn/schema";
import type { WorkspaceUIEngine } from "../types";

type ApplyOptimisticOutputArgs = {
    uiEngine: WorkspaceUIEngine;
    node: Node;
    pin: string;
    value: LogicValue;
};

export const applyOptimisticOutput = (args: ApplyOptimisticOutputArgs): void => {
    const { uiEngine, node, pin, value } = args;
    uiEngine.applyPinPatch?.([
        {
            elementId: node.id,
            pinRef: {
                side: "output",
                index: pin,
            },
            value,
        },
    ]);
};

