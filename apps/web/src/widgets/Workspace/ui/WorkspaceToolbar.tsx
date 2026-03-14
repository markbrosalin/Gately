import { useAddLogicNode } from "@gately/features/nodes/useAddBaseLogic";
import { useUIEngine } from "@gately/shared/infrastructure";
import type { WorkspaceSimulationMode } from "@gately/shared/types";
import { Pusher } from "@gately/shared/ui";
import type { WorkspaceController } from "../lib/types";
import { Component } from "solid-js";

const SIMULATION_MODE_OPTIONS: Array<{ value: WorkspaceSimulationMode; label: string }> = [
    { value: "instant", label: "instant" },
    { value: "0.5sec", label: "0.5 sec" },
];

type WorkspaceToolbarProps = Pick<WorkspaceController, "simulation">;

export const WorkspaceToolbar: Component<WorkspaceToolbarProps> = (props) => {
    const uiEngine = useUIEngine();
    const {
        addBuffer,
        addAnd,
        addOr,
        addNot,
        addNor,
        addNand,
        addXor,
        addXnor,
        addToggle,
        addLamp,
        addTrueConstant,
        addFalseConstant,
        add7segDisplay,
    } = useAddLogicNode();
    const disabled = () => !uiEngine.query.workspace.activeWorkspaceId();

    return (
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-2">
            <div class="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-2/90 shadow">
                <Pusher
                    class="px-2 py-1 bg-gray-3 rounded text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={() =>
                        props.simulation.isPaused
                            ? props.simulation.resume()
                            : props.simulation.pause()
                    }
                    disabled={props.simulation.isDisabled}
                >
                    {props.simulation.isPaused ? "Resume" : "Pause"}
                </Pusher>
                <Pusher
                    class="px-2 py-1 bg-gray-3 rounded text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={props.simulation.nextStep}
                    disabled={props.simulation.isDisabled || !props.simulation.isPaused}
                >
                    Next tick
                </Pusher>
                <select
                    class="px-2 py-1 rounded bg-gray-3 text-gray-12 border border-gray-5"
                    value={props.simulation.mode}
                    disabled={props.simulation.isDisabled || props.simulation.isBusy}
                    onChange={(e) =>
                        (props.simulation.mode = e.currentTarget.value as WorkspaceSimulationMode)
                    }
                >
                    {SIMULATION_MODE_OPTIONS.map((mode) => (
                        <option value={mode.value}>{mode.label}</option>
                    ))}
                </select>
                <span class="text-xs text-gray-10">
                    {props.simulation.isBusy ? "running..." : "idle"}
                </span>
            </div>

            <div class="flex gap-2">
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addToggle}
                    disabled={disabled()}
                >
                    Add TOGGLE
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addTrueConstant}
                    disabled={disabled()}
                >
                    Add True Constant
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addFalseConstant}
                    disabled={disabled()}
                >
                    Add False Constant
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addLamp}
                    disabled={disabled()}
                >
                    Add LAMP
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={add7segDisplay}
                    disabled={disabled()}
                >
                    Add 7-Seg Display
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addBuffer}
                    disabled={disabled()}
                >
                    Add Buffer
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addAnd}
                    disabled={disabled()}
                >
                    Add AND
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addOr}
                    disabled={disabled()}
                >
                    Add OR
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addNot}
                    disabled={disabled()}
                >
                    Add NOT
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addNor}
                    disabled={disabled()}
                >
                    Add NOR
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addNand}
                    disabled={disabled()}
                >
                    Add NAND
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addXor}
                    disabled={disabled()}
                >
                    Add XOR
                </Pusher>
                <Pusher
                    class="px-3 py-1 bg-gray-3 rounded-md shadow text-gray-12 hover:bg-gray-4 data-disabled:bg-gray-2 data-disabled:text-gray-8"
                    onClick={addXnor}
                    disabled={disabled()}
                >
                    Add XNOR
                </Pusher>
            </div>
        </div>
    );
};

