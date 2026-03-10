import type { NodeProperties } from "@antv/x6";
import type { Hash, HierarchyPath, KindKey } from "@cnbn/schema";
import type { CatalogItemKind, CatalogItemRef } from "../catalog";

export type UIEngineNodeData = {
    kind: KindKey | CatalogItemKind;
    hash?: Hash;
    path?: HierarchyPath;
    ref?: CatalogItemRef;
    refKey?: string;
};

export type UIEngineNodeProps = Omit<NodeProperties, "data"> & {
    data: UIEngineNodeData;
};

