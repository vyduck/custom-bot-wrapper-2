/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export declare class Handler<T extends Function = Function> {
    eName: string;
    hName: string;
    handler: T;
    /**
     * Creates an instance of Handler.
     */
    constructor({ eName, hName, handler }: {
        eName: string;
        hName: string;
        handler: T;
    });
    /**
     * Executes the handler function with provided arguments.
     */
    execute(...args: any[]): Promise<any>;
}
