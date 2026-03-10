import { describe, expect, it, vi } from "vitest";
import {
    applyDependencyDefinitions,
    type OrderedDependencyDefinition,
} from "./applyDependencyDefinitions";

type TestDefinition = OrderedDependencyDefinition<"selection" | "edge-tools", "cache" | "ports"> & {
    marker: string;
};

describe("applyDependencyDefinitions", () => {
    it("applies definitions in dependency order", () => {
        const applied: string[] = [];
        const definitions: TestDefinition[] = [
            {
                name: "edge-tools",
                marker: "edge-tools",
                after: ["selection"],
            },
            {
                name: "selection",
                marker: "selection",
            },
        ];

        applyDependencyDefinitions({
            definitions,
            apply: (definition) => {
                applied.push(definition.marker);
            },
        });

        expect(applied).toEqual(["selection", "edge-tools"]);
    });

    it("checks required dependencies before apply", () => {
        const calls: string[] = [];
        const assertDependency = vi.fn((name: "cache" | "ports") => {
            calls.push(`require:${name}`);
        });

        applyDependencyDefinitions({
            definitions: [
                {
                    name: "selection",
                    marker: "selection",
                    requiredDeps: ["cache", "ports"],
                },
            ],
            assertDependency,
            apply: (definition) => {
                calls.push(`apply:${definition.marker}`);
            },
        });

        expect(calls).toEqual(["require:cache", "require:ports", "apply:selection"]);
    });

    it("collects disposers from applied definitions", () => {
        const disposeA = vi.fn();
        const disposeB = vi.fn();

        const disposers = applyDependencyDefinitions({
            definitions: [
                { name: "selection", marker: "selection" },
                { name: "edge-tools", marker: "edge-tools" },
            ],
            apply: (definition) => {
                return definition.name === "selection" ? disposeA : disposeB;
            },
        });

        expect(disposers).toHaveLength(2);

        disposers[0]?.();
        disposers[1]?.();

        expect(disposeA).toHaveBeenCalledTimes(1);
        expect(disposeB).toHaveBeenCalledTimes(1);
    });

    it("emits lifecycle events for plugin apply and dispose", () => {
        const events: Array<{ type: string; label: string; name: string }> = [];
        const dispose = vi.fn();

        const disposers = applyDependencyDefinitions({
            definitions: [{ name: "selection", marker: "selection" }],
            label: "graph plugin",
            onLifecycle: (event) => {
                events.push(event);
            },
            apply: () => dispose,
        });

        disposers[0]?.();

        expect(events).toEqual([
            { type: "plugin:applied", label: "graph plugin", name: "selection" },
            { type: "plugin:disposed", label: "graph plugin", name: "selection" },
        ]);
        expect(dispose).toHaveBeenCalledTimes(1);
    });

    it("reports apply errors through the error hook", () => {
        const error = new Error("apply failed");
        const onError = vi.fn();

        expect(() =>
            applyDependencyDefinitions({
                definitions: [{ name: "selection", marker: "selection" }],
                label: "graph plugin",
                onError,
                apply: () => {
                    throw error;
                },
            }),
        ).toThrow(error);

        expect(onError).toHaveBeenCalledWith({
            label: "graph plugin",
            stage: "create",
            name: "selection",
            error,
        });
    });
});

