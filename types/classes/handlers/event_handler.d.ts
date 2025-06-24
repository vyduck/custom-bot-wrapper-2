import { ClientEvents } from "discord.js";
import { EventContext } from "../../interfaces/context.js";
import { Handler } from "./handler.js";
export type EventCallback<T extends any[] = any[]> = (context: EventContext, ...args: T) => Promise<any> | any;
/**
 * EventHandler class for managing individual Discord event handlers.
 * Extends the base Handler class.
 */
export declare class EventHandler<Event extends keyof ClientEvents = any> extends Handler<EventCallback> {
    once: boolean;
    eName: Event;
    /**
     * Creates an instance of EventHandler.
     */
    constructor({ handler, eName, hName, once }: {
        handler: EventCallback<ClientEvents[Event]>;
        hName: string;
        eName: Event;
        once: boolean;
    });
}
