import { Graph } from "@antv/x6";
import type { ItemBuilderResult } from "@cnbn/engine";
import { makeGraphOptions } from "../../graph-options/graphOptions";
import type { EngineSignalEvent } from "@gately/shared/types";
import { buildGraphServices } from "./services";
import { applyPlugins } from "../../plugins";
import type { UIEngineContext, PinUpdate, UIScopeSnapshot } from "../../model";

export const createGraphRuntime = (container: HTMLDivElement, ctx: UIEngineContext) => {
    const graph = new Graph(makeGraphOptions(container, ctx));
    const services = buildGraphServices(graph, ctx);
    const disposers = applyPlugins(graph, ctx);

    const dispose = () => {
        disposers.reverse().forEach((fn) => {
            try {
                fn();
            } catch (err) {
                ctx.external.hooks?.onError?.({
                    label: "graph plugin",
                    stage: "dispose",
                    error: err,
                });
                console.error(`[UIEngine] plugin dispose failed`, err);
            }
        });

        try {
            graph.dispose();
        } catch (error) {
            ctx.external.hooks?.onError?.({
                label: "component",
                name: "graph-runtime",
                stage: "dispose",
                error,
            });
            throw error;
        }
    };

    return {
        createBuiltNode(result: ItemBuilderResult) {
            return services.nodes.createNode(result);
        },
        exportScopeSnapshot(): UIScopeSnapshot {
            return services.snapshot.exportScopeSnapshot();
        },
        importScopeSnapshot(snapshot?: Partial<UIScopeSnapshot> | null): void {
            services.snapshot.importScopeSnapshot(snapshot);
        },
        applyPinPatch(patch: PinUpdate | PinUpdate[]): void {
            services.signals.applyPinPatch(patch);
        },
        applySignalEvents(events: EngineSignalEvent | EngineSignalEvent[]): void {
            services.signals.applyEvents(events);
        },
        getSelectionCount(): number {
            return graph.getSelectedCellCount?.() ?? 0;
        },
        graph(): Graph {
            return graph;
        },
        dispose,
    };
};

