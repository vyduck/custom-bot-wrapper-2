import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CommandHandler } from "../../index.js";
import { CustomPaginator } from "cdep";

import ms from "ms";

export default new CommandHandler({
    cName: "help",
    description: "List all available commands.",
    builder: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all available commands."),
    category: "General",
    cooldown: [1, 5],
    handler: async function (context, interaction) {
        const commands = Array.from(context.commandMap.getAll());

        new CustomPaginator(interaction, {
            items: commands,
            pagemaker: function (item: CommandHandler) {
                return new EmbedBuilder()
                    .setTitle(`Help: ${item.cName}`)
                    .setDescription(
                        `**Name:** ${item.cName}\n` +
                        `**Description:** ${item.description || "No description provided."}\n`
                    )
                    .setColor(0x5865F2)
                    .setFields([
                        {
                            name: "Category",
                            value: item.category || "General",
                            inline: true
                        },
                        {
                            name: "Cooldown",
                            value: `${item.cooldown[0]} time(s) every ${ms(item.cooldown[1] * 1000, { long: true })}`,
                            inline: true
                        }
                    ]);
            },
            customRowMaker: () => undefined,
            args: []
        });
    }
});