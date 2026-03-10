export type ProtocolRegister<TContribution> = (
    contributor: string,
    value: TContribution,
) => () => void;

export type ProtocolHub<TContribution> = {
    register: ProtocolRegister<TContribution>;
    values: () => TContribution[];
};

