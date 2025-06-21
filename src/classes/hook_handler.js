import { Handler } from "./handler.js";

/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler {
    /**
     * Create a new HookHandler.
     * @param {Object} options
     * @param {Function} options.handler - The function to execute for this hook.
     * @param {string} options.hName - Handler name.
     * @param {string} options.eName - Hook event name (when to trigger).
     */
    constructor({ handler, hName, eName }) {
        super({ handler, hName, eName });
    }

    /**
     * Get the hook event name (when this hook triggers).
     * @returns {string}
     */
    get when() {
        return this.eName;
    }
}