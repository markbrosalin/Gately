import type { Edge, ValidateConnectionArgs } from "@antv/x6";
import { getPortKind } from "../ports";

type NormalizeConnectionArgs = Pick<
    ValidateConnectionArgs,
    "sourceCell" | "targetCell" | "sourcePort" | "targetPort"
> &
    Partial<Pick<ValidateConnectionArgs, "sourceMagnet" | "targetMagnet">>;

/**
 * Normalizes a connection by validating port types and ensuring the correct directionality.
 *
 * If the source port is an input and target is an output (reversed connection),
 * swaps them so the output always connects to the input.
 *
 * @param args - The connection validation arguments containing source/target cells and ports
 * @returns An object with properly oriented inputCell, inputPort, outputCell, and outputPort,
 *          or null if ports are missing, invalid, or incompatible
 */
export function normalizeConnection(args: NormalizeConnectionArgs | Edge) {
    const data: NormalizeConnectionArgs = {
        sourceCell: null,
        targetCell: null,
        sourcePort: null,
        targetPort: null,
        sourceMagnet: null,
        targetMagnet: null,
    };

    if ("isEdge" in args) {
        data.sourceCell = args.getSourceCell();
        data.targetCell = args.getTargetCell();
        data.sourcePort = args.getSourcePortId();
        data.targetPort = args.getTargetPortId();
    } else {
        Object.assign(data, args);
    }

    const sourceKind = getPortKind(data.sourcePort, data.sourceMagnet);
    const targetKind = getPortKind(data.targetPort, data.targetMagnet);

    if (sourceKind === "output" && targetKind === "input") {
        return {
            targetCell: data.targetCell,
            targetPort: data.targetPort,
            sourceCell: data.sourceCell,
            sourcePort: data.sourcePort,
            targetMagnet: data.targetMagnet,
            sourceMagnet: data.sourceMagnet,
        };
    }

    if (sourceKind === "input" && targetKind === "output") {
        return {
            targetCell: data.sourceCell,
            targetPort: data.sourcePort,
            sourceCell: data.targetCell,
            sourcePort: data.targetPort,
            targetMagnet: data.sourceMagnet,
            sourceMagnet: data.targetMagnet,
        };
    }
    return;
}

