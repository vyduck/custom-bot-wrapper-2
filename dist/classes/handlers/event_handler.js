import { Handler } from "./handler.js";
/**
 * EventHandler class for managing individual Discord event handlers.
 * Extends the base Handler class.
 */
export class EventHandler extends Handler {
    once;
    /**
     * Creates an instance of EventHandler.
     */
    constructor({ handler, eName, hName, once = false }) {
        super({
            handler,
            eName,
            hName
        });
        this.once = once;
    }
}
