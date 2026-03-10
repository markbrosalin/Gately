import type { UIEngineHooks } from "../../model/core";
import type { ProtocolHub } from "../../model/core";

type ProtocolHubDeps = {
    name: string;
    hooks?: UIEngineHooks;
};

export const createProtocolHub = <TContribution>({
    name,
    hooks,
}: ProtocolHubDeps): ProtocolHub<TContribution> => {
    const entries = new Map<string, TContribution>();

    hooks?.onLifecycle?.({
        type: "protocol:created",
        name,
    });

    const register = (entryName: string, value: TContribution): (() => void) => {
        entries.set(entryName, value);
        return () => {
            entries.delete(entryName);
        };
    };

    return {
        register,
        values: () => Array.from(entries.values()),
    };
};

