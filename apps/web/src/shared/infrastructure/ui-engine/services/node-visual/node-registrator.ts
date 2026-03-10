import { Graph } from "@antv/x6";
import type { AnyVisualBinding } from "../../model/visual";
import { baseNodePorts, createBaseNodeAttrs, createBaseNodeMarkup } from "../../model/nodes-spec";
import { mergeAttrs } from "./lib/attrs";
import { useVisualPortLayoutRegistrator } from "./port-layout-registrator";
import type { VisualNodeRegistratorContract } from "./types";

export const useVisualNodeRegistrator = (): VisualNodeRegistratorContract => {
    const portLayoutRegistrator = useVisualPortLayoutRegistrator();

    const registerNodeFromPreset = (binding: AnyVisualBinding): void => {
        const { preset } = binding;
        const defaultAttrs = createBaseNodeAttrs({
            minWidth: preset.minWidth,
            minHeight: preset.minHeight,
        });

        Graph.registerNode(
            preset.nodeName,
            {
                markup: preset.base?.markup ?? createBaseNodeMarkup(),
                attrs: mergeAttrs(defaultAttrs, preset.base?.attrs),
                ports: baseNodePorts,
                width: preset.minWidth,
                height: preset.minHeight,
            },
            true,
        );
    };

    return {
        registerPortLayouts: portLayoutRegistrator.registerPortLayouts,
        registerNodeFromPreset,
    };
};

