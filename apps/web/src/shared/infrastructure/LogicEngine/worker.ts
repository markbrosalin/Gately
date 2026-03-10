import { CinabonoBuilder } from "@cnbn/engine";
import { CinabonoWorker } from "@cnbn/engine-worker";

export const createEngineWorker = async () => {
    const engine = await new CinabonoBuilder().build();
    const workerHandler = new CinabonoWorker(engine);
    workerHandler.listen();
    return workerHandler;
};

createEngineWorker().catch(console.error);

