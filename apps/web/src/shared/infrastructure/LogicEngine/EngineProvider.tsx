import { CinabonoClient } from "@cnbn/engine-worker";
import { createContext, createResource, ParentComponent, Show, useContext } from "solid-js";
import { createEngineClient } from "./client";

const LogicEngineContext = createContext<CinabonoClient>();

export const LogicEngineProvider: ParentComponent = (props) => {
    const [engine] = createResource(() => createEngineClient());

    return (
        <Show when={engine()} fallback={<div>Loading engine...</div>}>
            <LogicEngineContext.Provider value={engine()}>
                {props.children}
            </LogicEngineContext.Provider>
        </Show>
    );
};

export const useLogicEngine = () => {
    const ctx = useContext(LogicEngineContext);
    if (!ctx) throw new Error("useLogicEngine must be used within LogicEngineProvider");
    return ctx;
};

