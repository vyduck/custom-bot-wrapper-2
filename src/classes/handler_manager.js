import { Handler } from './handler.js';

export class HandlerManager {
    _name;
    handlers = new Map();
    constructor(name) {
        this.name = name;
    }
    
    set name(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Handler name must be a string');
        }
        this._name = name;
    }

    get name() {
        return this._name;
    }

    addHandler(handler) {
        if (!(handler instanceof Handler))
            throw new TypeError('Handler must be an instance of Handler class');

        const eventName = handler.eName;
        if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Map());
        this.handlers.get(eventName).set(handler.hName, handler);
    }

    async trigger(name, ...args) {
        if (typeof name !== 'string')
            throw new TypeError('Handler name must be a string');
        if (!this.handlers.has(name))
            throw new Error(`Handler ${name} does not exist`);

        const results = {};
        for (const handler of this.handlers[name]) {
            try {
                results[handler.hName] = await handler.execute(...args);
            } catch (error) {
                console.error(`Error executing ${this.name} handler ${name}:`, error);
            }
        }
        return results;
    }

    has(hName) {
        if (typeof hName !== 'string')
            throw new TypeError('Handler name must be a string');

        for (const handlers of this.handlers.values()) 
            if (handlers.has(hName)) 
                return true;

        return false;
    }

    get(hName) {
        if (typeof hName !== 'string')
            throw new TypeError('Handler name must be a string');

        for (const handlers of this.handlers.values()) 
            if (handlers.has(hName)) 
                return handlers.get(hName);

        return undefined;
    }

    getAll() {
        let handlers = [];
        for (const handlersMap of this.handlers.values()) 
            handlers = handlers.concat(Array.from(handlersMap.values()));
        return handlers;
    }
}