/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler<T extends Function = Function> {
    eName: string;
    hName: string;
    handler: T;

    /**
     * Creates an instance of Handler.
     */
    constructor({
        eName, hName, handler
    }: { eName: string; hName: string; handler: T; }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }

    /**
     * Executes the handler function with provided arguments.
     */
    async execute(...args: any[]): Promise<any> {
        return await this.handler(...args);
    }
}