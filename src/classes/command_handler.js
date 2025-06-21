import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import { Handler } from "./handler.js";

/**
 * CommandHandler class for managing individual Discord slash commands.
 * Extends the base Handler class.
 */
export class CommandHandler extends Handler {
    /** @type {SlashCommandBuilder} */
    _builder;
    /** @type {string} */
    _description;
    /** @type {string} */
    _category;
    /** @type {[number, number]} */
    _cooldown;

    /**
     * Create a new CommandHandler.
     * @param {Object} options
     * @param {Function} options.handler - The function to execute for this command.
     * @param {string} options.cName - Command name.
     * @param {SlashCommandBuilder} options.builder - Slash command builder.
     * @param {string} [options.description] - Command description.
     * @param {string} [options.category] - Command category.
     * @param {[number, number]} [options.cooldown] - Cooldown as [limit, seconds].
     */
    constructor({ 
        handler, 
        cName, 
        builder, 
        description = '', 
        category = 'General', 
        cooldown = [1, 1] 
    }) {
        super({
            eName: cName,
            hName: cName,
            handler: handler
        })
        this.builder = builder;
        this.description = description;
        this.category = category;
        this.cooldown = cooldown;
    }

    /**
     * Execute the command, handling cooldowns and errors.
     * @param {Object} context - Command context.
     * @param {ChatInputCommandInteraction} interaction - Discord interaction.
     * @returns {Promise<void>}
     */
    async execute(context, interaction) {
        if (!(interaction instanceof ChatInputCommandInteraction)) {
            throw new Error('Interaction is not a command');
        }

        const { cooldownManager, logger } = context;
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const key = `${this.cName}:${guildId}:${userId}`;

        let cooldown = cooldownManager.check(key);
        if (cooldown) {
            await interaction.reply({
                embeds: [
                    {
                        title: "Cooldown",
                        description: `You are on cooldown for the command \`${this.cName}\`. Please wait \`${ms(cooldown)}\` before using it again.`,
                        color: 0xFF0000
                    }
                ],
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await interaction.deferReply();
        try {
            await this.handler(
                {
                    command: this,
                    ...context
                },
                interaction
            );
        } catch (error) {
            logger.error(`Error executing command ${this.cName}: ${error.message}`);
            await interaction.editReply({
                embeds: [
                    {
                        title: "Error",
                        description: `An error occurred while executing the command \`${this.cName}\`. Please try again later.`,
                        color: 0xFF0000
                    }
                ]
            });
        }
    }

    /**
     * Set the SlashCommandBuilder for this command.
     * @param {SlashCommandBuilder} builder
     */
    set builder(builder) {
        if (!(builder instanceof SlashCommandBuilder)) {
            throw new TypeError('Builder must be an instance of SlashCommandBuilder');
        }
        this._builder = builder;
    }

    /**
     * Set the description for this command.
     * @param {string} desc
     */
    set description(desc) {
        if (typeof desc !== 'string') {
            throw new TypeError('Description must be a string');
        }
        this._description = desc;
    }

    /**
     * Set the category for this command.
     * @param {string} cat
     */
    set category(cat) {
        if (typeof cat !== 'string') {
            throw new TypeError('Category must be a string');
        }
        this._category = cat;
    }

    /**
     * Set the cooldown for this command.
     * @param {[number, number]} cooldown
     */
    set cooldown(cooldown) {
        if (!Array.isArray(cooldown) || cooldown.length !== 2 || typeof cooldown[0] !== 'number' || typeof cooldown[1] !== 'number') {
            throw new TypeError('Cooldown must be an array of the format [limitPerPeriod, periodInSeconds]');
        }
        this._cooldown = cooldown;
    }

    /**
     * Get the command name.
     * @returns {string}
     */
    get cName() {
        return this.eName;
    }

    /**
     * Get the SlashCommandBuilder.
     * @returns {SlashCommandBuilder}
     */
    get builder() {
        return this._builder;
    }

    /**
     * Get the command description.
     * @returns {string}
     */
    get description() {
        return this._description;
    }

    /**
     * Get the command category.
     * @returns {string}
     */
    get category() {
        return this._category;
    }

    /**
     * Get the command cooldown.
     * @returns {[number, number]}
     */
    get cooldown() {
        return this._cooldown;
    }
}