import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get instructions on how to set up the keygen bot.');

export async function execute(interaction) {
    if (!interaction.guild) {
        return await interaction.reply({ 
            content: 'This command can only be used in a server.', 
            ephemeral: true 
        });
    }
    const guildId = interaction.guild.id;
    const embed = new EmbedBuilder()
        .setDescription(
            `# How to setup the keygen bot? \n` +
            `- [Setup Link](https://${config.domainname}/gen?serverid=${guildId})\n` +
            `- Use the command </send:1333896868802990301> to send the embed.\n` +
            `- Example usage for this server is:\n` +
            `-# </send:1333896868802990301> button_url: https://${config.domainname}/gen?serverid=${guildId}\n` +
            `# How to use Auto ping?\n` +
            `- Use the command </auto ping:1334990428960981064> with interval (min 1 max 30 minutes.)\n` +
            `# How to stop auto ping?\n` +
            `- Use the command </auto stop:1334990428960981064>` +
            `# How to setup custom Logs?\n` +
            `- Use the command </setlog:1335693569305874605>\n` +
            `-# After that select the message you want to edit.`
        )
        .setColor(0x2f3136); 

    // Send the embed
    return await interaction.reply({ 
        embeds: [embed], 
        ephemeral: true 
    });
}