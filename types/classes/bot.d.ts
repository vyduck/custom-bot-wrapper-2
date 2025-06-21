/**
 * Main Bot class for managing Discord client, commands, events, hooks, and database.
 */
export class Bot {
    /**
     * Create a new Bot instance.
     * @param {Object} param0
     * @param {Object} [param0.clientOptions] - Discord.js client options.
     * @param {Object} param0.options - Bot options.
     * @param {string} param0.options.token - Discord bot token.
     * @param {string} param0.options.clientId - Discord application client ID.
     * @param {string} [param0.options.mongoUri] - MongoDB connection URI.
     */
    constructor({ clientOptions, options }: {
        clientOptions?: any;
        options: {
            token: string;
            clientId: string;
            mongoUri?: string;
        };
    });
    /** @type {Client} */
    client: Client;
    /** @type {CooldownManager} */
    cooldownManager: CooldownManager;
    /** @type {Map<string, any>} */
    configMap: Map<string, any>;
    /** @type {HandlerManager} */
    commandMap: HandlerManager;
    /** @type {HandlerManager} */
    eventMap: HandlerManager;
    /** @type {HandlerManager} */
    hooks: HandlerManager;
    /**
     * Get the global logger instance.
     * @returns {Logger}
     */
    get logger(): Logger;
    /**
     * Database connection and stores.
     * @type {{ stores: Record<string, Store>, connection: mongoose.Connection | null }}
     */
    database: {
        stores: Record<string, Store>;
        connection: mongoose.Connection | null;
    };
    /**
     * Returns the base context object for handlers.
     * @returns {Object}
     */
    get baseContext(): any;
    /**
     * Add a single command handler.
     * @param {CommandHandler} command
     */
    addCommandHandler(command: CommandHandler): void;
    /**
     * Add multiple command handlers.
     * @param {CommandHandler[]} commands
     */
    addCommands(commands: CommandHandler[]): void;
    /**
     * Add a single event handler.
     * @param {EventHandler} event
     */
    addEventHandler(event: EventHandler): void;
    /**
     * Add multiple event handlers.
     * @param {EventHandler[]} events
     */
    addEvents(events: EventHandler[]): void;
    /**
     * Add a single hook handler.
     * @param {HookHandler} hook
     */
    addHook(hook: HookHandler): void;
    /**
     * Add multiple hook handlers.
     * @param {HookHandler[]} hooks
     */
    addHooks(hooks: HookHandler[]): void;
    /**
     * Add a single store.
     * @param {Store} store
     */
    addStore(store: Store): void;
    /**
     * Add multiple stores.
     * @param {Store[]} stores
     */
    addStores(stores: Store[]): void;
    /**
     * Start the bot: attach events, commands, connect to DB, and log in.
     * @returns {Promise<void>}
     */
    start(): Promise<void>;
    #private;
}
import { Client } from "discord.js";
import { CooldownManager } from "./cooldown_manager.js";
import { HandlerManager } from "./handler_manager.js";
import { Logger } from "./logger.js";
import { Store } from "../stores/store.js";
import mongoose from "mongoose";
import { CommandHandler } from "./command_handler.js";
import { EventHandler } from "./event_handler.js";
import { HookHandler } from "./hook_handler.js";
