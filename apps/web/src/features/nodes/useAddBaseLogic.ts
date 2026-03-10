import { NodeHashes } from "@gately/shared/infrastructure/ui-engine/model";
import { useUIEngine } from "@gately/shared/infrastructure/ui-engine/public";

export const useAddLogicNode = () => {
    const uiEngine = useUIEngine();

    const addLogicElement = async (hash: NodeHashes) => {
        if (!uiEngine.state.activeScopeId()) return;
        if (!uiEngine.state.ready()) return;

        return uiEngine.commands.addNode({
            hash,
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

