import type { GraphManual } from "@antv/x6";

export type GraphRendererConnectingService = {
    buildConfig: () => NonNullable<GraphManual["connecting"]>;
};
