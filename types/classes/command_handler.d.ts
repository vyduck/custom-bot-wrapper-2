/**
 * CommandHandler class for managing individual Discord slash commands.
 * Extends the base Handler class.
 */
export class CommandHandler extends Handler {
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
    constructor({ handler, cName, builder, description, category, cooldown }: {
        handler: Function;
        cName: string;
        builder: SlashCommandBuilder;
        description?: string;
        category?: string;
        cooldown?: [number, number];
    });
    /** @type {SlashCommandBuilder} */
    _builder: SlashCommandBuilder;
    /** @type {string} */
    _description: string;
    /** @type {string} */
    _category: string;
    /** @type {[number, number]} */
    _cooldown: [number, number];
    /**
     * Set the SlashCommandBuilder for this command.
     * @param {SlashCommandBuilder} builder
     */
    set builder(builder: SlashCommandBuilder);
    /**
     * Get the SlashCommandBuilder.
     * @returns {SlashCommandBuilder}
     */
    get builder(): SlashCommandBuilder;
    /**
     * Set the description for this command.
     * @param {string} desc
     */
    set description(desc: string);
    /**
     * Get the command description.
     * @returns {string}
     */
    get description(): string;
    /**
     * Set the category for this command.
     * @param {string} cat
     */
    set category(cat: string);
    /**
     * Get the command category.
     * @returns {string}
     */
    get category(): string;
    /**
     * Set the cooldown for this command.
     * @param {[number, number]} cooldown
     */
    set cooldown(cooldown: [number, number]);
    /**
     * Get the command cooldown.
     * @returns {[number, number]}
     */
    get cooldown(): [number, number];
    /**
     * Execute the command, handling cooldowns and errors.
     * @param {Object} context - Command context.
     * @param {ChatInputCommandInteraction} interaction - Discord interaction.
     * @returns {Promise<void>}
     */
    execute(context: any, interaction: ChatInputCommandInteraction): Promise<void>;
    /**
     * Get the command name.
     * @returns {string}
     */
    get cName(): string;
}
import { Handler } from "./handler.js";
import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommandInteraction } from "discord.js";
