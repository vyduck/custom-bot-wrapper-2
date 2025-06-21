import { Client, IntentsBitField, REST, Routes } from "discord.js";
import mongoose from "mongoose";

import { CooldownManager } from "./cooldown_manager.js";
import { HandlerManager } from "./handler_manager.js";
import { CommandHandler } from "./command_handler.js";
import { EventHandler } from "./event_handler.js";
import { HookHandler } from "./hook_handler.js";
import { Logger } from "./logger.js";
import { Store } from "../stores/store.js";

import defaultCommands from "../defaults/commands/index.js";
import defaultEvents from "../defaults/events/index.js";

/**
 * Main Bot class for managing Discord client, commands, events, hooks, and database.
 */
export class Bot {
    /** @type {Client} */
    client;
    /** @type {CooldownManager} */
    cooldownManager = new CooldownManager();
    /** @type {Map<string, any>} */
    configMap = new Map();
    /** @type {HandlerManager} */
    commandMap = new HandlerManager('command');
    /** @type {HandlerManager} */
    eventMap = new HandlerManager('event');
    /** @type {HandlerManager} */
    hooks = new HandlerManager('hook');

    /**
     * Get the global logger instance.
     * @returns {Logger}
     */
    get logger() {
        if (!logger)
            this.#createLogger();
        return global.logger;
    }

    /**
     * Database connection and stores.
     * @type {{ stores: Record<string, Store>, connection: mongoose.Connection | null }}
     */
    database = {
        stores: {},
        connection: null
    };

    /**
     * Returns the base context object for handlers.
     * @returns {Object}
     */
    get baseContext() {
        return {
            commandMap: this.commandMap,
            configMap: this.configMap,
            database: this.database.stores,
            client: this.client,
            cooldownManager: this.cooldownManager
        }
    }

    /**
     * Create a new Bot instance.
     * @param {Object} param0
     * @param {Object} [param0.clientOptions] - Discord.js client options.
     * @param {Object} param0.options - Bot options.
     * @param {string} param0.options.token - Discord bot token.
     * @param {string} param0.options.clientId - Discord application client ID.
     * @param {string} [param0.options.mongoUri] - MongoDB connection URI.
     */
    constructor({
        clientOptions = {
            intents: IntentsBitField.Flags.Guilds
        }, options
    }) {
        if (!options || !options.token || !options.clientId)
            throw new Error('Token and Client ID must be provided in options');
        if (typeof options.token !== 'string' || typeof options.clientId !== 'string')
            throw new TypeError('Token and Client ID must be strings');
        if (!clientOptions || typeof clientOptions !== 'object')
            throw new TypeError('Client options must be an object');
        if (options.mongoUri && typeof options.mongoUri !== 'string')
            throw new TypeError('Mongo URI must be a string');

        this.configMap.set('token', options.token);
        this.configMap.set('clientId', options.clientId);
        this.configMap.set('mongoUri', options.mongoUri);

        this.#createLogger();

        this.client = new Client(clientOptions);
    }

    /**
     * Add a single command handler.
     * @param {CommandHandler} command
     */
    addCommandHandler(command) {
        if (!(command instanceof CommandHandler)) {
            throw new TypeError('Command must be an instance of CommandHandler');
        }
        if (this.commandMap.has(command.cName)) {
            throw new Error(`Command with name ${command.cName} already exists`);
        }
        this.commandMap.addHandler(command);
        this.cooldownManager.addCommand(command.cName, command.cooldown);
    }

    /**
     * Add multiple command handlers.
     * @param {CommandHandler[]} commands
     */
    addCommands(commands) {
        if (!Array.isArray(commands)) {
            throw new TypeError('Commands must be an array of CommandHandler instances');
        }
        for (const command of commands) {
            this.addCommandHandler(command);
        }
    }

    /**
     * Add a single event handler.
     * @param {EventHandler} event
     */
    addEventHandler(event) {
        if (!(event instanceof EventHandler)) {
            throw new TypeError('Event must be an instance of EventHandler');
        }
        if (this.eventMap.has(event.hName)) {
            throw new Error(`Event with handler name ${event.hName} already exists under event ${event.eName}`);
        }
        this.eventMap.addHandler(event);
    }

    /**
     * Add multiple event handlers.
     * @param {EventHandler[]} events
     */
    addEvents(events) {
        if (!Array.isArray(events)) {
            throw new TypeError('Events must be an array of EventHandler instances');
        }
        for (const event of events) {
            this.addEventHandler(event);
        }
    }

    /**
     * Add a single hook handler.
     * @param {HookHandler} hook
     */
    addHook(hook) {
        if (!(hook instanceof HookHandler)) {
            throw new TypeError('Hook must be an instance of HookHandler');
        }
        if (this.hooks.has(hook.hName)) {
            throw new Error(`Hook with name ${hook.hName} already exists`);
        }
        this.hooks.addHandler(hook);
    }

    /**
     * Add multiple hook handlers.
     * @param {HookHandler[]} hooks
     */
    addHooks(hooks) {
        if (!Array.isArray(hooks)) {
            throw new TypeError('Hooks must be an array of HookHandler instances');
        }
        for (const hook of hooks) {
            this.addHook(hook);
        }
    }

