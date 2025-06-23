/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler {
    eName;
    hName;
    handler;
    constructor({ eName, hName, handler }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }
    async execute(...args) {
        return await this.handler(...args);
    }
}
