import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js";
import ms from "ms";

export class CommandHandler {
    _cName;
    _handler;
    _builder;
    _description;
    _category;
    _cooldown;

    constructor({ 
        handler, 
        cName, 
        builder, 
        description = '', 
        category = 'General', 
        cooldown = [1, 1] 
    }) {
        this.handler = handler;
        this.cName = cName;
        this.builder = builder;
        this.description = description;
        this.category = category;
        this.cooldown = cooldown;
    }

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

    set handler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }
        this._handler = handler;
    }

    set cName(name) {
        if (typeof name !== 'string') {
            throw new TypeError('Command name must be a string');
        }
        this._cName = name;
    }

    set builder(builder) {
        if (!(builder instanceof SlashCommandBuilder)) {
            throw new TypeError('Builder must be an instance of SlashCommandBuilder');
        }
        this._builder = builder;
    }

    set description(desc) {
        if (typeof desc !== 'string') {
            throw new TypeError('Description must be a string');
        }
        this._description = desc;
    }

    set category(cat) {
        if (typeof cat !== 'string') {
            throw new TypeError('Category must be a string');
        }
        this._category = cat;
    }

    set cooldown(cooldown) {
        if (!Array.isArray(cooldown) || cooldown.length !== 2 || typeof cooldown[0] !== 'number' || typeof cooldown[1] !== 'number') {
            throw new TypeError('Cooldown must be an array of the format [limitPerPeriod, periodInSeconds]');
        }
        this._cooldown = cooldown;
    }

    get handler() {
        return this._handler;
    }

    get cName() {
        return this._cName;
    }

    get builder() {
        return this._builder;
    }

    get description() {
        return this._description;
    }

    get category() {
        return this._category;
    }

    get cooldown() {
        return this._cooldown;
    }
}