import { describe, expect, it, vi } from "vitest";
import { createSnapshotHub } from "./index";

describe("createSnapshotHub", () => {
    it("registers writers/readers, emits protocol lifecycle, and merges snapshot parts", () => {
        const onLifecycle = vi.fn();
        const importScopeSnapshot = vi.fn();
        const hub = createSnapshotHub({
            onLifecycle,
        });

        hub.register("graph-runtime", {
            exportScopeSnapshot: () => ({
                contentJson: '{"cells":[1]}',
                viewport: { zoom: 2, tx: 3, ty: 4 },
            }),
            importScopeSnapshot,
        });
        hub.register("simulation", {
            exportScopeSnapshot: () => ({
                extensions: {
                    simulation: {
                        mode: "step",
                    },
                },
            }),
        });

        expect(hub.exportScopeSnapshot()).toEqual({
            contentJson: '{"cells":[1]}',
            viewport: { zoom: 2, tx: 3, ty: 4 },
            extensions: {
                simulation: {
                    mode: "step",
                },
            },
        });

        hub.importScopeSnapshot({
            contentJson: '{"cells":[9]}',
        });

        expect(importScopeSnapshot).toHaveBeenCalledWith({
            contentJson: '{"cells":[9]}',
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(1, {
            type: "protocol:created",
            name: "snapshot",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(2, {
            type: "protocol:writer-registered",
            name: "snapshot",
            writer: "graph-runtime",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(3, {
            type: "protocol:reader-registered",
            name: "snapshot",
            reader: "graph-runtime",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(4, {
            type: "protocol:writer-registered",
            name: "snapshot",
            writer: "simulation",
        });
    });
});

