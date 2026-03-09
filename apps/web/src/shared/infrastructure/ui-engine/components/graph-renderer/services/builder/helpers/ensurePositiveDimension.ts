import { GraphRendererBuilderError } from "../error";

export const ensurePositiveDimension = (value: number, label: string): number => {
    if (!Number.isFinite(value) || value <= 0) {
        throw new GraphRendererBuilderError(`Catalog item ${label} must be a positive number.`);
    }

    return value;
};
