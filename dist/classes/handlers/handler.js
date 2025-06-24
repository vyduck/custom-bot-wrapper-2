/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler {
    eName;
    hName;
    handler;
    /**
     * Creates an instance of Handler.
     */
    constructor({ eName, hName, handler }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }
    /**
     * Executes the handler function with provided arguments.
     */
    async execute(...args) {
        return await this.handler(...args);
    }
}
