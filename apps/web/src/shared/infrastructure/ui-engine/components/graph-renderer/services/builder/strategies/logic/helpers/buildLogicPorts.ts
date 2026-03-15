import type { Metadata } from "@antv/x6/lib/model/port";
import type { CatalogItem } from "@engine-model/catalog";
import { NODE_PORT_LAYOUTS } from "@engine-model/constants";
import { getPortsModule } from "../../../helpers";
import { buildLogicPortMetadata } from "./buildLogicPortMetadata";

const createBaseLogicPorts = (): Metadata => ({
    items: [],
    groups: {
        left: {
            position: { name: NODE_PORT_LAYOUTS.left },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-input",
                },
            },
        },
        right: {
            position: { name: NODE_PORT_LAYOUTS.right },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-output",
                },
            },
        },
        top: {
            position: { name: NODE_PORT_LAYOUTS.top },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-input",
                },
            },
        },
        bottom: {
            position: { name: NODE_PORT_LAYOUTS.bottom },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-input",
                },
            },
        },
    },
});

export const buildLogicPorts = (item: CatalogItem) => {
    const portsModule = getPortsModule(item);
    const inputPorts = (portsModule?.config.inputs ?? []).map((port) =>
        buildLogicPortMetadata(port, "input"),
    );
    const outputPorts = (portsModule?.config.outputs ?? []).map((port) =>
        buildLogicPortMetadata(port, "output"),
    );

    return {
        ...createBaseLogicPorts(),
        items: [...inputPorts, ...outputPorts],
    };
};
