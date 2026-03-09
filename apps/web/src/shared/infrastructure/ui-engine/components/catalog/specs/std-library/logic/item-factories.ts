import {
    CatalogItemRef,
    CatalogLogicItem,
    CatalogPortAnchor,
    CatalogPortDirection,
    CatalogPortSpec,
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
    ports?: CatalogPortSpec[];
    visual?: CatalogVisualModule["config"];
};

type CreateStdPortInput = {
    id: string;
    direction: CatalogPortDirection;
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

const buildStdPort = (input: CreateStdPortInput, index: number): CatalogPortSpec => ({
    id: input.id,
    direction: input.direction,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.anchor !== undefined ? { anchor: input.anchor } : {}),
    order: index,
});

export const buildStdPorts = (ports: CreateStdPortInput[]): CatalogPortSpec[] => {
    return ports.map((port, index) => buildStdPort(port, index));
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
            ...(input.ports && input.ports.length > 0
                ? [
                      {
                          type: "ports" as const,
                          config: {
                              items: input.ports,
                          },
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
