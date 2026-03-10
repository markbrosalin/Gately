import type { UIScopeSnapshot } from "../../model";

export type SnapshotProtocolWriter = {
    exportScopeSnapshot?: () => Partial<UIScopeSnapshot> | null | undefined;
};

export type SnapshotProtocolReader = {
    importScopeSnapshot?: (snapshot?: Partial<UIScopeSnapshot> | null) => void;
};

export type SnapshotProtocolBinding = SnapshotProtocolWriter & SnapshotProtocolReader;

export type SnapshotHubServiceContract = {
    register: (entryName: string, value: SnapshotProtocolBinding) => () => void;
    exportScopeSnapshot: () => Partial<UIScopeSnapshot> | undefined;
    importScopeSnapshot: (snapshot?: Partial<UIScopeSnapshot> | null) => void;
};

