export const isNonEmptyString = (value: unknown): value is string => {
    return typeof value === "string" && value.trim().length > 0;
};

export const isFiniteNumber = (value: unknown): value is number => {
    return typeof value === "number" && Number.isFinite(value);
};

export const isPositiveFiniteNumber = (value: unknown): value is number => {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
};

export const isNonNegativeFiniteNumber = (value: unknown): value is number => {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
};

