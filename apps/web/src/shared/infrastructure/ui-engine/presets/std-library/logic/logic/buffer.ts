import { buildStdIconVisual, buildStdLogicItem, buildStdPorts } from "../item-factories";

export const BUFFER_LOGIC_ICON_PATH = `M-16 0 L-8 0 M9 0 L17 0 M8.598 -0.805 C9.245 -0.416 9.245 0.523 8.598 0.911L-6.485 9.961 C-7.152 10.361 -8 9.881 -8 9.104 L-8 -8.997 C-8 -9.774 -7.152 -10.254 -6.485 -9.854 L8.598 -0.805 Z`;

export const BUFFER_LOGIC_ITEM = buildStdLogicItem({
    group: "logic",
    refName: "buffer",
    name: "Buffer",
    description: "Passes the input signal to the output without changing it.",
    width: 64,
    height: 32,
    tags: ["logic", "combinational"],
    ports: buildStdPorts({
        inputs: [{ id: "in-0", anchor: "left", title: "A" }],
        outputs: [{ id: "out-0", anchor: "right", title: "X" }],
    }),
    visual: buildStdIconVisual(BUFFER_LOGIC_ICON_PATH),
});
