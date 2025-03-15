import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { handleSelect, handleButton } from '../handlers/logsHandler.js';

export const data = new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Configure custom log messages for VIP system');

export async function execute(interaction) {
    if (!interaction.guild) {
        return await interaction.reply({ 
            content: 'This command can only be used in a server.', 
            ephemeral: true 
        });
    }

    const embed = new EmbedBuilder()
        .setDescription(
            `# Log Message Configuration\n\n` +
            `Available variables:\n` +
            `â€¢ {user.name} - Member's username\n` +
            `â€¢ {user.mention} - Member's mention\n` +
            `â€¢ {client.username} - Bot's username\n` +
            `â€¢ {client.mention} - Bot's mention\n` +
            `â€¢ {role.name} - VIP role name\n` +
            `â€¢ {role.mention} - VIP role mention\n` +
            `â€¢ {generator.channel} - Key generator channel mention\n` +
            `â€¢ {guild.name} - Server name`
        )
        .setColor(0x2f3136);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('log_type_select')
        .setPlaceholder('Select message type to configure')
        .addOptions([
            {
                label: 'Success Message',
                description: 'Message shown when VIP access is granted',
                value: 'success_message',
                emoji: 'âœ…'
            },
            {
                label: 'Failed Message',
                description: 'Message shown when key validation fails',
                value: 'failed_message',
                emoji: 'âŒ'
            },
            {
                label: 'Expired Message',
                description: 'Message shown when VIP access expires',
                value: 'expired_message',
                emoji: 'â°'
            }
        ]);

    const button = new ButtonBuilder()
        .setCustomId('view_messages')
        .setLabel('View Current Messages')
        .setStyle(ButtonStyle.Secondary);

    const selectRow = new ActionRowBuilder().addComponents(selectMenu);
    const buttonRow = new ActionRowBuilder().addComponents(button);
    return await interaction.reply({
        embeds: [embed],
        components: [selectRow, buttonRow],
        ephemeral: true
    });
}

export async function handleInteraction(interaction) {
    if (interaction.isStringSelectMenu() && interaction.customId === 'log_type_select') {
        await handleSelect(interaction);
    } else if (interaction.isButton() && interaction.customId === 'view_messages') {
        await handleButton(interaction);
    }
}