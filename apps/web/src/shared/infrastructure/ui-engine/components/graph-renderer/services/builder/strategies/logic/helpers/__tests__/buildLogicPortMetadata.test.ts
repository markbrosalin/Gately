import { describe, expect, it } from "vitest";
import { buildLogicPortMetadata } from "../buildLogicPortMetadata";

describe("buildLogicPortMetadata", () => {
    it("builds metadata with default anchor, label and signal class", () => {
        const result = buildLogicPortMetadata(
            {
                id: "in-0",
                title: "A",
            },
            "input",
        );

        expect(result).toMatchObject({
            id: "in-0",
            group: "left",
            attrs: {
                circle: {
                    class: "port port-input value-x",
                },
                text: {
                    text: "A",
                },
            },
        });
    });

    it("maps vertical offsets for top and bottom anchors", () => {
        expect(
            buildLogicPortMetadata(
                {
                    id: "top-0",
                    anchor: "top",
                    offset: -4,
                },
                "input",
            ),
        ).toMatchObject({
            group: "top",
            args: {
                dy: 4,
            },
        });
    });
});

