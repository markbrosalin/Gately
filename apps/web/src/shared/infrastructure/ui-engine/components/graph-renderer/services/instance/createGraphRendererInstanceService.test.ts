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
    buildConfig: () => ({ allowBlank: true, allowPort: true }) as never,
});

describe("createGraphRendererInstanceService", () => {
    afterEach(() => {
        graphInstances.length = 0;
        vi.clearAllMocks();
    });

    it("mounts and unmounts a graph instance", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());
        const container = {} as HTMLDivElement;

        const graph = service.mount({
            container,
        });

        expect(service.container()).toBe(container);
        expect(service.graph()).toBe(graph);

        service.unmount();

        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);
        expect(service.container()).toBeUndefined();
        expect(service.graph()).toBeUndefined();
    });

    it("disposes the previous graph before mounting a new one", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());

        service.mount({
            container: {} as HTMLDivElement,
        });

        service.mount({
            container: {} as HTMLDivElement,
        });

        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);
    });

    it("notifies graph lifecycle listeners on mount and unmount", () => {
        const service = createGraphRendererInstanceService(createContext(), createConnecting());
        const onGraphMount = vi.fn();
        const onGraphUnmount = vi.fn();
        const unsubscribeMount = service.onGraphMount(onGraphMount);
        const unsubscribeUnmount = service.onGraphUnmount(onGraphUnmount);
        const container = {} as HTMLDivElement;

        const graph = service.mount({
            container,
        });

        expect(onGraphMount).toHaveBeenCalledWith({
            graph,
            container,
        });

        service.unmount();

        expect(onGraphUnmount).toHaveBeenCalledWith({
            graph,
            container,
        });

        unsubscribeMount();
        unsubscribeUnmount();
    });
});
