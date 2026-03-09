export type UseCase<TInput = void, TResult = void> = [TInput] extends [void]
    ? () => TResult
    : (input: TInput) => TResult;

export type AsyncUseCase<TInput = void, TResult = void> = [TInput] extends [void]
    ? () => Promise<TResult>
    : (input: TInput) => Promise<TResult>;
