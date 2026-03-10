type WaitFn = (ms: number) => Promise<void>;

export const defaultWait: WaitFn = (ms) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });

export const nowInMs = (): number => globalThis.performance?.now?.() ?? Date.now();

export type WaitForRemainingIntervalOptions = {
    wait?: WaitFn;
    nowMs?: number;
};

export const getRemainingIntervalMs = (
    startedAtMs: number,
    targetIntervalMs: number,
    nowMs: number = nowInMs(),
): number => {
    const elapsedMs = Math.max(0, nowMs - startedAtMs);
    return Math.max(0, targetIntervalMs - elapsedMs);
};

export const waitForRemainingInterval = async (
    startedAtMs: number,
    targetIntervalMs: number,
): Promise<number> => {
    const wait = defaultWait;
    const nowMs = nowInMs();
    const remainingMs = getRemainingIntervalMs(startedAtMs, targetIntervalMs, nowMs);
    await wait(remainingMs);
    return remainingMs;
};

export const waitForFrame = (): Promise<void> =>
    new Promise((resolve) => {
        // if (typeof requestAnimationFrame === "function") {
        //     requestAnimationFrame(() => resolve());
        //     return;
        // }
        console.log("her");
        setTimeout(resolve, 0);
    });

