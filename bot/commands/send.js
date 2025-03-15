import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { createVerificationEmbed } from '../utils/embedCreator.js';

export const data = new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send the key verification embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('button_url')
            .setDescription('The URL for the button')
            .setRequired(true))
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Select the channel to send the embed')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true));

export async function execute(interaction) {
    if (!interaction.guild) {
        return await interaction.reply({ 
            content: 'This command can only be used in a server.', 
            ephemeral: true 
        });
    }

    const buttonUrl = interaction.options.getString('button_url');
    const targetChannel = interaction.options.getChannel('channel');

    await interaction.reply({ 
        content: 'Message sending to channel...', 
        ephemeral: true 
    });
    const { embed, components } = createVerificationEmbed(
        interaction.guild.id, 
        interaction.guild.name,
        buttonUrl 
    );
    await targetChannel.send({ 
        embeds: [embed], 
        components 
    });
}