/**
 * EventHandler class for managing individual Discord event handlers.
 * Extends the base Handler class.
 */
export class EventHandler extends Handler {
    /**
     * Create a new EventHandler.
     * @param {Object} options
     * @param {Function} options.handler - The function to execute for this event.
     * @param {string} options.hName - Handler name.
     * @param {string} options.eName - Event name.
     * @param {boolean} [options.once=false] - Whether the event should be handled only once.
     */
    constructor({ handler, hName, eName, once }: {
        handler: Function;
        hName: string;
        eName: string;
        once?: boolean;
    });
    /** @type {boolean} */
    _once: boolean;
    /**
     * Set whether the event should be handled only once.
     * @param {boolean} value
     */
    set once(value: boolean);
    /**
     * Get whether the event should be handled only once.
     * @returns {boolean}
     */
    get once(): boolean;
}
import { Handler } from "./handler.js";
