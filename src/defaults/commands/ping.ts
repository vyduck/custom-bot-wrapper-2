import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CommandHandler } from "../../classes/handlers/command_handler.js";

export default new CommandHandler({
    cName: "ping",
    description: "Check the bot's latency.",
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bot's latency."),
    category: "General",
    cooldown: [1, 3],
    handler: async function (context, interaction) {
        const sent = await interaction.editReply({ content: "Pinging..." });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setTitle("Pong! 🏓")
            .addFields(
                { name: "Bot Latency", value: `${latency}ms`, inline: true },
                { name: "API Latency", value: `${interaction.client.ws.ping}ms`, inline: true }
            )
            .setColor(0x57F287);
        await interaction.editReply({ content: null, embeds: [embed] });
    }
});