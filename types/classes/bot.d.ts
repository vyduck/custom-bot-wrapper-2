import { Client, ClientOptions } from "discord.js";
import { Store } from "../stores/store.js";
import { HandlerManager } from "./handler_manager.js";
import { CommandHandler } from "./handlers/command_handler.js";
import { EventHandler } from "./handlers/event_handler.js";
import { HookHandler } from "./handlers/hook_handler.js";
import { CooldownManager } from "./cooldown_manager.js";
import { Logger } from "./logger.js";
import { BaseContext, Database } from "../interfaces/index";
export declare class Bot {
    client: Client;
    cooldownManager: CooldownManager;
    configMap: Map<string, any>;
    commandMap: HandlerManager<CommandHandler>;
    eventMap: HandlerManager<EventHandler<any>>;
    hooks: HandlerManager<HookHandler>;
    get logger(): Logger;
    database: Database;
    get baseContext(): BaseContext;
    constructor({ clientOptions, options }: {
        clientOptions: ClientOptions;
        options: {
            token: string;
            clientId: string;
            mongoUri: string;
        };
    });
    addCommandHandler(command: CommandHandler): void;
    addCommands(commands: CommandHandler[]): void;
    addEventHandler(event: EventHandler): void;
    addEvents(events: EventHandler[]): void;
    addHook(hook: HookHandler): void;
    addHooks(hooks: HookHandler[]): void;
    addStore(store: Store): void;
    addStores(stores: Store[]): void;
    private attachEvents;
    private addDefaultEvents;
    private createLogger;
    private attachCommandsHandler;
    private addDefaultCommands;
    private publishCommands;
    private connectToDatabase;
    private login;
    start(): Promise<void>;
}
