import { Pusher } from "@gately/shared/ui";
import { Component, For, Show, createEffect, createMemo, createSignal } from "solid-js";
import type { ArduinoHardwareController, HardwareDirection } from "..";

type ArduinoHardwarePanelProps = {
    hardware: ArduinoHardwareController;
};

const DIRECTION_OPTIONS: Array<{ value: HardwareDirection; label: string }> = [
    { value: "hardware-to-circuit", label: "Read from Arduino" },
    { value: "circuit-to-hardware", label: "Write to Arduino" },
];

const statusClass = (kind: "ok" | "warn" | "idle"): string => {
    if (kind === "ok") return "text-true";
    if (kind === "warn") return "text-x";
    return "text-gray-10";
};

export const ArduinoHardwarePanel: Component<ArduinoHardwarePanelProps> = (props) => {
    const [open, setOpen] = createSignal(false);
    const [selectedPin, setSelectedPin] = createSignal("");
    const [selectedDirection, setSelectedDirection] =
        createSignal<HardwareDirection>("hardware-to-circuit");
    const [selectedVirtualPort, setSelectedVirtualPort] = createSignal("");

    const freePins = createMemo(() => props.hardware.pins().filter((pin) => pin.mode === "free"));
    const assignmentsByPin = createMemo(
        () => new Map(props.hardware.assignments().map((assignment) => [assignment.hardwarePin, assignment])),
    );
    const connected = () => props.hardware.connectionStatus() === "connected to agent";
    const boardKind = () => {
        const boardStatus = props.hardware.boardStatus();
        if (boardStatus === "ready") return "ok";
        if (boardStatus === "error") return "warn";
        return "idle";
    };

    createEffect(() => {
        const firstFreePin = freePins()[0]?.pin;
        const current = Number.parseInt(selectedPin(), 10);
        if (firstFreePin === undefined) return;
        if (!freePins().some((pin) => pin.pin === current)) {
            setSelectedPin(String(firstFreePin));
        }
    });

    createEffect(() => {
        const firstPort = props.hardware.virtualPorts()[0]?.key;
        if (firstPort && !props.hardware.virtualPorts().some((port) => port.key === selectedVirtualPort())) {
            setSelectedVirtualPort(firstPort);
        }
    });

    const assignSelected = () => {
        const pin = Number.parseInt(selectedPin(), 10);
        if (!Number.isInteger(pin)) return;
        props.hardware.assign(pin, selectedDirection(), selectedVirtualPort());
    };

    return (
        <div class="relative">
            <Pusher
                class="px-2 py-1 bg-gray-3 rounded text-gray-12 hover:bg-gray-4"
                onClick={() => setOpen((value) => !value)}
            >
                Arduino
            </Pusher>

            <Show when={open()}>
                <div
                    class="absolute left-0 top-full mt-2 w-[540px] rounded-md border border-gray-4 bg-gray-1/95 shadow-xl p-3 text-gray-12"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div class="flex items-center gap-2">
                        <input
                            class="min-w-0 flex-1 px-2 py-1 rounded border border-gray-5 bg-gray-2 text-xs"
                            value={props.hardware.url()}
                            onInput={(event) => props.hardware.setUrl(event.currentTarget.value)}
                        />
                        <Show
                            when={connected()}
                            fallback={
                                <Pusher
                                    class="px-2 py-1 rounded bg-primary-9 text-primary-contrast text-xs hover:bg-primary-10 data-disabled:bg-gray-3 data-disabled:text-gray-9"
                                    onClick={props.hardware.connect}
                                    disabled={props.hardware.connectionStatus() === "connecting"}
                                >
                                    Connect
                                </Pusher>
                            }
                        >
                            <Pusher
                                class="px-2 py-1 rounded bg-gray-3 text-xs hover:bg-gray-4"
                                onClick={props.hardware.disconnect}
                            >
                                Disconnect
                            </Pusher>
                        </Show>
                    </div>

                    <div class="mt-2 flex items-center gap-3 text-xs">
                        <span class={statusClass(connected() ? "ok" : "idle")}>
                            {props.hardware.connectionStatus()}
                        </span>
                        <span class={statusClass(boardKind())}>{props.hardware.boardStatus()}</span>
                        <Show when={props.hardware.boardMessage()}>
                            {(message) => <span class="truncate text-gray-10">{message()}</span>}
                        </Show>
                    </div>

                    <Show when={props.hardware.lastError()}>
                        {(error) => <div class="mt-2 text-xs text-x">{error()}</div>}
                    </Show>

                    <div class="mt-3 grid grid-cols-[120px_160px_1fr_auto] gap-2">
                        <select
                            class="min-w-0 px-2 py-1 rounded border border-gray-5 bg-gray-2 text-xs"
                            value={selectedPin()}
                            onChange={(event) => setSelectedPin(event.currentTarget.value)}
                        >
                            <For each={freePins()}>
                                {(pin) => <option value={String(pin.pin)}>{pin.label}</option>}
                            </For>
                        </select>

                        <select
                            class="min-w-0 px-2 py-1 rounded border border-gray-5 bg-gray-2 text-xs"
                            value={selectedDirection()}
                            onChange={(event) =>
                                setSelectedDirection(event.currentTarget.value as HardwareDirection)
                            }
                        >
                            <For each={DIRECTION_OPTIONS}>
                                {(direction) => (
                                    <option value={direction.value}>{direction.label}</option>
                                )}
                            </For>
                        </select>

                        <select
                            class="min-w-0 px-2 py-1 rounded border border-gray-5 bg-gray-2 text-xs"
                            value={selectedVirtualPort()}
                            onChange={(event) => setSelectedVirtualPort(event.currentTarget.value)}
                        >
                            <For each={props.hardware.virtualPorts()}>
                                {(port) => <option value={port.key}>{port.label}</option>}
                            </For>
                        </select>

                        <Pusher
                            class="px-2 py-1 rounded bg-gray-3 text-xs hover:bg-gray-4 data-disabled:text-gray-9"
                            onClick={assignSelected}
                            disabled={
                                !connected() ||
                                !selectedPin() ||
                                !selectedVirtualPort() ||
                                !freePins().length
                            }
                        >
                            Assign
                        </Pusher>
                    </div>

                    <div class="mt-3 max-h-64 overflow-y-auto rounded border border-gray-4">
                        <For each={props.hardware.pins()}>
                            {(pin) => {
                                const assignment = () => assignmentsByPin().get(pin.pin);

                                return (
                                    <div class="grid grid-cols-[52px_92px_1fr_auto_auto] items-center gap-2 border-b border-gray-3 px-2 py-1 last:border-b-0 text-xs">
                                        <span class="font-medium">{pin.label}</span>
                                        <span class="text-gray-10">{pin.mode}</span>
                                        <span class="min-w-0 truncate text-gray-11">
                                            {assignment()?.label ?? pin.assignmentId ?? "-"}
                                        </span>
                                        <span class="w-8 text-center text-gray-10">
                                            {pin.value ?? assignment()?.lastValue ?? "-"}
                                        </span>
                                        <div class="flex gap-1">
                                            <Show when={assignment()}>
                                                {(item) => (
                                                    <>
                                                        <Pusher
                                                            class="px-2 py-1 rounded bg-gray-3 hover:bg-gray-4"
                                                            onClick={() =>
                                                                props.hardware.focusAssignment(
                                                                    item().assignmentId,
                                                                )
                                                            }
                                                        >
                                                            Focus
                                                        </Pusher>
                                                        <Pusher
                                                            class="px-2 py-1 rounded bg-gray-3 hover:bg-gray-4"
                                                            onClick={() =>
                                                                props.hardware.unassignPin(pin.pin)
                                                            }
                                                        >
                                                            Reset
                                                        </Pusher>
                                                    </>
                                                )}
                                            </Show>
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </div>
                </div>
            </Show>
        </div>
    );
};
