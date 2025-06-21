export const hookPoints = ['pre-command', 'post-command', 'pre-event', 'post-event'];
export class Hook {
    _hName;
    _handler;
    _when;

    constructor({ handler, hName, when }) {
        this.handler = handler;
        this.hName = hName;
        this.when = when;
    }

    // Setters
    set hName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Hook name must be a string');
        }
        this._hName = name;
    }

    set handler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }
        this._handler = handler;
    }

    set when(when) {
        if (typeof when !== 'string') {
            throw new TypeError('When must be a string');
        }
        if (!hookPoints.includes(when)) {
            throw new Error(`When must be one of: ${hookPoints.join(', ')}`);
        }
        this._when = when;
    }

    // Getters
    get hName() {
        return this._hName;
    }

    get handler() {
        return this._handler;
    }

    get when() {
        return this._when;
    }

    async execute(context, ...args) {
        if (typeof this.handler !== 'function') {
            throw new Error('Handler is not a function');
        }
        return await this.handler({ hook: this, ...context }, ...args);
    }
}