export class HookManager {
    constructor(hookPoints = []) {
        super();
        this.hookPoints = hookPoints;
    }

    hooks = {};

    set hookPoints(points) {
        if (!Array.isArray(points)) {
            throw new TypeError('Hook points must be an array');
        }
        for (const point of points) {
            if (typeof point !== 'string')
                throw new TypeError('Each hook point must be a string');
            hooks['pre-' + point] = [];
            hooks['post-' + point] = [];
        }
        this._hookPoints = points;
    }

    get hookPoints() {
        return this._hookPoints;
    }

    async trigger(point, context, ...args) {
        if (typeof point !== 'string')
            throw new TypeError('Hook point must be a string');
        if (!this.hookPoints.includes(point))
            throw new Error(`Hook point ${point} is not defined`);

        let hookContext = {};
        for (const hook of this.hooks.get(point) || []) {
            try {
                hookContext = {
                    ...(await hook.execute(context, ...args)),
                    ...hookContext
                };
            } catch (error) {
                logger.error(`Error executing ${point} hook ${hook.hName}: ${error.message}`);
                throw error; // Re-throw to stop further execution
            }
        }
        return hookContext;
    }

    async add(hook) {
        if (!(hook instanceof Hook))
            throw new TypeError('Hook must be an instance of Hook class');

        if (!this.hookPoints.includes(hook.when))
            throw new Error(`Hook point ${hook.when} is not defined`);

        this.hooks[hook.when].push(hook);
    }
}

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