import { describe, expect, it } from "vitest";
import { createPortMetadata } from "../portMetadata";

describe("createPortMetadata", () => {
    it("builds metadata with default anchor, label and signal class", () => {
        const result = createPortMetadata(
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
            createPortMetadata(
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
