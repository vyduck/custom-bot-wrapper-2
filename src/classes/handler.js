export class Handler {
    _eName;
    _hName;
    _handler;

    constructor({
        eName, hName, handler
    }) {
        this.eName = eName;
        this.hName = hName;
        this.handler = handler;
    }

    // Setters
    set eName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Event name must be a string');
        }
        this._eName = name;
    }
    set hName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Handler name must be a string');
        }
        this._hName = name;
    }
    set handler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }
        this._handler = handler;
    }
    // Getters
    get eName() {
        return this._eName;
    }
    get hName() {
        return this._hName;
    }
    get handler() {
        return this._handler;
    }

    // Method to execute the handler
    async execute(...args) {
        return await this.handler(...args);
    }
}