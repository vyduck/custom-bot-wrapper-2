import { Handler } from './handler.js';

export default class HandlerManager {
    _name;
    handlers = {};
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

        const name = handler.eName;
        if (!Object.keys(this.handlers).includes(name)) this.handlers[name] = [];
        this.handlers[name].push(handler);
    }

    async trigger(name, ...args) {
        if (typeof name !== 'string')
            throw new TypeError('Handler name must be a string');
        if (!Object.keys(this.handlers).includes(name))
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

}