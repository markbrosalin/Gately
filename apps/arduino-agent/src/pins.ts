import type { AgentPin, DigitalValue, HardwareDirection } from "./protocol.js";

export const UNO_DIGITAL_PINS = Array.from({ length: 14 }, (_, pin) => pin);
export const RESERVED_DIGITAL_PINS = new Set([0, 1]);

export type PinAssignment = {
    assignmentId: string;
    direction: HardwareDirection;
    label?: string;
    value?: DigitalValue;
};

export type PinAssignments = Map<number, PinAssignment>;

export const isUnoDigitalPin = (pin: number): boolean => UNO_DIGITAL_PINS.includes(pin);

export const isReservedPin = (pin: number): boolean => RESERVED_DIGITAL_PINS.has(pin);

export const toDigitalValue = (value: unknown): DigitalValue | undefined => {
    if (value === 0 || value === "0" || value === false) return 0;
    if (value === 1 || value === "1" || value === true) return 1;
    return undefined;
};

export const createPinsList = (assignments: PinAssignments): AgentPin[] =>
    UNO_DIGITAL_PINS.map((pin) => {
        const assignment = assignments.get(pin);
        if (assignment) {
            return {
                pin,
                label: `D${pin}`,
                mode: "assigned",
                value: assignment.value,
                assignmentId: assignment.assignmentId,
                direction: assignment.direction,
            };
        }

        return {
            pin,
            label: `D${pin}`,
            mode: isReservedPin(pin) ? "reserved" : "free",
        };
    });

export const canAssignPin = (pin: number): boolean => isUnoDigitalPin(pin) && !isReservedPin(pin);
