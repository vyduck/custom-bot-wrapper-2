import {
    SlashCommandBuilder,
    MessageFlags,
    ChatInputCommandInteraction,
    AutocompleteInteraction
} from "discord.js";

import ms from "ms";

import { 
    AutocompleteCommandContext, 
    ChatInputCommandContext 
} from "../../interfaces/context.js";

import { Handler } from "./index.js";
import { Logger } from "../index.js";

declare const logger: Logger

export type AutocompleteCallback = (context: AutocompleteCommandContext, interaction: AutocompleteInteraction) => Promise<any> | any;
export type ChatInputCallback = (context: ChatInputCommandContext, interaction: ChatInputCommandInteraction) => Promise<any> | any;

/**
 * CommandHandler class for managing individual Discord slash commands.
 * Extends the base Handler class.
 */
export class CommandHandler extends Handler<ChatInputCallback> {
    builder: SlashCommandBuilder;
    description: string;
    category: string;
    cooldown: [number, number];
    autocomplete: Function;

    constructor({
        handler,
        cName,
        builder,
        description = '',
        category = 'General',
        cooldown = [1, 1],
        autocomplete = null
    }: {
        handler: ChatInputCallback;
        cName: string;
        builder: SlashCommandBuilder;
        description?: string;
        category?: string;
        cooldown?: [number, number];
        autocomplete?: AutocompleteCallback | null;
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
        this.autocomplete = autocomplete;
    }

    async execute(context: ChatInputCommandContext, interaction: ChatInputCommandInteraction): Promise<void> {
        const { cooldownManager } = context;
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

    get cName(): string {
        return this.eName;
    }
}