/**
 * HandlerManager class for managing collections of Handler instances by event name and handler name.
 */
export class HandlerManager {
    /**
     * Create a new HandlerManager.
     * @param {string} name - The name of the handler manager (e.g., 'command', 'event', 'hook').
     */
    constructor(name: string);
    /** @type {string} */
    _name: string;
    /** @type {Map<string, Map<string, Handler>>} */
    handlers: Map<string, Map<string, Handler>>;
    /**
     * Set the name of the handler manager.
     * @param {string} name
     */
    set name(name: string);
    /**
     * Get the name of the handler manager.
     * @returns {string}
     */
    get name(): string;
    /**
     * Add a Handler instance to the manager.
     * @param {Handler} handler
     */
    addHandler(handler: Handler): void;
    /**
     * Trigger all handlers for a given event name, passing arguments to each.
     * @param {string} name - The event name.
     * @param {...any} args - Arguments to pass to each handler.
     * @returns {Promise<Object>} Results keyed by handler name.
     */
    trigger(name: string, ...args: any[]): Promise<any>;
    /**
     * Check if a handler with the given handler name exists.
     * @param {string} hName - Handler name.
     * @returns {boolean}
     */
    has(hName: string): boolean;
    /**
     * Get a handler by its handler name.
     * @param {string} hName - Handler name.
     * @returns {Handler|undefined}
     */
    get(hName: string): Handler | undefined;
    /**
     * Get all Handler instances managed by this HandlerManager.
     * @returns {Handler[]}
     */
    getAll(): Handler[];
}
import { Handler } from './handler.js';
