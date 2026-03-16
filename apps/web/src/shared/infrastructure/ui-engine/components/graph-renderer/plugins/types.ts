import type { Plugin } from "@engine-model/core/plugin";
import type { GraphRendererServiceContext } from "../services/types";

export type GraphRendererPluginContext = GraphRendererServiceContext;

export type GraphRendererPlugin = Plugin<GraphRendererPluginContext>;
