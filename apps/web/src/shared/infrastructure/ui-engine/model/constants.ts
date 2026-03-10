import type { UIScopeSnapshot } from "./workspace";
import type { LogicValue } from "@cnbn/schema";
import type { EdgeRouterMode, LogicValueClass } from "./graph-renderer";

export const NODE_PORT_LAYOUTS = {
    left: "logic-left",
    right: "logic-right",
    top: "logic-top",
    bottom: "logic-bottom",
} as const;

export const LOGIC_VALUE_CLASSES = ["value-true", "value-false", "value-x", "value-hiz"] as const;

export const CLASS_BY_LOGIC_VALUE: Record<LogicValue, LogicValueClass> = {
    "1": "value-true",
    "0": "value-false",
    X: "value-x",
    Z: "value-hiz",
    C: "value-x",
};

export const LOGIC_VALUE_BY_CLASS: Record<LogicValueClass, LogicValue> = {
    "value-true": "1",
    "value-false": "0",
    "value-hiz": "Z",
    "value-x": "X",
};

export const EDGE_ROUTER_MODES: EdgeRouterMode[] = ["manhattan", "metro"];

export const DEFAULT_VALUE_CLASS = "value-x";

export const DEFAULT_SCOPE_SNAPSHOT: UIScopeSnapshot = {
    contentJson: "",
    viewport: { zoom: 1, tx: 0, ty: 0 },
};

export const STROKE_WIDTH = 2;
export const NODE_INSET = STROKE_WIDTH / 2;
export const GRID_SIZE = 16;

