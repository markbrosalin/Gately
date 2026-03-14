/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Graph } from "@antv/x6";
import type { CinabonoClient } from "@cnbn/engine-worker";
import type { UIEngineHooks } from "./lifecycle";
import { ComponentServiceContext } from ".";

export type UIEngineExternalContext = {
    logicEngine?: CinabonoClient;
    hooks?: UIEngineHooks;
};

export type UIEnginePlugin = {
    name: string;
    apply: (graph: Graph, ctx: UIEngineContext) => void | (() => void);
};

export type UIEngineContext = ComponentServiceContext<{}, string, Record<string, any>>;
