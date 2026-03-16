export type Plugin<TContext> = {
    name: string;
    install: (ctx: TContext) => void | (() => void);
};
