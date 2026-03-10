import type { CatalogItem } from "@engine-model/catalog";
import { baseNodePorts } from "@engine-model";
import { getPortsModule } from "../../../helpers";
import { buildLogicPortMetadata } from "./buildLogicPortMetadata";

export const buildLogicPorts = (item: CatalogItem) => {
    const portsModule = getPortsModule(item);
    const inputPorts = (portsModule?.config.inputs ?? []).map((port) =>
        buildLogicPortMetadata(port, "input"),
    );
    const outputPorts = (portsModule?.config.outputs ?? []).map((port) =>
        buildLogicPortMetadata(port, "output"),
    );

    return {
        ...baseNodePorts,
        items: [...inputPorts, ...outputPorts],
    };
};

