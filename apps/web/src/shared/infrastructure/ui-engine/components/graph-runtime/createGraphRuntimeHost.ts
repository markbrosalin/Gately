import { createEffect, createSignal } from "solid-js";
import type {
    UIEngineContext,
    UIEngineErrorEvent,
    UIEngineLifecycleEvent,
} from "../../model";
import { createGraphRuntime } from "./createGraphRuntime";

type GraphRuntimeHostDeps = {
    ctx: UIEngineContext;
    emitLifecycle: (event: UIEngineLifecycleEvent) => void;
    reportError: (event: UIEngineErrorEvent) => void;
    onAttached?: () => void;
};

export const createGraphRuntimeHost = ({
    ctx,
    emitLifecycle,
    reportError,
    onAttached,
}: GraphRuntimeHostDeps) => {
    const [container, setContainer] = createSignal<HTMLDivElement | undefined>(undefined);
    const [runtime, setRuntime] = createSignal<ReturnType<typeof createGraphRuntime> | null>(null);
    let attachedContainer: HTMLDivElement | undefined;
    let disposeSnapshotContribution: (() => void) | undefined;

    const requireRuntime = () => {
        const current = runtime();
        if (!current) {
            const error = new Error("[UIEngine] graph runtime is not attached");
            reportError({
                label: "component",
                name: "graph-runtime",
                stage: "runtime",
                error,
            });
            throw error;
        }

        return current;
    };

    createEffect(() => {
        const nextContainer = container();
        if (attachedContainer === nextContainer) return;

        const current = runtime();
        if (current) {
            disposeSnapshotContribution?.();
            disposeSnapshotContribution = undefined;
            current.dispose();
            setRuntime(null);
        }

        attachedContainer = nextContainer;
        if (!nextContainer) return;

        let nextRuntime: ReturnType<typeof createGraphRuntime>;
        try {
            nextRuntime = createGraphRuntime(nextContainer, ctx);
        } catch (error) {
            reportError({
                label: "component",
                name: "graph-runtime",
                stage: "create",
                error,
            });
            throw error;
        }

        setRuntime(nextRuntime);
        disposeSnapshotContribution = ctx.getSharedService("snapshotHub").register("graph-runtime", {
            exportScopeSnapshot: nextRuntime.exportScopeSnapshot,
            importScopeSnapshot: nextRuntime.importScopeSnapshot,
        });
        emitLifecycle({
            type: "component:created",
            name: "graph-runtime",
        });
        onAttached?.();
    });

    const dispose = () => {
        const current = runtime();
        if (!current) return;

        disposeSnapshotContribution?.();
        disposeSnapshotContribution = undefined;
        current.dispose();
        attachedContainer = undefined;
        setRuntime(null);
    };

    return {
        mount: {
            setContainer,
        },
        runtime,
        requireRuntime,
        selectionCount: () => runtime()?.getSelectionCount() ?? 0,
        graph: () => runtime()?.graph(),
        dispose,
    };
};

