import { Handler } from './handlers/handler.js';
/**
 * HandlerManager class for managing collections of Handler instances by event name and handler name.
 */
export declare class HandlerManager<T extends Handler = Handler> {
    name: string;
    handlers: Map<string, Map<string, T>>;
    /**
     * Create a new HandlerManager.
     */
    constructor(name: string);
    /**
     * Add a handler to the manager.
     */
    addHandler(handler: T): void;
    trigger(name: string, ...args: any[]): Promise<object>;
    /**
     * Check if a handler with the given handler name exists.
     */
    has(hName: string): boolean;
    /**
     * Get a handler by its handler name.
     */
    get(hName: string): T | undefined;
    /**
     * Get all Handler instances managed by this HandlerManager.
     */
    getAll(): T[];
}
