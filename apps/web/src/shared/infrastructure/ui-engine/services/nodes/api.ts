import type { Graph, Node } from "@antv/x6";
import type { UIEngineContext, UIEngineNodeData, UIEngineNodeProps } from "../../model";
import { buildNodeProps } from "./lib/propsBuilder";

export type NodeService = ReturnType<typeof useNodeService>;

export const useNodeService = (graph: Graph, _ctx: UIEngineContext) => {
    type BuildNodeInput = Parameters<typeof buildNodeProps>[0];
    type BuildNodeOptions = Parameters<typeof buildNodeProps>[2];

    const isBuildNodeInput = (value: unknown): value is BuildNodeInput => {
        return (
            typeof value === "object" &&
            value !== null &&
            "builtItem" in (value as Record<string, unknown>)
        );
    };

    function createNode(props: UIEngineNodeProps): Node;
    function createNode(result: BuildNodeInput, options?: BuildNodeOptions): Node;
    function createNode(arg0: UIEngineNodeProps | BuildNodeInput, arg1?: BuildNodeOptions): Node {
        const props = isBuildNodeInput(arg0)
            ? buildNodeProps(
                  arg0,
                  {
                      getVisualBinding: (hash) => _ctx.getService("node-visual").getPreset(hash),
                  },
                  arg1,
              )
            : (arg0 as UIEngineNodeProps);

        return graph.addNode(props);
    }

    const removeNode = (nodeId: string): void => {
        graph.removeNode(nodeId);
    };

    const getNode = (nodeId: string): Node | undefined => {
        const cell = graph.getCellById(nodeId);
        if (!cell || !cell.isNode?.()) return;
        return cell as Node;
    };

    const updateNodeData = (nodeId: string, patch: Partial<UIEngineNodeData>): void => {
        const node = getNode(nodeId);
        if (!node) return;
        const data = (node.getData() ?? {}) as UIEngineNodeData;
        Object.assign(data, patch);
        node.setData(data);
    };

    const getNodeHash = (node: Node): string | undefined => {
        const data = node.getData<Partial<UIEngineNodeData>>() ?? {};
        const hash = data.hash;
        return typeof hash === "string" ? hash : undefined;
    };

    return { createNode, removeNode, getNode, updateNodeData, getNodeHash };
};

