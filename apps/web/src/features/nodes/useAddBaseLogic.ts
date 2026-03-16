import type { CatalogItemRef } from "@gately/shared/infrastructure/ui-engine/model/catalog";
import { NodeHashes } from "@gately/shared/infrastructure/ui-engine/model";
import { useUIEngine } from "@gately/shared/infrastructure/ui-engine/public";

const NODE_REF_BY_HASH: Record<NodeHashes, CatalogItemRef> = {
    BUFFER: { libraryId: "std", path: ["logic"], itemName: "buffer" },
    AND: { libraryId: "std", path: ["logic"], itemName: "and" },
    OR: { libraryId: "std", path: ["logic"], itemName: "or" },
    NOT: { libraryId: "std", path: ["logic"], itemName: "not" },
    NAND: { libraryId: "std", path: ["logic"], itemName: "nand" },
    NOR: { libraryId: "std", path: ["logic"], itemName: "nor" },
    XOR: { libraryId: "std", path: ["logic"], itemName: "xor" },
    XNOR: { libraryId: "std", path: ["logic"], itemName: "xnor" },
    TOGGLE: { libraryId: "std", path: ["generator"], itemName: "toggle" },
    TRUE_CONSTANT: { libraryId: "std", path: ["generator"], itemName: "true_constant" },
    FALSE_CONSTANT: { libraryId: "std", path: ["generator"], itemName: "false_constant" },
    LAMP: { libraryId: "std", path: ["display"], itemName: "lamp" },
    "7_SEG_DISPLAY": { libraryId: "std", path: ["display"], itemName: "seven_seg_display" },
};

export const useAddLogicNode = () => {
    const uiEngine = useUIEngine();

    const addLogicElement = async (hash: NodeHashes) => {
        if (!uiEngine.query.workspace.activeWorkspaceId()) return;
        if (!uiEngine.query.engine.isReady()) return;

        return uiEngine.api.createNodeFromCatalogItem({
            ref: NODE_REF_BY_HASH[hash],
        });
    };

    return {
        addBuffer: () => addLogicElement("BUFFER"),
        addAnd: () => addLogicElement("AND"),
        addOr: () => addLogicElement("OR"),
        addNot: () => addLogicElement("NOT"),
        addNand: () => addLogicElement("NAND"),
        addNor: () => addLogicElement("NOR"),
        addXor: () => addLogicElement("XOR"),
        addXnor: () => addLogicElement("XNOR"),
        addToggle: () => addLogicElement("TOGGLE"),
        addLamp: () => addLogicElement("LAMP"),
        add7segDisplay: () => addLogicElement("7_SEG_DISPLAY"),
        addTrueConstant: () => addLogicElement("TRUE_CONSTANT"),
        addFalseConstant: () => addLogicElement("FALSE_CONSTANT"),
    };
};
