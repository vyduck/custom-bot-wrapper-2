import { Client, ClientOptions } from "discord.js";
import { HandlerManager } from "./handler_manager.js";
import { CommandHandler } from "./handlers/command_handler.js";
import { EventHandler } from "./handlers/event_handler.js";
import { HookHandler } from "./handlers/hook_handler.js";
import { CooldownManager } from "./cooldown_manager.js";
import { Logger } from "./logger.js";
import { Store } from "../stores/store.js";
/**
 * Bot class for managing the Discord bot instance.
 * It handles commands, events, hooks, and database connections.
 * It also provides methods to add command handlers, event handlers, and hooks.
 * It initializes the Discord client and connects to the MongoDB database.
 * It also provides methods to start the bot, attach events, and publish commands.
 */
export declare class Bot {
    client: Client;
    cooldownManager: CooldownManager;
    configMap: Map<string, any>;
    commandMap: HandlerManager<CommandHandler>;
    eventMap: HandlerManager<EventHandler<any>>;
    hooks: HandlerManager<HookHandler>;
    get logger(): Logger;
    private database;
    private get baseContext();
    /**
     * Creates an instance of the Bot class.
     */
    constructor({ clientOptions, options }: {
        clientOptions: ClientOptions;
        options: {
            token: string;
            clientId: string;
            mongoUri: string;
        };
    });
    /**
     * Adds a command handler to the bot.
     */
    addCommandHandler(command: CommandHandler): void;
    /**
     * Adds multiple command handlers to the bot.
     */
    addCommands(commands: CommandHandler[]): void;
    /**
     * Adds an event handler to the bot.
     */
    addEventHandler(event: EventHandler): void;
    /**
     * Adds multiple event handlers to the bot.
     */
    addEvents(events: EventHandler[]): void;
    /**
     * Adds a hook handler to the bot.
     */
    addHook(hook: HookHandler): void;
    /**
     * Adds multiple hook handlers to the bot.
     */
    addHooks(hooks: HookHandler[]): void;
    /**
     * Adds a store to the bot's database.
     */
    addStore(store: Store): void;
    /**
     * Adds multiple stores to the bot's database.
     */
    addStores(stores: (Store)[]): void;
    /**
     * Attaches all event handlers to the Discord client.
     * It also runs pre-event and post-event hooks.
     */
    private attachEvents;
    /**
     * Creates a logger instance for the bot.
     * This method initializes the global logger with a file path and log level.
     */
    private createLogger;
    /**
     * Attaches command handlers to the Discord client.
     * It listens for interaction events and executes the appropriate command handler.
     */
    private attachCommandsHandler;
    /**
     * Publishes all commands to Discord.
     * This method uses the Discord REST API to register the commands.
     * It requires the bot's token and client ID from the configuration map.
     */
    private publishCommands;
    /**
     * Connects to the MongoDB database using Mongoose.
     * It retrieves the Mongo URI from the configuration map and establishes a connection.
     * If the connection fails, it logs an error and throws an exception.
     */
    private connectToDatabase;
    /**
     * Logs in to Discord using the bot's token.
     * It retrieves the token from the configuration map and calls the login method on the client.
     * If the login fails, it logs an error and throws an exception.
     */
    private login;
    /**
     * Starts the bot by attaching events, commands, and connecting to the database.
     * It also logs in to Discord.
     * This method is the entry point for starting the bot.
     */
    start(): Promise<void>;
}
