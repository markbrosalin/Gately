import { EngineComponents } from "../components/createComponents";

export type EngineQueryApi = ReturnType<typeof buildQueryApi>;

export const buildQueryApi = (components: EngineComponents) => {
    type Components = typeof components;
    type ComponentName = keyof Components;
    type Query = { [K in ComponentName]: Components[K]["query"] };

    const query: Partial<Query> = {};

    for (const name in components) {
        const inst = components[name as keyof typeof components];
        Object.assign(query, { [name]: inst.query });
    }

    return query as Query;
};
