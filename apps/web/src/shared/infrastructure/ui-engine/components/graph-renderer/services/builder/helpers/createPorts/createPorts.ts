import type { CatalogItem } from "engine-model/catalog";
import { baseNodePorts } from "engine-model";
import { getPortsModule } from "../getCatalogModules";
import { createPortMetadata } from "./portMetadata";

export const createPorts = (item: CatalogItem) => {
    const portsModule = getPortsModule(item);
    const ports = portsModule?.config.items ?? [];
    const orderedPorts = ports
        .map((port, index) => ({ port, index }))
        .sort((left, right) => {
            const leftOrder = left.port.order ?? left.index;
            const rightOrder = right.port.order ?? right.index;
            return leftOrder - rightOrder;
        })
        .map(({ port }) => createPortMetadata(port));

    return {
        ...baseNodePorts,
        items: orderedPorts,
    };
};
