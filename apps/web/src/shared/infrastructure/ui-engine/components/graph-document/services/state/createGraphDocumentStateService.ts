import { createStore, produce } from "solid-js/store";
import type { GraphDocument } from "@engine-model";
import type { GraphDocumentStateService } from "./types";

type GraphDocumentStateStore = {
    documentsByWorkspaceId: Record<string, GraphDocument>;
};

export const createGraphDocumentStateService = (): GraphDocumentStateService => {
    const [store, setStore] = createStore<GraphDocumentStateStore>({
        documentsByWorkspaceId: {},
    });

    const documentsByWorkspaceId = () => store.documentsByWorkspaceId;

    const getDocument = (workspaceId: string): GraphDocument | undefined => {
        return store.documentsByWorkspaceId[workspaceId];
    };

    const upsertDocument = (document: GraphDocument): GraphDocument => {
        setStore(
            produce((state) => {
                const existingDocument = state.documentsByWorkspaceId[document.workspaceId];

                state.documentsByWorkspaceId[document.workspaceId] = existingDocument
                    ? {
                          ...document,
                          createdAt: existingDocument.createdAt,
                          updatedAt: Date.now(),
                      }
                    : document;
            }),
        );

        return getDocument(document.workspaceId) ?? document;
    };

    const removeDocument = (workspaceId: string): GraphDocument | undefined => {
        const document = getDocument(workspaceId);
        if (!document) return undefined;

        setStore(
            produce((state) => {
                delete state.documentsByWorkspaceId[workspaceId];
            }),
        );

        return document;
    };

    const setContentJson = (workspaceId: string, contentJson: string): void => {
        setStore(
            produce((state) => {
                const document = state.documentsByWorkspaceId[workspaceId];
                if (!document) return;

                document.contentJson = contentJson;
                document.updatedAt = Date.now();
            }),
        );
    };

    const setViewport = (workspaceId: string, viewport: GraphDocument["viewport"]): void => {
        setStore(
            produce((state) => {
                const document = state.documentsByWorkspaceId[workspaceId];
                if (!document) return;

                document.viewport = viewport;
                document.updatedAt = Date.now();
            }),
        );
    };

    return {
        documentsByWorkspaceId,
        getDocument,
        upsertDocument,
        removeDocument,
        setContentJson,
        setViewport,
    };
};


