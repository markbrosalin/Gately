import { CinabonoClient } from "@cnbn/engine-worker";

export const createEngineClient = async (): Promise<CinabonoClient> => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
    });
    const client = new CinabonoClient(worker);
    await client.isReady();
    return client;
};

