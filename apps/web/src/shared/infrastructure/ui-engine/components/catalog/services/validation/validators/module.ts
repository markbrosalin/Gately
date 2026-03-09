import type {
    CatalogItemKind,
    CatalogItemModule,
    CatalogCompositionPinRef,
} from "engine-model/catalog";
import { catalogValidationIssues } from "../issues";
import {
    isFiniteNumber,
    isNonEmptyString,
    isNonNegativeFiniteNumber,
    prefixIssues,
    pushIssues,
} from "../helpers";
import type { CatalogValidationResult } from "engine-model/catalog";
import { validateRefValue } from "./ref";

const ALLOWED_MODULE_TYPES_BY_KIND: Record<CatalogItemKind, CatalogItemModule["type"][]> = {
    logic: ["logic", "composition", "ports", "interaction", "timing", "visual"],
    annotation: ["interaction"],
    debug: ["interaction"],
    layout: ["interaction"],
};

const _validatePortsModule = (
    module: Extract<CatalogItemModule, { type: "ports" }>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    const seenIds = new Set<string>();

    module.config.items.forEach((port, portIndex) => {
        if (!isNonEmptyString(port.id)) {
            pushIssues(result, catalogValidationIssues.itemPortIdRequired(path, portIndex));
            return;
        }

        if (seenIds.has(port.id)) {
            pushIssues(
                result,
                catalogValidationIssues.itemPortIdDuplicate(path, portIndex, port.id),
            );
            return;
        }

        seenIds.add(port.id);
    });
};

const _validateTimingModule = (
    module: Extract<CatalogItemModule, { type: "timing" }>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    if (!isNonNegativeFiniteNumber(module.config.rise)) {
        pushIssues(result, catalogValidationIssues.itemTimingRiseInvalid(path));
    }

    if (!isNonNegativeFiniteNumber(module.config.fall)) {
        pushIssues(result, catalogValidationIssues.itemTimingFallInvalid(path));
    }
};

const _validateCompositionPinRef = (
    pinRef: CatalogCompositionPinRef,
    knownItemIds: Set<string>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    if (!isNonEmptyString(pinRef.itemId)) {
        pushIssues(result, catalogValidationIssues.itemCompositionPinItemIdRequired(path));
    } else if (!knownItemIds.has(pinRef.itemId)) {
        pushIssues(
            result,
            catalogValidationIssues.itemCompositionPinItemMissing(path, pinRef.itemId),
        );
    }

    if (!isNonEmptyString(pinRef.portId)) {
        pushIssues(result, catalogValidationIssues.itemCompositionPinPortIdRequired(path));
    }
};

const _collectCompositionItemIds = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): Set<string> => {
    const ids = new Set<string>();

    module.config.items.forEach((item, index) => {
        if (!isNonEmptyString(item.id)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionInnerItemIdRequired(path, index),
            );
        } else if (ids.has(item.id)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionInnerItemIdDuplicate(path, index, item.id),
            );
        } else {
            ids.add(item.id);
        }

        pushIssues(
            result,
            prefixIssues(validateRefValue(item.ref).issues, [
                ...path,
                "config",
                "items",
                index,
                "ref",
            ]),
        );
    });

    return ids;
};

const _validateCompositionConnections = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    knownItemIds: Set<string>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    module.config.connections.forEach((connection, index) => {
        _validateCompositionPinRef(connection.from, knownItemIds, result, [
            ...path,
            "config",
            "connections",
            index,
            "from",
        ]);
        _validateCompositionPinRef(connection.to, knownItemIds, result, [
            ...path,
            "config",
            "connections",
            index,
            "to",
        ]);
    });
};

const _validateCompositionInputBindings = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    knownItemIds: Set<string>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    module.config.inputBindings.forEach((binding, index) => {
        const bindingPath = [...path, "config", "inputBindings", index];

        if (!isNonEmptyString(binding.outerPortId)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionOuterPortIdRequired(bindingPath),
            );
        }

        if (binding.targets.length === 0) {
            pushIssues(result, catalogValidationIssues.itemCompositionTargetsRequired(bindingPath));
        }

        binding.targets.forEach((target, targetIndex) => {
            _validateCompositionPinRef(target, knownItemIds, result, [
                ...bindingPath,
                "targets",
                targetIndex,
            ]);
        });
    });
};

