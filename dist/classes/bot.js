import { AutocompleteInteraction, ChatInputCommandInteraction, Client, REST, Routes } from "discord.js";
import mongoose from "mongoose";
import { HandlerManager } from "./handler_manager.js";
import { CooldownManager } from "./cooldown_manager.js";
import { Logger } from "./logger.js";
import defaultCommands from "../defaults/commands/index.js";
import defaultEvents from "../defaults/events/index.js";
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
        stores: {},
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
    constructor({ clientOptions, options }) {
        this.configMap.set('token', options.token);
        this.configMap.set('clientId', options.clientId);
        this.configMap.set('mongoUri', options.mongoUri);
        this.createLogger();
        this.client = new Client(clientOptions);
    }
    addCommandHandler(command) {
        if (this.commandMap.has(command.cName))
            throw new Error(`Command with name ${command.cName} already exists`);
        this.commandMap.addHandler(command);
        this.cooldownManager.addCommand(command.cName, command.cooldown);
    }
    addCommands(commands) {
        for (const command of commands)
            this.addCommandHandler(command);
    }
    addEventHandler(event) {
        if (this.eventMap.has(event.hName))
            throw new Error(`Event with handler name ${event.hName} already exists under event ${event.eName}`);
        this.eventMap.addHandler(event);
    }
    addEvents(events) {
        for (const event of events)
            this.addEventHandler(event);
    }
    addHook(hook) {
        if (this.hooks.has(hook.hName))
            throw new Error(`Hook with name ${hook.hName} already exists`);
        this.hooks.addHandler(hook);
    }
    addHooks(hooks) {
        for (const hook of hooks)
            this.addHook(hook);
    }
    addStore(store) {
        if (this.database.stores[store.name])
            throw new Error(`Store with name ${store.name} already exists`);
        this.database.stores[store.name] = store;
    }
    addStores(stores) {
        for (const store of stores)
            this.addStore(store);
    }
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
    addDefaultEvents() {
        logger.debug("Adding default events...");
        for (const event of defaultEvents)
            this.addEventHandler(event);
        logger.debug(`Added ${defaultEvents.length} default events.`);
    }
    createLogger() {
        global.logger = new Logger({
            level: 'info',
            filePath: 'bot.log',
            customStreams: []
        });
        logger.debug("Logger initialized.");
    }
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
    async addDefaultCommands() {
        logger.debug("Adding default commands...");
        for (const command of defaultCommands)
            this.addCommandHandler(command);
        logger.debug(`Added ${defaultCommands.length} default commands.`);
    }
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
    async start() {
        if (!this.configMap.has('token')) {
            throw new Error('Token is not set in the configuration');
        }
        logger.debug("Attaching events:");
        this.addDefaultEvents();
        this.attachEvents();
        logger.debug("Attaching commands:");
        await this.addDefaultCommands();
        await this.attachCommandsHandler();
        await this.publishCommands();
        logger.debug("Connecting to database:");
        await this.connectToDatabase();
        logger.debug("Logging in to Discord:");
        await this.login();
    }
}
