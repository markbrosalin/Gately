import { buildStdLogicItem, buildStdPorts, buildStdIconVisual } from "../item-factories";

export const XNOR_LOGIC_ICON_PATH = ` M -12.948 11 C -12.948 11 -9.008 7 -8.998 0 C -8.998 -7 -12.998 -11 -12.998 -11 M -8.948 11 C -8.948 11 -5.008 7 -4.998 0 C -4.998 -7 -8.998 -11 -8.998 -11 M -8.948 11 C 7.7888 11 9 -0.0005 9 -0.0005 C 9 -0.0005 7.8737 -11 -9 -11 M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M -6.5 -6 L -16 -6 M -6.5 6 L -16 6`;

export const XNOR_LOGIC_ITEM = buildStdLogicItem({
    group: "logic",
    refName: "xnor",
    name: "XNOR",
    description: "Outputs true when the number of true input signals is even.",
    width: 64,
    height: 48,
    tags: ["logic", "combinational"],
    ports: buildStdPorts({
        inputs: [
            { id: "in-0", anchor: "left", title: "A" },
            { id: "in-1", anchor: "left", title: "B" },
        ],
        outputs: [{ id: "out-0", anchor: "right", title: "X" }],
    }),
    visual: buildStdIconVisual(XNOR_LOGIC_ICON_PATH),
});

