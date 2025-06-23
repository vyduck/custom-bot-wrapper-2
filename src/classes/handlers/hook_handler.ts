import { 
    ChatInputCommandContext, 
    EventContext 
} from "../../interfaces/context.js";

import { Handler } from "./index.js";

export type HookCallback = (context: EventContext | ChatInputCommandContext, ...args: any[]) => Promise<object>;

/**
 * HookHandler class for managing individual hook handlers.
 * Extends the base Handler class.
 */
export class HookHandler extends Handler<HookCallback> {
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

    get when(): string {
        return this.eName;
    }
}