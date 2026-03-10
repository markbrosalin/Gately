export const mergeClassTokens = (
    current?: string,
    additions?: string[],
    removals?: string[],
): string | undefined => {
    const tokens = new Set((current ?? "").split(/\s+/).filter(Boolean));

    removals?.forEach((token) => tokens.delete(token));
    additions?.forEach((token) => tokens.add(token));

    return tokens.size > 0 ? Array.from(tokens).join(" ") : undefined;
};

