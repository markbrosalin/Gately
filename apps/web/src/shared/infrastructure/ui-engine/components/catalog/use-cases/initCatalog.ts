import type { CatalogDocument } from "engine-model/catalog";
import type { Result } from "engine-model";
import { createErrResult, createOkResult } from "engine-model";
import { createCatalogDocument } from "../helpers/createCatalogDocument";
import type { CatalogUseCaseDeps } from "./types";

type CatalogInitCatalogInput = {
    document?: CatalogDocument;
};

type CatalogInitCatalogResult = Result<CatalogDocument>;

export type CatalogInitCatalogUseCase = (
    input?: CatalogInitCatalogInput,
) => CatalogInitCatalogResult;

export const createInitCatalogUseCase = ({
    io,
    state,
}: Pick<CatalogUseCaseDeps, "io" | "state">): CatalogInitCatalogUseCase => {
    return ({ document } = {}) => {
        const nextDocument = document ?? createCatalogDocument();
        const importResult = io.importDocument(nextDocument);

        if (!importResult.ok || !importResult.value) {
            return createErrResult(importResult.issues);
        }

        state.replaceDocument(importResult.value);

        return createOkResult(importResult.value);
    };
};
