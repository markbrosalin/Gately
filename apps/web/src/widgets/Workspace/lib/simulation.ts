import type { CinabonoClient } from "@cnbn/engine-worker";
import type { ApiSimulateTab_Result } from "@cnbn/engine";
import { nowInMs, waitForRemainingInterval } from "@gately/shared/lib/wait";
import type { WorkspaceSimulationMode } from "@gately/shared/types";
import { createSignal } from "solid-js";
import type { WorkspaceSimulationController, WorkspaceUIEngine } from "./types";

type WorkspaceSimulationOptions = {
    logicEngine: CinabonoClient;
    uiEngine: WorkspaceUIEngine;
    getActiveTabId: () => string | undefined;
};

const HALF_SECOND_MS = 500;
const MAX_EMPTY_SINGLE_TICKS = 1024;

export const createWorkspaceSimulation = (
    opts: WorkspaceSimulationOptions,
): WorkspaceSimulationController => {
    const [mode, setMode] = createSignal<WorkspaceSimulationMode>("instant");
    const [paused, setPaused] = createSignal(false);
    const [busy, setBusy] = createSignal(false);

    let disposed = false;
    let runningLoop = false;

    const _applyTickEvents = (
        events: ApiSimulateTab_Result["tickEvents"] | ApiSimulateTab_Result["events"],
    ): boolean => {
        const hasEvents = events.length > 0;
        if (!hasEvents) return false;

        opts.uiEngine.commands.applySignalEvents(events);
        return hasEvents;
    };

    const _isFinished = async (tabId: string): Promise<boolean> => {
        const statusRes = await opts.logicEngine.call("/simulation/status", { tabId });
        return statusRes.status?.isFinished === true;
    };

    const _simulateStep = async (tabId: string, singleTick: boolean) => {
        const runMode = mode();
        const maxBatchTicks = singleTick ? 1 : runMode === "instant" ? 125 : 1;
        const startedAt = nowInMs();

        const simulateRes = await opts.logicEngine.call("/simulation/simulate", {
            tabId,
            runCfg: { maxBatchTicks },
        });

        const updates = runMode === "instant" ? simulateRes.events : simulateRes.tickEvents;
        const hasTickEvents = _applyTickEvents(updates);

        return {
            runMode,
            startedAt,
            hasTickEvents,
        };
    };

    const _handleSingleTick = (
        tabId: string,
        hasTickEvents: boolean,
        emptySingleTicks: number,
    ): { shouldBreak: boolean; nextEmptySingleTicks: number } => {
        if (hasTickEvents) {
            return {
                shouldBreak: true,
                nextEmptySingleTicks: emptySingleTicks,
            };
        }

        const nextEmptySingleTicks = emptySingleTicks + 1;
        if (nextEmptySingleTicks >= MAX_EMPTY_SINGLE_TICKS) {
            console.warn("[workspace-simulation] nextStep stopped by empty tick safety limit", {
                tabId,
                emptySingleTicks: nextEmptySingleTicks,
            });

            return {
                shouldBreak: true,
                nextEmptySingleTicks,
            };
        }

        return {
            shouldBreak: false,
            nextEmptySingleTicks,
        };
    };

    const _waitAfterStep = async (
        runMode: WorkspaceSimulationMode,
        startedAt: number,
        hasTickEvents: boolean,
    ) => {
        if (runMode === "0.5sec") {
            if (!hasTickEvents) return;

            await waitForRemainingInterval(startedAt, HALF_SECOND_MS);
        }
    };

    const runLoop = async (singleTick: boolean): Promise<void> => {
        if (disposed || runningLoop) return;

        runningLoop = true;
        setBusy(true);
        let emptySingleTicks = 0;

        try {
            while (!disposed) {
                if (!singleTick && paused()) break;

                const tabId = opts.getActiveTabId();
                if (!tabId) break;

                if (await _isFinished(tabId)) break;

                const step = await _simulateStep(tabId, singleTick);

                if (singleTick) {
                    const singleTickResult = _handleSingleTick(
                        tabId,
                        step.hasTickEvents,
                        emptySingleTicks,
                    );
                    emptySingleTicks = singleTickResult.nextEmptySingleTicks;

                    if (singleTickResult.shouldBreak) break;

                    continue;
                }

                await _waitAfterStep(step.runMode, step.startedAt, step.hasTickEvents);
            }
        } catch (err) {
            console.error("[workspace-simulation] loop failed", err);
        } finally {
            runningLoop = false;
            setBusy(false);
        }
    };

    const requestNow = () => {
        if (disposed || paused() || runningLoop) return;
        void runLoop(false);
    };

    const run = () => {
        if (disposed) return;
        setPaused(false);
        requestNow();
    };

    const pause = () => {
        if (disposed) return;
        setPaused(true);
    };

    const resume = () => {
        run();
    };

    const nextStep = () => {
        if (disposed || runningLoop) return;
        void runLoop(true);
    };

    const dispose = () => {
        disposed = true;
        setPaused(true);
    };

    return {
        get isPaused() {
            return paused();
        },
        get isBusy() {
            return busy();
        },
        get mode() {
            return mode();
        },
        set mode(nextMode: WorkspaceSimulationMode) {
            setMode(nextMode);
            requestNow();
        },
        get isDisabled() {
            return !opts.getActiveTabId();
        },
        nextStep,
        requestNow,
        run,
        pause,
        resume,
        dispose,
    };
};

