import { Handler } from "./index.js";
/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler {
    constructor({ handler, hName, eName }) {
        super({ handler, hName, eName });
    }
    get when() {
        return this.eName;
    }
}
