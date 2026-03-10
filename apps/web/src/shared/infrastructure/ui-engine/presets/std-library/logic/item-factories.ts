import {
    CatalogItemRef,
    CatalogLogicItem,
    CatalogPortAnchor,
    CatalogPortSpec,
    CatalogPortsModule,
    CatalogVisualModule,
} from "@gately/shared/infrastructure/ui-engine/model/catalog";

type StdGroup = "logic" | "generator" | "display";

type CreateStdLogicItemInput = {
    group: StdGroup;
    refName: string;
    name: string;
    description: string;
    width: number;
    height: number;
    tags?: string[];
    ports?: CatalogPortsModule["config"];
    visual?: CatalogVisualModule["config"];
};

type CreateStdPortInput = {
    id: string;
    title?: string;
    anchor?: CatalogPortAnchor;
};

export const buildStdItemRef = (group: StdGroup, refName: string): CatalogItemRef => ({
    libraryId: "std",
    path: [group],
    itemName: refName,
});

export const buildStdItemI18nKey = (ref: CatalogItemRef): string => {
    return ["catalog", ref.libraryId, ...ref.path, ref.itemName].join("::");
};

export const buikdStdLayout = (width: number, height: number) => ({
    width,
    height,
    minWidth: width,
    minHeight: height,
});

const buildStdPort = (input: CreateStdPortInput): CatalogPortSpec => ({
    id: input.id,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.anchor !== undefined ? { anchor: input.anchor } : {}),
});

export const buildStdPorts = (ports: {
    inputs?: CreateStdPortInput[];
    outputs?: CreateStdPortInput[];
}): CatalogPortsModule["config"] => {
    return {
        ...(ports.inputs?.length
            ? {
                  inputs: ports.inputs.map((port) => buildStdPort(port)),
              }
            : {}),
        ...(ports.outputs?.length
            ? {
                  outputs: ports.outputs.map((port) => buildStdPort(port)),
              }
            : {}),
    };
};

export const buildStdIconVisual = (iconPath: string): CatalogVisualModule["config"] => ({
    base: {
        attrs: {
            icon: {
                d: iconPath,
            },
        },
    },
});

export const buildStdLogicItem = (input: CreateStdLogicItemInput): CatalogLogicItem => {
    const ref = buildStdItemRef(input.group, input.refName);

    return {
        ref,
        kind: "logic",
        meta: {
            name: input.name,
            description: input.description,
            tags: input.tags ?? [input.group],
            createdAt: 1,
            extensions: {
                i18nKey: buildStdItemI18nKey(ref),
            },
        },
        layout: buikdStdLayout(input.width, input.height),
        modules: [
            ...((input.ports?.inputs?.length || input.ports?.outputs?.length)
                ? [
                      {
                          type: "ports" as const,
                          config: input.ports,
                      },
                  ]
                : []),
            ...(input.visual
                ? [
                      {
                          type: "visual" as const,
                          config: input.visual,
                      },
                  ]
                : []),
        ],
    };
};
