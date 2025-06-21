import Handler from "./handler";

export class EventHandler extends Handler {
    _once;

    constructor({ handler, hName, eName, once = false }) {
        super({
            handler,
            eName,
            hName
        })
        this.once = once;
    }

    execute(context, ...args) {
        return this.handler(context, ...args);
    }

    set once(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('Once must be a boolean');
        }
        this._once = value;
    }

    get once() {
        return this._once;
    }
}