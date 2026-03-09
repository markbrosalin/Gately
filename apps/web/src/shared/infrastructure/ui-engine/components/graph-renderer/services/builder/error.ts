export class GraphRendererBuilderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GraphRendererBuilderError";
    }
}
