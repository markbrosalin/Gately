import type { GraphRendererBuilderService } from "./types";
import { GraphRendererBuilderError } from "./error";
import { createGraphRendererLogicItemBuilder } from "./strategies";

export const createGraphRendererBuilderApi = (): GraphRendererBuilderService => {
    const logicBuilder = createGraphRendererLogicItemBuilder();

    const buildNodeProps: GraphRendererBuilderService["buildNodeProps"] = (input) => {
        const { item } = input;

        switch (item.kind) {
            case "logic":
                return logicBuilder.buildNodeProps({
                    ...input,
                    item,
                });
            case "annotation":
            case "debug":
            case "layout":
                throw new GraphRendererBuilderError(
                    `Graph renderer builder strategy for item kind "${item.kind}" is not implemented.`,
                );
            default:
                throw new GraphRendererBuilderError(
                    `Graph renderer builder strategy for item kind "${String(item)}" is not implemented.`,
                );
        }
    };

    return {
        buildNodeProps,
    };
};

export const createGraphRendererBuilderService = (): GraphRendererBuilderService => {
    return createGraphRendererBuilderApi();
};


