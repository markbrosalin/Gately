export const mergeClassTokens = (
    current: string | undefined,
    add?: string[],
    remove?: string[],
): string | undefined => {
    const tokens = new Set((current ?? "").split(/\s+/).filter(Boolean));

    for (const token of remove ?? []) {
        tokens.delete(token);
    }

    for (const token of add ?? []) {
        if (token) {
            tokens.add(token);
        }
    }

    const next = Array.from(tokens).join(" ").trim();
    return next || undefined;
};
