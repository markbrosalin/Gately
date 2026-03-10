import { routerPresets, Connecting } from "@antv/x6";
import type { EdgeRouterMode } from "@gately/shared/infrastructure/ui-engine/model";
import {
    mkEdge,
    isPortMagnet,
    isValidConnectionEndpoints,
} from "@gately/shared/infrastructure/ui-engine/lib";
import { pickLogicValueClass } from "../../lib/logic-values";
import { setValueClassToEdge } from "../../lib/logic-values/set-value";

export const createConnectingConfig = (
    routerMode: EdgeRouterMode = "manhattan",
): Partial<Connecting> => ({
    allowBlank: true,
    allowNode: false,
    allowEdge: false,
    allowPort: true,
    allowLoop: true,
    router: {
        args: {
            padding: 2,
            perpendicular: true,
            step: 2,
            maxDirectionChange: 90,
            startDirections: ["right", "left", "top", "bottom"],
            endDirections: ["right", "left", "top", "bottom"],
            fallbackRouter: routerPresets.orth,
        },
        name: routerMode,
    },
    connector: {
        name: "jumpover",
        args: { size: 6, type: "gap", radius: 4 },
    },
    targetConnectionPoint: { name: "boundary", args: { offset: -8 } },
    connectionPoint: { name: "boundary", args: { offset: -8 } },
    snap: { anchor: "center", radius: 16 },
    highlight: true,

    createEdge() {
        const edge = mkEdge();
        return edge;
    },

    validateConnection(args) {
        if (!isPortMagnet(args.sourceMagnet) || !isPortMagnet(args.targetMagnet)) return false;
        if (!args.edge || !args.sourceMagnet) return false;

        const valueClass = pickLogicValueClass(args.sourceMagnet.classList.value);
        setValueClassToEdge({ edge: args.edge, valueClass });

        return isValidConnectionEndpoints(this, args);
    },

    validateEdge({ edge }) {
        const [sourceCell, targetCell] = [edge.getSourceCell(), edge.getTargetCell()];
        if (!sourceCell || !targetCell) return false;

        const [sourcePort, targetPort] = [edge.getSourcePortId(), edge.getTargetPortId()];
        if (!sourcePort || !targetPort) return false;

        return isValidConnectionEndpoints(this, {
            sourceCell,
            sourcePort,
            targetCell,
            targetPort,
            edgeId: edge.id,
        });
    },
});

