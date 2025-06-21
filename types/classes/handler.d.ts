/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler {
    /**
     * Create a new Handler.
     * @param {Object} options
     * @param {string} options.eName - Event name.
     * @param {string} options.hName - Handler name.
     * @param {Function} options.handler - Handler function.
     */
    constructor({ eName, hName, handler }: {
        eName: string;
        hName: string;
        handler: Function;
    });
    /** @type {string} */
    _eName: string;
    /** @type {string} */
    _hName: string;
    /** @type {Function} */
    _handler: Function;
    /**
     * Set the event name.
     * @param {string} name
     */
    set eName(name: string);
    /**
     * Get the event name.
     * @returns {string}
     */
    get eName(): string;
    /**
     * Set the handler name.
     * @param {string} name
     */
    set hName(name: string);
    /**
     * Get the handler name.
     * @returns {string}
     */
    get hName(): string;
    /**
     * Set the handler function.
     * @param {Function} handler
     */
    set handler(handler: Function);
    /**
     * Get the handler function.
     * @returns {Function}
     */
    get handler(): Function;
    /**
     * Execute the handler function with provided arguments.
     * @param {...any} args - Arguments to pass to the handler.
     * @returns {Promise<any>}
     */
    execute(...args: any[]): Promise<any>;
}
