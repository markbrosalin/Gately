import {
    BinaryVisualState,
    VisualStateResolver,
} from "@gately/shared/infrastructure/ui-engine/model";
import { SEGMENTS } from "./constant";

export const resolveSevenSegState: VisualStateResolver<BinaryVisualState> = (ctx) => {
    const signals = ctx.readSignals("input");
    return SEGMENTS.map(([, pin]) => (signals[pin] === "1" ? "on" : "off"));
};
