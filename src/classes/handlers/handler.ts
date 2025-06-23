/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler<T extends Function = Function> {
    eName: string;
    hName: string;
    handler: T;

    constructor({
        eName, hName, handler
    }: { eName: string; hName: string; handler: T; }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }

    async execute(...args: any[]): Promise<any> {
        return await this.handler(...args);
    }
}