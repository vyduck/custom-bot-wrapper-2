import { 
    ChatInputCommandContext, 
    EventContext 
} from "../../interfaces/context.js";

import { Handler } from "./handler.js";

export type HookCallback = (context: EventContext | ChatInputCommandContext, ...args: any[]) => Promise<object>;

/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler<HookCallback> {
    /**
     * Creates an instance of HookHandler.
     */
    constructor({
        handler,
        hName,
        eName
    }: {
        handler: HookCallback;
        hName: string;
        eName: string;
    }) {
        super({ handler, hName, eName });
    }

    /**
     * Returns the event name associated with the hook.
     */
    get when(): string {
        return this.eName;
    }
}