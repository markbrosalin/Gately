import { Component, onMount } from "solid-js";
import "reflect-metadata";
import { AppProvider } from "./providers/AppProvider";
import { TabBar } from "@gately/widgets/TabBar";
import { Workspace } from "@gately/widgets/Workspace";

export const App: Component = () => {
    onMount(async () => {
        document.getElementById("initial-loader")?.remove();
    });

    return (
        <AppProvider>
            <div class="h-full min-h-0 flex flex-col">
                <TabBar />
                <div class="flex-1 min-h-0">
                    <Workspace />
                </div>
            </div>
        </AppProvider>
    );
};

