import type { CacheServiceContract } from "../../../services/cache";
import type { EdgeService } from "../../../services/edges";
import type { VisualServiceContract } from "../../../services/node-visual";
import type { NodeService } from "../../../services/nodes";
import type { PortService } from "../../../services/ports";
import type { SignalService } from "../../../services/signals";
import type { SnapshotService } from "../../../services/snapshot";

export type GraphRuntimeServiceName =
    | "cache"
    | "edges"
    | "nodes"
    | "ports"
    | "node-visual"
    | "signals"
    | "snapshot";

export type GraphRuntimeServices = {
    cache: CacheServiceContract;
    edges: EdgeService;
    nodes: NodeService;
    ports: PortService;
    "node-visual": VisualServiceContract;
    signals: SignalService;
    snapshot: SnapshotService;
};

