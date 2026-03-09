import type { CatalogItem } from "engine-model/catalog";
import { baseNodePorts } from "engine-model";
import { getPortsModule } from "../getCatalogModules";
import { createPortMetadata } from "./portMetadata";

export const createPorts = (item: CatalogItem) => {
    const portsModule = getPortsModule(item);
    const inputPorts = (portsModule?.config.inputs ?? []).map((port) =>
        createPortMetadata(port, "input"),
    );
    const outputPorts = (portsModule?.config.outputs ?? []).map((port) =>
        createPortMetadata(port, "output"),
    );

    return {
        ...baseNodePorts,
        items: [...inputPorts, ...outputPorts],
    };
};
