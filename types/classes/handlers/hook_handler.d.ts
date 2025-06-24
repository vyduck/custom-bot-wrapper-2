import { ChatInputCommandContext, EventContext } from "../../interfaces/context.js";
import { Handler } from "./handler.js";
export type HookCallback = (context: EventContext | ChatInputCommandContext, ...args: any[]) => Promise<object>;
/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export declare class HookHandler extends Handler<HookCallback> {
    /**
     * Creates an instance of HookHandler.
     */
    constructor({ handler, hName, eName }: {
        handler: HookCallback;
        hName: string;
        eName: string;
    });
    /**
     * Returns the event name associated with the hook.
     */
    get when(): string;
}
