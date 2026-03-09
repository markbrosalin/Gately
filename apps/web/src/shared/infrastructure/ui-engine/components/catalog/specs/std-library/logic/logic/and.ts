import { buildStdLogicItem, buildStdPorts, buildStdIconVisual } from "../item-factories";

export const AND_LOGIC_ICON_PATH = `M -1.7 -11 C 4.3 -11 9 -6 9 0 C 9 6 4 11 -2 11 H -7 C -8 11 -8 10.6 -8 10 V -10 C -8 -10.6 -7.6 -11 -7 -11 H -2 M -8 -6 L -16 -6 M -9 6 L -16 6 M 17 0 L 9 0`;

export const AND_LOGIC_ITEM = buildStdLogicItem({
    group: "logic",
    refName: "and",
    name: "AND",
    description: "Outputs true only when all input signals are true.",
    width: 64,
    height: 48,
    tags: ["logic", "combinational"],
    ports: buildStdPorts([
        { id: "in-0", direction: "input", anchor: "left", title: "A" },
        { id: "in-1", direction: "input", anchor: "left", title: "B" },
        { id: "out-0", direction: "output", anchor: "right", title: "X" },
    ]),
    visual: buildStdIconVisual(AND_LOGIC_ICON_PATH),
});
