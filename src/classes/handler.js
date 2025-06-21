/**
 * Base Handler class for commands, events, and hooks.
 * Stores handler function, event name, and handler name.
 */
export class Handler {
    /** @type {string} */
    _eName;
    /** @type {string} */
    _hName;
    /** @type {Function} */
    _handler;

    /**
     * Create a new Handler.
     * @param {Object} options
     * @param {string} options.eName - Event name.
     * @param {string} options.hName - Handler name.
     * @param {Function} options.handler - Handler function.
     */
    constructor({
        eName, hName, handler
    }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }

    /**
     * Set the event name.
     * @param {string} name
     */
    set eName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Event name must be a string');
        }
        this._eName = name;
    }

    /**
     * Set the handler name.
     * @param {string} name
     */
    set hName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Handler name must be a string');
        }
        this._hName = name;
    }

    /**
     * Set the handler function.
     * @param {Function} handler
     */
    set handler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }
        this._handler = handler;
    }

    /**
     * Get the event name.
     * @returns {string}
     */
    get eName() {
        return this._eName;
    }

    /**
     * Get the handler name.
     * @returns {string}
     */
    get hName() {
        return this._hName;
    }

    /**
     * Get the handler function.
     * @returns {Function}
     */
    get handler() {
        return this._handler;
    }

    /**
     * Execute the handler function with provided arguments.
     * @param {...any} args - Arguments to pass to the handler.
     * @returns {Promise<any>}
     */
    async execute(...args) {
        return await this.handler(...args);
    }
}