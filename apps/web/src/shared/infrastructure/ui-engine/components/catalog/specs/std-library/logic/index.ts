import { LOGIC_DISPLAY_ITEMS } from "./display";
import { LOGIC_GENERATOR_ITEMS } from "./generator";
import { LOGIC_LOGIC_ITEMS } from "./logic";

export const LOGIC_ITEMS = [
    ...LOGIC_LOGIC_ITEMS,
    ...LOGIC_DISPLAY_ITEMS,
    ...LOGIC_GENERATOR_ITEMS,
] as const;

export {
    buildStdLogicItemAttrs,
    buildStdLogicItemMarkup,
    buildStdLogicItemPorts,
} from "./visual-factories";

