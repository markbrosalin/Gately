import { buildStdLogicItem, buildStdPorts, buildStdIconVisual } from "../item-factories";

export const OR_LOGIC_ICON_PATH = `M -8.948 11 C -8.948 11 -5.008 7 -4.998 0 C -4.998 -7 -8.998 -11 -8.998 -11 M -8.948 11 C 7.7888 11 9 -0.0005 9 -0.0005 C 9 -0.0005 7.8737 -11 -9 -11 M 17 0 L 9 0 M -6.5 -6 L -16 -6 M -6.5 6 L -16 6`;

export const OR_LOGIC_ITEM = buildStdLogicItem({
    group: "logic",
    refName: "or",
    name: "OR",
    description: "Outputs true when at least one input signal is true.",
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
    visual: buildStdIconVisual(OR_LOGIC_ICON_PATH),
});

