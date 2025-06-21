import { Client, IntentsBitField, REST, Routes } from "discord.js";
import mongoose from "mongoose";

import { CooldownManager } from "./cooldown_manager.js";
import { CommandHandler } from "./command_handler.js";
import { EventHandler } from "./event_handler.js";
import { Logger } from "./logger.js";
import { Store } from "../stores/store.js";

import defaultCommands from "../defaults/commands/index.js";
import defaultEvents from "../defaults/events/index.js";
import { HookManager } from "./hook.js";

export class Bot {
    client;
    cooldownManager = new CooldownManager();

    configMap = new Map();
    commandMap = new Map();
    eventMap = new Map();

    hooks = new HookManager(['pre-command', 'post-command', 'pre-event', 'post-event']);

    get logger() {
        if (!logger)
            this.#createLogger();
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
        }
    }

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

    addCommandHandler(command) {
        if (!(command instanceof CommandHandler)) {
            throw new TypeError('Command must be an instance of CommandHandler');
        }
        if (this.commandMap.has(command.cName)) {
            throw new Error(`Command with name ${command.cName} already exists`);
        }
        this.commandMap.set(command.cName, command);
        this.cooldownManager.addCommand(command.cName, command.cooldown);
    }

    addCommands(commands) {
        if (!Array.isArray(commands)) {
            throw new TypeError('Commands must be an array of CommandHandler instances');
        }
        for (const command of commands) {
            this.addCommandHandler(command);
        }
    }

    addEventHandler(event) {
        if (!(event instanceof EventHandler)) {
            throw new TypeError('Event must be an instance of EventHandler');
        }
        if (this.eventMap.has(event.hName)) {
            throw new Error(`Event with handler name ${event.hName} already exists`);
        }
        this.eventMap.set(event.hName, event);
    }

    addEvents(events) {
        if (!Array.isArray(events)) {
            throw new TypeError('Events must be an array of EventHandler instances');
        }
        for (const event of events) {
            this.addEventHandler(event);
        }
    }

    addStore(store) {
        if (!(store instanceof Store))
            throw new TypeError('Store must be an instance of Store');
        if (this.database.stores[store.name])
            throw new Error(`Store with name ${store.name} already exists`);
        this.database.stores[store.name] = store;
    }

    addStores(stores) {
        if (!Array.isArray(stores))
            throw new TypeError('Stores must be an array of Store instances');
        for (const store of stores)
            this.addStore(store);
    }

    #attachEvents() {
        for (const event of this.eventMap.values()) {
            logger.debug(`Attaching event: ${event.hName}`);
            this.client[event.once ? "once" : "on"](
                event.eName,
                async (...args) => {
                    let context = {
                        event,
                        ...this.baseContext
                    };
                    context.hookContext = await this.hooks.trigger(`pre-event`, context, ...args);
                    try {
                        logger.debug(`Executing event: ${event.hName}`);
                        event.execute(context, ...args)
                    } catch (error) {
                        logger.error(`Error executing event ${event.hName}: ${error.message}`);
                    }
                    await this.hooks.trigger(`post-event`, context, ...args)
                });
        }
        logger.debug(`Attached ${this.eventMap.size} events.`);
    }

    #addDefaultEvents() {
        logger.debug("Adding default events...");
        for (const event of defaultEvents)
            this.addEventHandler(event);
        logger.debug(`Added ${defaultEvents.length} default events.`);
    }

    #createLogger() {
        global.logger = new Logger({
            level: 'info',
            filePath: 'bot.log',
            customStreams: []
        });
        logger.debug("Logger initialized.");
    }

    async #attachCommandsHandler() {
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.commandMap.get(interaction.commandName);
            if (!command) return;

            let context = {
                command,
                interaction,
                ...this.baseContext
            };

            context.hookContext = await this.hooks.trigger(`pre-command`, context, interaction);
            logger.debug(`Executing command: ${command.cName}`);
            await command.execute(context, interaction);
            await this.hooks.trigger(`post-command`, context, interaction);
        });
    }

    async #addDefaultCommands() {
        logger.debug("Adding default commands...");
        for (const command of defaultCommands)
            this.addCommandHandler(command);
        logger.debug(`Added ${defaultCommands.length} default commands.`);
    }

    async #publishCommands() {
        logger.debug("Publishing commands to Discord...");
        const commands = Array.from(this.commandMap.values()).map(cmd => cmd.builder.toJSON());
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