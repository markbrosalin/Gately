import { afterEach, describe, expect, it, vi } from "vitest";
import type { GraphRendererConnectingService } from "../connecting";
import { createGraphRendererInstanceService } from "./createGraphRendererInstanceService";
import type { GraphRendererServiceContext } from "../types";

const graphInstances: Array<{
    options: unknown;
    dispose: ReturnType<typeof vi.fn>;
    getSelectedCellCount: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("@antv/x6", () => ({
    routerPresets: {
        orth: vi.fn(),
    },
    Graph: vi.fn().mockImplementation((options: unknown) => {
        const instance = {
            options,
            dispose: vi.fn(),
            getSelectedCellCount: vi.fn(() => 0),
        };
        graphInstances.push(instance);
        return instance;
    }),
}));

const createContext = (): GraphRendererServiceContext =>
    ({
        external: {},
        getService: vi.fn(),
        getSharedService: vi.fn(),
    }) as unknown as GraphRendererServiceContext;

const createConnecting = (): GraphRendererConnectingService => ({
    buildConfig: () => ({ allowBlank: true, allowPort: true } as never),
});

describe("createGraphRendererInstanceService", () => {
    afterEach(() => {
        graphInstances.length = 0;
        vi.clearAllMocks();
    });

    it("opens and closes a graph instance", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());
        const container = {} as HTMLDivElement;

        const graph = service.open({
            workspaceId: "workspace-1",
            container,
        });

        expect(service.activeWorkspaceId()).toBe("workspace-1");
        expect(service.container()).toBe(container);
        expect(service.graph()).toBe(graph);

        service.close();

        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);
        expect(service.activeWorkspaceId()).toBeUndefined();
        expect(service.container()).toBeUndefined();
        expect(service.graph()).toBeUndefined();
    });

    it("disposes the previous graph before opening a new one", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());

        service.open({
            workspaceId: "workspace-1",
            container: {} as HTMLDivElement,
        });

        service.open({
            workspaceId: "workspace-2",
            container: {} as HTMLDivElement,
        });

        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);
        expect(service.activeWorkspaceId()).toBe("workspace-2");
    });

    it("runs registered disposers before graph disposal", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());
        const disposePlugin = vi.fn();

        service.open({
            workspaceId: "workspace-1",
            container: {} as HTMLDivElement,
        });
        service.addDisposer(disposePlugin);

        service.close();

        expect(disposePlugin).toHaveBeenCalledTimes(1);
        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);
    });
});

