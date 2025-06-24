import { Handler } from "./handler.js";
/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler {
    /**
     * Creates an instance of HookHandler.
     */
    constructor({ handler, hName, eName }) {
        super({ handler, hName, eName });
    }
    /**
     * Returns the event name associated with the hook.
     */
    get when() {
        return this.eName;
    }
}
