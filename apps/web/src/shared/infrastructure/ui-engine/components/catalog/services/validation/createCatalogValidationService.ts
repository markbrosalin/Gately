import type {
    CatalogDocument,
    CatalogItem,
    CatalogItemRef,
    CatalogLibraryDocument,
} from "engine-model/catalog";
import { validateDocumentValue, validateItemValue, validateLibraryValue, validateRefValue } from "./validators";
import type { CatalogValidationService } from "./types";

/** Validates catalog documents and entities without mutating catalog state. */
export const createCatalogValidationService = (): CatalogValidationService => {
    return {
        validateRef: (ref: CatalogItemRef) => validateRefValue(ref),
        validateItem: (item: CatalogItem) => validateItemValue(item),
        validateLibrary: (library: CatalogLibraryDocument) => validateLibraryValue(library),
        validateDocument: (document: CatalogDocument) => validateDocumentValue(document),
    };
};
