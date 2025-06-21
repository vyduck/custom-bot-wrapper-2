import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CommandHandler } from "../../classes/command_handler.js";

export default new CommandHandler({
    cName: "invite",
    description: "Get the bot's invite link.",
    builder: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get the bot's invite link."),
    category: "General",
    cooldown: [1, 10],
    handler: async function (context, interaction) {
        const clientId = context.configMap.get("clientId");
        const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
        const embed = new EmbedBuilder()
            .setTitle("Invite Me!")
            .setDescription(`[Click here to invite the bot to your server.](${inviteUrl})`)
            .setColor(0x5865F2);
        await interaction.editReply({ embeds: [embed] });
    }
});