import { createProtocolHub } from "../../lib/protocols";
import { type UIEngineHooks, type UIScopeSnapshot } from "../../model";
import { mergeScopeSnapshot } from "./mergeScopeSnapshot";
import type { SnapshotHubServiceContract, SnapshotProtocolBinding } from "./types";

export const createSnapshotHub = (hooks?: UIEngineHooks): SnapshotHubServiceContract => {
    const protocol = createProtocolHub<SnapshotProtocolBinding>({
        name: "snapshot",
        hooks,
    });

    const register: SnapshotHubServiceContract["register"] = (entryName, value) => {
        const dispose = protocol.register(entryName, value);

        if (value.exportScopeSnapshot) {
            hooks?.onLifecycle?.({
                type: "protocol:writer-registered",
                name: "snapshot",
                writer: entryName,
            });
        }

        if (value.importScopeSnapshot) {
            hooks?.onLifecycle?.({
                type: "protocol:reader-registered",
                name: "snapshot",
                reader: entryName,
            });
        }

        return dispose;
    };

    const exportScopeSnapshot = (): Partial<UIScopeSnapshot> | undefined => {
        const bindings = protocol.values();
        if (!bindings.length) return;

        return bindings.reduce<Partial<UIScopeSnapshot>>((snapshot, binding) => {
            return mergeScopeSnapshot(snapshot, binding.exportScopeSnapshot?.());
        }, {});
    };

    const importScopeSnapshot = (snapshot?: Partial<UIScopeSnapshot> | null): void => {
        protocol.values().forEach((binding) => {
            binding.importScopeSnapshot?.(snapshot);
        });
    };

    return {
        register,
        exportScopeSnapshot,
        importScopeSnapshot,
    };
};

