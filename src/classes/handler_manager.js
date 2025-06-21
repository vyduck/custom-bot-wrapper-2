import { Handler } from './handler.js';

/**
 * HandlerManager class for managing collections of Handler instances by event name and handler name.
 */
export class HandlerManager {
    /** @type {string} */
    _name;
    /** @type {Map<string, Map<string, Handler>>} */
    handlers = new Map();

    /**
     * Create a new HandlerManager.
     * @param {string} name - The name of the handler manager (e.g., 'command', 'event', 'hook').
     */
    constructor(name) {
        this.name = name;
    }
    
    /**
     * Set the name of the handler manager.
     * @param {string} name
     */
    set name(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Handler name must be a string');
        }
        this._name = name;
    }

    /**
     * Get the name of the handler manager.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Add a Handler instance to the manager.
     * @param {Handler} handler
     */
    addHandler(handler) {
        if (!(handler instanceof Handler))
            throw new TypeError('Handler must be an instance of Handler class');

        const eventName = handler.eName;
        if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Map());
        this.handlers.get(eventName).set(handler.hName, handler);
    }

    /**
     * Trigger all handlers for a given event name, passing arguments to each.
     * @param {string} name - The event name.
     * @param {...any} args - Arguments to pass to each handler.
     * @returns {Promise<Object>} Results keyed by handler name.
     */
    async trigger(name, ...args) {
        if (typeof name !== 'string')
            throw new TypeError('Handler name must be a string');
        if (!this.handlers.has(name))
            return {};

        const results = {};
        for (const handler of this.handlers.get(name).values()) {
            try {
                results[handler.hName] = await handler.execute(...args);
            } catch (error) {
                logger.error(`Error executing ${this.name} handler ${name}: ${error.message}`);
            }
        }
        return results;
    }

    /**
     * Check if a handler with the given handler name exists.
     * @param {string} hName - Handler name.
     * @returns {boolean}
     */
    has(hName) {
        if (typeof hName !== 'string')
            throw new TypeError('Handler name must be a string');

        for (const handlers of this.handlers.values()) 
            if (handlers.has(hName)) 
                return true;

        return false;
    }

    /**
     * Get a handler by its handler name.
     * @param {string} hName - Handler name.
     * @returns {Handler|undefined}
     */
    get(hName) {
        if (typeof hName !== 'string')
            throw new TypeError('Handler name must be a string');

        for (const handlers of this.handlers.values()) 
            if (handlers.has(hName)) 
                return handlers.get(hName);

        return undefined;
    }

    /**
     * Get all Handler instances managed by this HandlerManager.
     * @returns {Handler[]}
     */
    getAll() {
        let handlers = [];
        for (const handlersMap of this.handlers.values()) 
            handlers = handlers.concat(Array.from(handlersMap.values()));
        return handlers;
    }
}