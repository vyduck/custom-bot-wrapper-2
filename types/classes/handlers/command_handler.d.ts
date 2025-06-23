import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { AutocompleteCommandContext, ChatInputCommandContext } from "../../interfaces/context.js";
import { Handler } from "./handler.js";
export type AutocompleteCallback = (context: AutocompleteCommandContext, interaction: AutocompleteInteraction) => Promise<any> | any;
export type ChatInputCallback = (context: ChatInputCommandContext, interaction: ChatInputCommandInteraction) => Promise<any> | any;
/**
 * CommandHandler class for managing individual Discord slash commands.
 * Extends the base Handler class.
 */
export declare class CommandHandler extends Handler<ChatInputCallback> {
    builder: SlashCommandBuilder;
    description: string;
    category: string;
    cooldown: [number, number];
    autocomplete: Function;
    constructor({ handler, cName, builder, description, category, cooldown, autocomplete }: {
        handler: ChatInputCallback;
        cName: string;
        builder: SlashCommandBuilder;
        description?: string;
        category?: string;
        cooldown?: [number, number];
        autocomplete?: AutocompleteCallback | null;
    });
    execute(context: ChatInputCommandContext, interaction: ChatInputCommandInteraction): Promise<void>;
    get cName(): string;
}
