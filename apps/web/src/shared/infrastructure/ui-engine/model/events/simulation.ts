import type { PinUpdate } from "../graph-renderer";

export const SIMULATION_BATCH_APPLIED_EVENT = "simulation:batch-applied";

export type SimulationBatchAppliedEvent = {
    updates: PinUpdate[];
};

