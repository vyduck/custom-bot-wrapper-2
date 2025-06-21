export class EventHandler {
    _hName;
    _eName;
    _once;
    _handler;

    constructor({ handler, hName, eName, once = false }) {
        this.handler = handler;
        this.hName = hName;
        this.eName = eName;
        this.once = once;
    }

    execute(context, ...args) {
        return this.handler(context, ...args);
    }

    set handler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }
        this._handler = handler;
    }

    set hName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Handler name must be a string');
        }
        this._hName = name;
    }

    set eName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Event name must be a string');
        }
        this._eName = name;
    }

    set once(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('Once must be a boolean');
        }
        this._once = value;
    }

    get handler() {
        return this._handler;
    }

    get hName() {
        return this._hName;
    }

    get eName() {
        return this._eName;
    }

    get once() {
        return this._once;
    }
}