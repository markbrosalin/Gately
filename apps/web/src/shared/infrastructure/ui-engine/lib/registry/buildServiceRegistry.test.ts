import { describe, expect, it, vi } from "vitest";
import { buildServiceRegistry } from "./buildServiceRegistry";
import type { ServiceDefinition, ServiceGetter } from "../../model";

type TestServiceName = "alpha" | "beta" | "gamma" | "late";
type TestServices = {
    alpha: { id: "alpha" };
    beta: { id: "beta"; alphaId: "alpha" };
    gamma: { id: "gamma" };
    late: { id: "late" };
};

describe("buildServiceRegistry", () => {
    it("builds services in dependency order and returns a typed getter", () => {
        const created: string[] = [];
        let getService!: ServiceGetter<TestServiceName, TestServices>;

        const definitions: {
            [K in TestServiceName]: ServiceDefinition<TestServiceName, TestServices[K]>;
        } = {
            alpha: {
                create: () => {
                    created.push("alpha");
                    return { id: "alpha" };
                },
            },
            beta: {
                create: () => {
                    created.push("beta");
                    return { id: "beta", alphaId: getService("alpha").id };
                },
                createDeps: ["alpha"],
            },
            gamma: {
                create: () => {
                    created.push("gamma");
                    return { id: "gamma" };
                },
                runtimeDeps: ["beta"],
            },
            late: {
                create: () => {
                    created.push("late");
                    return { id: "late" };
                },
            },
        };

        const registry = buildServiceRegistry(definitions, {
            onGetterCreated: (getter) => {
                getService = getter;
            },
        });

        expect(created).toEqual(["alpha", "beta", "gamma", "late"]);
        expect(registry.services.beta).toEqual({
            id: "beta",
            alphaId: "alpha",
        });
        expect(registry.getService("gamma")).toBe(registry.services.gamma);
    });

    it("fails fast when getter is used before a service is initialized", () => {
        let getService!: ServiceGetter<"alpha" | "late", Pick<TestServices, "alpha" | "late">>;

        const definitions: {
            alpha: ServiceDefinition<"alpha" | "late", TestServices["alpha"]>;
            late: ServiceDefinition<"alpha" | "late", TestServices["late"]>;
        } = {
            alpha: {
                create: () => {
                    getService("late");
                    return { id: "alpha" };
                },
            },
            late: {
                create: () => ({ id: "late" }),
            },
        };

        expect(() =>
            buildServiceRegistry(definitions, {
                label: "workspace service",
                onGetterCreated: (getter) => {
                    getService = getter;
                },
            }),
        ).toThrow('[UIEngine] workspace service "late" is not initialized');
    });

    it("emits lifecycle events when services are created", () => {
        const events: Array<{ type: "service:created"; label: string; name: TestServiceName }> = [];

        const definitions: {
            [K in TestServiceName]: ServiceDefinition<TestServiceName, TestServices[K]>;
        } = {
            alpha: {
                create: () => ({ id: "alpha" }),
            },
            beta: {
                create: () => ({ id: "beta", alphaId: "alpha" }),
                createDeps: ["alpha"],
            },
            gamma: {
                create: () => ({ id: "gamma" }),
            },
            late: {
                create: () => ({ id: "late" }),
            },
        };

        buildServiceRegistry(definitions, {
            label: "test service",
            onLifecycle: (event) => {
                events.push(event);
            },
        });

        expect(events).toEqual([
            { type: "service:created", label: "test service", name: "alpha" },
            { type: "service:created", label: "test service", name: "beta" },
            { type: "service:created", label: "test service", name: "gamma" },
            { type: "service:created", label: "test service", name: "late" },
        ]);
    });

    it("reports creation errors through the error hook", () => {
        const error = new Error("boom");
        const onError = vi.fn();

        expect(() =>
            buildServiceRegistry(
                {
                    alpha: {
                        create: () => {
                            throw error;
                        },
                    },
                },
                {
                    label: "test service",
                    onError,
                },
            ),
        ).toThrow(error);

        expect(onError).toHaveBeenCalledWith({
            label: "test service",
            stage: "create",
            name: "alpha",
            error,
        });
    });
});

