export type DependencyEntry<TName extends string, TValue> = {
    name: TName;
    deps?: readonly TName[];
    value: TValue;
};

export const resolveDependencyOrder = <TName extends string, TValue>(
    entries: readonly DependencyEntry<TName, TValue>[],
): DependencyEntry<TName, TValue>[] => {
    const byName = new Map<TName, DependencyEntry<TName, TValue>>();
    const resolved = new Set<TName>();
    const visiting = new Set<TName>();
    const ordered: DependencyEntry<TName, TValue>[] = [];

    entries.forEach((entry) => {
        if (byName.has(entry.name)) {
            throw new Error(`[UIEngine] duplicate dependency entry "${entry.name}"`);
        }
        byName.set(entry.name, entry);
    });

    const visit = (name: TName) => {
        if (resolved.has(name)) return;
        if (visiting.has(name)) {
            throw new Error(`[UIEngine] circular dependency detected for "${name}"`);
        }

        const entry = byName.get(name);
        if (!entry) {
            throw new Error(`[UIEngine] unknown dependency "${name}"`);
        }

        visiting.add(name);
        (entry.deps ?? []).forEach((depName) => {
            visit(depName);
        });
        visiting.delete(name);
        resolved.add(name);
        ordered.push(entry);
    };

    entries.forEach((entry) => {
        visit(entry.name);
    });

    return ordered;
};

