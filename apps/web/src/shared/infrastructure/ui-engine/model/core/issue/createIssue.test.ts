import { describe, expect, it } from "vitest";
import { createIssue } from "./createIssue";

describe("createIssue", () => {
    it("creates issue from static message definition", () => {
        const issue = createIssue(
            {
                code: "test.static",
                message: "Static issue message.",
            },
            ["field"],
        );

        expect(issue).toEqual({
            code: "test.static",
            message: "Static issue message.",
            path: ["field"],
        });
    });

    it("creates issue from parametrized message definition", () => {
        const issue = createIssue(
            {
                code: "test.dynamic",
                message: ({ value }: { value: string }) => `Invalid value "${value}".`,
            },
            ["field"],
            { value: "abc" },
        );

        expect(issue).toEqual({
            code: "test.dynamic",
            message: 'Invalid value "abc".',
            path: ["field"],
        });
    });
});

