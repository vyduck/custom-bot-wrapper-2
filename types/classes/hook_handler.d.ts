/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler {
    /**
     * Get the hook event name (when this hook triggers).
     * @returns {string}
     */
    get when(): string;
}
import { Handler } from "./handler.js";
