import { AutocompleteInteraction, ChatInputCommandInteraction, Client, REST, Routes } from "discord.js";
import mongoose from "mongoose";
import { HandlerManager } from "./handler_manager.js";
import { CooldownManager } from "./cooldown_manager.js";
import { Logger } from "./logger.js";
/**
 * Bot class for managing the Discord bot instance.
 * It handles commands, events, hooks, and database connections.
 * It also provides methods to add command handlers, event handlers, and hooks.
 * It initializes the Discord client and connects to the MongoDB database.
 * It also provides methods to start the bot, attach events, and publish commands.
 */
export class Bot {
    client;
    cooldownManager = new CooldownManager();
    configMap = new Map();
    commandMap = new HandlerManager('command');
    eventMap = new HandlerManager('event');
    hooks = new HandlerManager('hook');
    get logger() {
        if (!logger)
            this.createLogger();
        return global.logger;
    }
    database = {
        stores: new Map(),
        connection: null
    };
    get baseContext() {
        return {
            commandMap: this.commandMap,
            configMap: this.configMap,
            database: this.database.stores,
            client: this.client,
            cooldownManager: this.cooldownManager
        };
    }
    /**
     * Creates an instance of the Bot class.
     */
    constructor({ clientOptions, options }) {
        this.configMap.set('token', options.token);
        this.configMap.set('clientId', options.clientId);
        this.configMap.set('mongoUri', options.mongoUri);
        this.createLogger(options.customStreams);
        this.client = new Client(clientOptions);
    }
    /**
     * Adds a command handler to the bot.
     */
    addCommandHandler(command) {
        if (this.commandMap.has(command.cName))
            throw new Error(`Command with name ${command.cName} already exists`);
        this.commandMap.addHandler(command);
        this.cooldownManager.addCommand(command.cName, command.cooldown);
    }
    /**
     * Adds multiple command handlers to the bot.
     */
    addCommands(commands) {
        for (const command of commands)
            this.addCommandHandler(command);
    }
    /**
     * Adds an event handler to the bot.
     */
    addEventHandler(event) {
        if (this.eventMap.has(event.hName))
            throw new Error(`Event with handler name ${event.hName} already exists under event ${event.eName}`);
        this.eventMap.addHandler(event);
    }
    /**
     * Adds multiple event handlers to the bot.
     */
    addEvents(events) {
        for (const event of events)
            this.addEventHandler(event);
    }
    /**
     * Adds a hook handler to the bot.
     */
    addHook(hook) {
        if (this.hooks.has(hook.hName))
            throw new Error(`Hook with name ${hook.hName} already exists`);
        this.hooks.addHandler(hook);
    }
    /**
     * Adds multiple hook handlers to the bot.
     */
    addHooks(hooks) {
        for (const hook of hooks)
            this.addHook(hook);
    }
    /**
     * Adds a store to the bot's database.
     */
    addStore(store) {
        this.database.stores.set(store.name, store);
    }
    /**
     * Adds multiple stores to the bot's database.
     */
    addStores(stores) {
        for (const store of stores)
            this.addStore(store);
    }
    /**
     * Attaches all event handlers to the Discord client.
     * It also runs pre-event and post-event hooks.
     */
    attachEvents() {
        const allEvents = Array.from(this.eventMap.handlers.keys());
        for (const event of allEvents) {
            this.client.on(event, async (...args) => {
                // Prepare context
                let context = {
                    event,
                    ...this.baseContext,
                    hookContext: {}
                };
                // Run pre-event hooks
                const hookResults = await this.hooks.trigger(`pre-event`, context, ...args);
                // Attach output of hooks to context
                context.hookContext = hookResults;
                // Execute the event handler
                try {
                    await this.eventMap.trigger(event, context, ...args);
                }
                catch (error) {
                    logger.error(`Error executing event ${event}: ${error.message}`);
                }
                // Run post-event hooks
                await this.hooks.trigger(`post-event`, context, ...args);
            });
        }
        logger.debug(`Attached ${allEvents.length} events.`);
    }
    /**
     * Creates a logger instance for the bot.
     * This method initializes the global logger with a file path and log level.
     */
    createLogger(customStreams = []) {
        global.logger = new Logger({
            level: 'info',
            filePath: 'bot.log',
            customStreams
        });
        logger.debug("Logger initialized.");
    }
    /**
     * Attaches command handlers to the Discord client.
     * It listens for interaction events and executes the appropriate command handler.
     */
    async attachCommandsHandler() {
        this.client.on('interactionCreate', async (interaction) => {
            if (!(interaction instanceof ChatInputCommandInteraction) &&
                !(interaction instanceof AutocompleteInteraction))
                return;
            const command = interaction.commandName;
            if (!this.commandMap.has(interaction.commandName))
                return;
            let context = {
                command,
                interaction,
                ...this.baseContext,
                hookContext: {},
            };
            if (interaction.isCommand()) {
                const hookResults = await this.hooks.trigger(`pre-command`, context, interaction);
                context.hookContext = hookResults;
                await this.commandMap.trigger(command, context, interaction);
                await this.hooks.trigger(`post-command`, context, interaction);
            }
            else if (interaction.isAutocomplete()) {
                context.autocomplete = interaction.options.getFocused(true);
                await this.commandMap.get(command).autocomplete(context, interaction);
            }
        });
    }
    /**
     * Publishes all commands to Discord.
     * This method uses the Discord REST API to register the commands.
     * It requires the bot's token and client ID from the configuration map.
     */
    async publishCommands() {
        logger.debug("Publishing commands to Discord...");
        const commands = this.commandMap.getAll().map(cmd => cmd.builder.toJSON());
        const rest = new REST({ version: '10' }).setToken(this.configMap.get('token'));
        try {
            logger.debug('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationCommands(this.configMap.get('clientId')), { body: commands });
            logger.debug('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            logger.error(`Error while publishing commands: ${error.message}`);
            throw new Error(`Failed to publish commands: ${error.message}`);
        }
        logger.debug(`Published ${commands.length} commands.`);
    }
    /**
     * Connects to the MongoDB database using Mongoose.
     * It retrieves the Mongo URI from the configuration map and establishes a connection.
     * If the connection fails, it logs an error and throws an exception.
     */
    async connectToDatabase() {
        if (!this.configMap.has('mongoUri'))
            throw new Error('Mongo URI is not set in the configuration');
        try {
            await mongoose.connect(this.configMap.get('mongoUri'));
            this.database.connection = mongoose.connection;
            logger.debug("Connected to MongoDB successfully.");
        }
        catch (error) {
            logger.error(`Failed to connect to MongoDB: ${error.message}`);
            throw new Error(`Database connection error: ${error.message}`);
        }
    }
    /**
     * Logs in to Discord using the bot's token.
     * It retrieves the token from the configuration map and calls the login method on the client.
     * If the login fails, it logs an error and throws an exception.
     */
    async login() {
        if (!this.configMap.has('token')) {
            throw new Error('Token is not set in the configuration');
        }
        try {
            await this.client.login(this.configMap.get('token'));
        }
        catch (error) {
            logger.error(`Failed to log in to Discord: ${error.message}`);
            throw new Error(`Login error: ${error.message}`);
        }
    }
    /**
     * Starts the bot by attaching events, commands, and connecting to the database.
     * It also logs in to Discord.
     * This method is the entry point for starting the bot.
     */
    async start() {
        if (!this.configMap.has('token')) {
            throw new Error('Token is not set in the configuration');
        }
        logger.debug("Attaching events:");
        this.attachEvents();
        logger.debug("Attaching commands:");
        await this.attachCommandsHandler();
        await this.publishCommands();
        logger.debug("Connecting to database:");
        await this.connectToDatabase();
        logger.debug("Logging in to Discord:");
        await this.login();
    }
}
