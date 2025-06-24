import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CommandHandler } from "../../classes/handlers/command_handler.js";
import ms from "ms";
export default new CommandHandler({
    cName: "stats",
    description: "Show various statistics about the bot.",
    builder: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Show various statistics about the bot."),
    category: "General",
    cooldown: [1, 5],
    handler: async function (context, interaction) {
        const client = context.client;
        const uptime = ms(client.uptime, { long: true });
        const guildCount = client.guilds.cache.size;
        const ping = client.ws.ping;
        const embed = new EmbedBuilder()
            .setTitle("Bot Statistics")
            .setColor(0x5865F2)
            .addFields({ name: "Servers", value: `${guildCount}`, inline: true }, { name: "Uptime", value: uptime, inline: true }, { name: "Ping", value: `${ping}ms`, inline: true })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
});