    /**
     * Add a single store.
     * @param {Store} store
     */
    addStore(store) {
        if (!(store instanceof Store))
            throw new TypeError('Store must be an instance of Store');
        if (this.database.stores[store.name])
            throw new Error(`Store with name ${store.name} already exists`);
        this.database.stores[store.name] = store;
    }

    /**
     * Add multiple stores.
     * @param {Store[]} stores
     */
    addStores(stores) {
        if (!Array.isArray(stores))
            throw new TypeError('Stores must be an array of Store instances');
        for (const store of stores)
            this.addStore(store);
    }

    /**
     * Attach all registered event handlers to the Discord client.
     * @private
     */
    #attachEvents() {
        const allEvents = this.eventMap.handlers.keys();
        for (const event of allEvents) {
            this.client.on(
                event,
                async (...args) => {
                    // Prepare context
                    let context = {
                        event,
                        ...this.baseContext
                    };
                    // Run pre-event hooks
                    const hookResults = await this.hooks.trigger(`pre-event`, context, ...args);
                    // Attach output of hooks to context
                    context.hookContext = hookResults;
                    // Execute the event handler
                    try {
                        await this.eventMap.trigger(event, context, ...args)
                    } catch (error) {
                        logger.error(`Error executing event ${event.hName}: ${error.message}`);
                    }
                    // Run post-event hooks
                    await this.hooks.trigger(`post-event`, context, ...args)
                });
        }
        logger.debug(`Attached ${allEvents.length} events.`);
    }

    /**
     * Add default event handlers.
     * @private
     */
    #addDefaultEvents() {
        logger.debug("Adding default events...");
        for (const event of defaultEvents)
            this.addEventHandler(event);
        logger.debug(`Added ${defaultEvents.length} default events.`);
    }

    /**
     * Create and set up the global logger.
     * @private
     */
    #createLogger() {
        global.logger = new Logger({
            level: 'info',
            filePath: 'bot.log',
            customStreams: []
        });
        logger.debug("Logger initialized.");
    }

    /**
     * Attach the command handler to the Discord client.
     * @private
     * @returns {Promise<void>}
     */
    async #attachCommandsHandler() {
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = interaction.commandName;
            if (!this.commandMap.has(interaction.commandName)) return;

            // Prepare context
            let context = {
                command,
                interaction,
                ...this.baseContext
            };

            // Run pre-command hooks
            const hookResults = await this.hooks.trigger(`pre-command`, context, interaction);
            // Attach output of hooks to context
            context.hookContext = hookResults;
            // Execute the command handler
            await this.commandMap.trigger(command, context, interaction);
            // Run post-command hooks
            await this.hooks.trigger(`post-command`, context, interaction);
        });
    }

    /**
     * Add default command handlers.
     * @private
     * @returns {Promise<void>}
     */
    async #addDefaultCommands() {
        logger.debug("Adding default commands...");
        for (const command of defaultCommands)
            this.addCommandHandler(command);
        logger.debug(`Added ${defaultCommands.length} default commands.`);
    }

    /**
     * Publish all registered commands to Discord.
     * @private
     * @returns {Promise<void>}
     */
    async #publishCommands() {
        logger.debug("Publishing commands to Discord...");
        const commands = this.commandMap.getAll().map(cmd => cmd.builder.toJSON());
        const rest = new REST({ version: '10' }).setToken(this.configMap.get('token'));
        try {
            logger.debug('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(this.configMap.get('clientId')),
                { body: commands },
            );
            logger.debug('Successfully reloaded application (/) commands.');
        } catch (error) {
            logger.error(`Error while publishing commands: ${error.message}`);
            throw new Error(`Failed to publish commands: ${error.message}`);
        }
        logger.debug(`Published ${commands.length} commands.`);
    }

    /**
     * Connect to the MongoDB database.
     * @private
     * @returns {Promise<void>}
     */
    async #connectToDatabase() {
        if (!this.configMap.has('mongoUri'))
            throw new Error('Mongo URI is not set in the configuration');

        try {
            this.database.connection = await mongoose.connect(this.configMap.get('mongoUri'));
            logger.debug("Connected to MongoDB successfully.");
        } catch (error) {
            logger.error(`Failed to connect to MongoDB: ${error.message}`);
            throw new Error(`Database connection error: ${error.message}`);
        }
    }

    /**
     * Log in to Discord with the provided token.
     * @private
     * @returns {Promise<void>}
     */
    async #login() {
        if (!this.configMap.has('token')) {
            throw new Error('Token is not set in the configuration');
        }

        try {
            await this.client.login(this.configMap.get('token'));
        } catch (error) {
            logger.error(`Failed to log in to Discord: ${error.message}`);
            throw new Error(`Login error: ${error.message}`);
        }
    }

    /**
     * Start the bot: attach events, commands, connect to DB, and log in.
     * @returns {Promise<void>}
     */
    async start() {
        if (!this.configMap.has('token')) {
            throw new Error('Token is not set in the configuration');
        }

        logger.debug("Attaching events:");
        this.#addDefaultEvents();
        this.#attachEvents();

        logger.debug("Attaching commands:");
        await this.#addDefaultCommands();
        await this.#attachCommandsHandler();
        await this.#publishCommands();

        logger.debug("Connecting to database:");
        await this.#connectToDatabase();

        logger.debug("Logging in to Discord:");
        await this.#login();
    }
}