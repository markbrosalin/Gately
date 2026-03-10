import type { LogicValue } from "@cnbn/schema";
import { getPrimaryOutputPin } from "@gately/shared/infrastructure/ui-engine/lib";
import { applyOptimisticOutput } from "../optimistic";
import { patchNodeRuntime, readNodeRuntime } from "../runtime";
import type { NodeClickHandler } from "../types";

type BinaryValue = "0" | "1";

type ToggleRuntime = {
    toggleValue?: LogicValue;
    togglePin?: string;
};

const isBinaryValue = (value: unknown): value is BinaryValue => value === "0" || value === "1";

const toggleBinaryValue = (value: BinaryValue): BinaryValue => (value === "1" ? "0" : "1");

export const handleTogglePrimaryClick: NodeClickHandler = async (ctx) => {
    const pin = getPrimaryOutputPin(ctx.node);
    if (!pin) return;

    const runtime = readNodeRuntime<ToggleRuntime>(ctx.node);
    const previousValue: BinaryValue = isBinaryValue(runtime.toggleValue)
        ? runtime.toggleValue
        : "0";
    const nextValue = toggleBinaryValue(previousValue);

    patchNodeRuntime<ToggleRuntime>(ctx.node, {
        togglePin: pin,
        toggleValue: nextValue,
    });

    applyOptimisticOutput({
        uiEngine: ctx.uiEngine,
        node: ctx.node,
        pin,
        value: nextValue,
    });

    try {
        await ctx.runCommand(() =>
            ctx.logicEngine.call("/item/updateOutput", {
                tabId: ctx.tabId,
                itemId: ctx.node.id,
                pin,
                value: nextValue,
            }),
        );
    } catch (err) {
        patchNodeRuntime<ToggleRuntime>(ctx.node, {
            togglePin: pin,
            toggleValue: previousValue,
        });

        applyOptimisticOutput({
            uiEngine: ctx.uiEngine,
            node: ctx.node,
            pin,
            value: previousValue,
        });

        console.error("[workspace-bridge] toggle failed", err);
    }
};