const _validateCompositionBoundaryPorts = (
    ports: unknown,
    side: "inputs" | "outputs",
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    if (!Array.isArray(ports)) {
        pushIssues(
            result,
            side === "inputs"
                ? catalogValidationIssues.itemCompositionBoundaryInputsInvalid(path)
                : catalogValidationIssues.itemCompositionBoundaryOutputsInvalid(path),
        );
        return;
    }

    ports.forEach((port, index) => {
        const portPath = [...path, "config", "boundary", side, index];

        if (!port || typeof port !== "object") {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionOuterPortIdRequired(portPath),
            );
            return;
        }

        const boundaryPort = port as {
            outerPortId?: unknown;
            position?: {
                x?: unknown;
                y?: unknown;
            };
        };

        if (!isNonEmptyString(boundaryPort.outerPortId)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionOuterPortIdRequired(portPath),
            );
        }

        if (!isFiniteNumber(boundaryPort.position?.x)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionBoundaryPositionXInvalid(portPath),
            );
        }

        if (!isFiniteNumber(boundaryPort.position?.y)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionBoundaryPositionYInvalid(portPath),
            );
        }
    });
};

const _validateCompositionBoundary = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    _validateCompositionBoundaryPorts(module.config.boundary?.inputs, "inputs", result, path);
    _validateCompositionBoundaryPorts(module.config.boundary?.outputs, "outputs", result, path);
};

const _validateCompositionOutputBindings = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    knownItemIds: Set<string>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    module.config.outputBindings.forEach((binding, index) => {
        const bindingPath = [...path, "config", "outputBindings", index];

        if (!isNonEmptyString(binding.outerPortId)) {
            pushIssues(
                result,
                catalogValidationIssues.itemCompositionOuterPortIdRequired(bindingPath),
            );
        }

        _validateCompositionPinRef(binding.source, knownItemIds, result, [
            ...bindingPath,
            "source",
        ]);
    });
};

const _validateCompositionModule = (
    module: Extract<CatalogItemModule, { type: "composition" }>,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    const knownItemIds = _collectCompositionItemIds(module, result, path);

    _validateCompositionBoundary(module, result, path);
    _validateCompositionConnections(module, knownItemIds, result, path);
    _validateCompositionInputBindings(module, knownItemIds, result, path);
    _validateCompositionOutputBindings(module, knownItemIds, result, path);
};

export const validateModuleValue = (
    module: CatalogItemModule,
    itemKind: CatalogItemKind,
    result: CatalogValidationResult<"item">,
    path: Array<string | number>,
): void => {
    const allowedTypes = ALLOWED_MODULE_TYPES_BY_KIND[itemKind];

    if (!allowedTypes.includes(module.type)) {
        pushIssues(
            result,
            catalogValidationIssues.itemModuleUnsupported(path, module.type, itemKind),
        );
    }

    switch (module.type) {
        case "logic": {
            if (!isNonEmptyString(module.config.executor)) {
                pushIssues(result, catalogValidationIssues.itemLogicExecutorRequired(path));
            }
            return;
        }
        case "ports": {
            _validatePortsModule(module, result, path);
            return;
        }
        case "interaction": {
            if (!isNonEmptyString(module.config.handler)) {
                pushIssues(result, catalogValidationIssues.itemInteractionHandlerRequired(path));
            }
            return;
        }
        case "timing": {
            _validateTimingModule(module, result, path);
            return;
        }
        case "composition": {
            _validateCompositionModule(module, result, path);
            return;
        }
        case "visual": {
            return;
        }
        default: {
            const exhaustiveModule: never = module;
            throw new Error(
                `[UIEngine.catalogValidation.validateItem]: unsupported module "${String(exhaustiveModule)}"`,
            );
        }
    }
};
