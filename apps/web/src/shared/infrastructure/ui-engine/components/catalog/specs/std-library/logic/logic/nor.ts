import { buildStdLogicItem, buildStdPorts, buildStdIconVisual } from "../item-factories";

export const NOR_LOGIC_ICON_PATH = `M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M -8.948 11 C -8.948 11 -5.008 7 -4.998 0 C -4.998 -7 -8.998 -11 -8.998 -11 M -8.948 11 C 7.7888 11 9 0 9 0 C 9 0 7.8737 -11 -9 -11 M -6.5 -6 L -16 -6 M -6.5 6 L -16 6`;

export const NOR_LOGIC_ITEM = buildStdLogicItem({
    group: "logic",
    refName: "nor",
    name: "NOR",
    description: "Outputs true only when all input signals are false.",
    width: 64,
    height: 48,
    tags: ["logic", "combinational"],
    ports: buildStdPorts([
        { id: "in-0", direction: "input", anchor: "left", title: "A" },
        { id: "in-1", direction: "input", anchor: "left", title: "B" },
        { id: "out-0", direction: "output", anchor: "right", title: "X" },
    ]),
    visual: buildStdIconVisual(NOR_LOGIC_ICON_PATH),
});
