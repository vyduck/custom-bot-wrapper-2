import { Handler, Logger } from './index.js';

declare const logger: Logger

/**
 * HandlerManager class for managing collections of Handler instances by event name and handler name.
 */
export class HandlerManager<T extends Handler = Handler> {
    name: string;
    handlers: Map<string, Map<string, T>> = new Map();

    /**
     * Create a new HandlerManager.
     */
    constructor(name: string) {
        this.name = name;
    }
    
    /**
     * Add a handler to the manager.
     */
    addHandler(handler: T) {
        const eventName = handler.eName;
        if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Map());
        this.handlers.get(eventName).set(handler.hName, handler);
    }

    async trigger(name: string, ...args: any[]): Promise<object> {
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
     */
    has(hName: string): boolean {
        for (const handlers of this.handlers.values())
            if (handlers.has(hName))
                return true;

        return false;
    }

    /**
     * Get a handler by its handler name.
     */
    get(hName: string): T | undefined {
        for (const handlers of this.handlers.values())
            if (handlers.has(hName))
                return handlers.get(hName);

        return undefined;
    }

    /**
     * Get all Handler instances managed by this HandlerManager.
     */
    getAll(): T[] {
        let handlers = [];
        for (const handlersMap of this.handlers.values())
            handlers = handlers.concat(Array.from(handlersMap.values()));
        return handlers;
    }
}