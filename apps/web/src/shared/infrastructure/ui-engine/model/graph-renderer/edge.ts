import type { Node } from "@antv/x6";

export type EdgeRouterMode = "manhattan" | "metro";

export type EdgeEndpoint = {
    node: Node;
    pin: string;
    portId: string;
};

export type EdgeData = {
    from: EdgeEndpoint;
    to?: EdgeEndpoint;
};

