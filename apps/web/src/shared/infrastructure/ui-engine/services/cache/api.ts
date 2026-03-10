import type { Graph } from "@antv/x6";
import type { UIEngineContext } from "../../model";
import { createEdgeStateMap } from "./useEdgeStateMap";
import { createPortStateMap } from "./usePortStateMap";
import type { CacheServiceContract } from "./types";

export const useCacheService = (_graph: Graph, _ctx: UIEngineContext): CacheServiceContract => {
    const ports = createPortStateMap();
    const edges = createEdgeStateMap();

    return {
        ports,
        edges,
    };
};

