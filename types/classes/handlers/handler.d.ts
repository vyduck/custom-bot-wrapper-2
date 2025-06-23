/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export declare class Handler<T extends Function = Function> {
    eName: string;
    hName: string;
    handler: T;
    constructor({ eName, hName, handler }: {
        eName: string;
        hName: string;
        handler: T;
    });
    execute(...args: any[]): Promise<any>;
}
