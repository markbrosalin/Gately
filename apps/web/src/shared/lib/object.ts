export const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";

const mergeObjectValues = <T>(base: T, source: T): T => {
    if (Array.isArray(source)) {
        return source;
    }

    if (!isObject(base) || !isObject(source)) {
        return source;
    }

    const result: Record<string, unknown> = {
        ...base,
    };

    Object.keys(source).forEach((key) => {
        const next = source[key];
        if (next === undefined) {
            return;
        }

        const current = result[key];
        if (isObject(current) && isObject(next) && !Array.isArray(next)) {
            result[key] = mergeObjectValues(current, next);
            return;
        }

        result[key] = next;
    });

    return result as T;
};

export const mergeObjects = <T extends Record<string, unknown>>(
    defaults: Partial<T>,
    ...sources: Array<Partial<T> | null | undefined>
): T => {
    return sources.reduce<T>((acc, source) => {
        if (!source) return acc;

        return mergeObjectValues(acc, source as T);
    }, { ...defaults } as T);
};

