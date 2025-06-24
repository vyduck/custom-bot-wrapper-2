/**
 * HandlerManager class for managing collections of Handler instances by event name and handler name.
 */
export class HandlerManager {
    name;
    handlers = new Map();
    /**
     * Create a new HandlerManager.
     */
    constructor(name) {
        this.name = name;
    }
    /**
     * Add a handler to the manager.
     */
    addHandler(handler) {
        const eventName = handler.eName;
        if (!this.handlers.has(eventName))
            this.handlers.set(eventName, new Map());
        this.handlers.get(eventName).set(handler.hName, handler);
    }
    /**
     * Trigger all handlers for a given event name with the provided arguments.
     * Returns an object mapping handler names to their results.
     */
    async trigger(name, ...args) {
        if (!this.handlers.has(name))
            return {};
        const results = {};
        for (const handler of this.handlers.get(name).values()) {
            try {
                results[handler.hName] = await handler.execute(...args);
            }
            catch (error) {
                logger.error(`Error executing ${this.name} handler ${name}: ${error.message}`);
            }
        }
        return results;
    }
    /**
     * Check if a handler with the given handler name exists.
     */
    has(hName) {
        for (const handlers of this.handlers.values())
            if (handlers.has(hName))
                return true;
        return false;
    }
    /**
     * Get a handler by its handler name.
     */
    get(hName) {
        for (const handlers of this.handlers.values())
            if (handlers.has(hName))
                return handlers.get(hName);
        return undefined;
    }
    /**
     * Get all Handler instances managed by this HandlerManager.
     */
    getAll() {
        let handlers = [];
        for (const handlersMap of this.handlers.values())
            handlers = handlers.concat(Array.from(handlersMap.values()));
        return handlers;
    }
}
