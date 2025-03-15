import { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'botdata', 'server_settings.json');

export async function handleSelect(interaction) {
    const messageType = interaction.values[0];
    let modalTitle, placeholder;

    switch (messageType) {
        case 'success_message':
            modalTitle = 'Set Success Message';
            placeholder = '<:heart:1338127619840802888> {user.mention} Your **Key** is valid, You have been granted VIP access for `60 minutes`  <:melek:1346508024327442493>';
            break;
        case 'failed_message':
            modalTitle = 'Set Failed Message';
            placeholder = 'âŒ Invalid or already used key. Please generate a new one.';
            break;
        case 'expired_message':
            modalTitle = 'Set Expired Message';
            placeholder = '<:alertt:1346508311473950740> {user.mention} your VIP role has expired. Please generate a new **Key**.<:melek:1346508024327442493>';
            break;
    }

    const modal = new ModalBuilder()
        .setCustomId(`${messageType}_modal`)
        .setTitle(modalTitle);

    const messageInput = new TextInputBuilder()
        .setCustomId('message_input')
        .setLabel('Enter your custom message')
        .setStyle(TextInputStyle.Paragraph) 
        .setMinLength(1)
        .setMaxLength(2000)
        .setPlaceholder(placeholder)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(messageInput);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
}

export async function handleButton(interaction) {
    try {
        const defaultMessages = {
            success: "<:heart:1338127619840802888> {user.mention} Your **Key** is valid, You have been granted VIP access for `60 minutes`  <:melek:1346508024327442493>",
            failed: "âŒ Invalid or already used key. Please generate a new one.",
            expired: "<:alertt:1346508311473950740> {user.mention} your VIP role has expired. Please generate a new **Key**.<:melek:1346508024327442493>"
        };

        let settings = {};
        try {
            const data = await fs.readFile(filePath, 'utf8');
            settings = JSON.parse(data);
        } catch (error) {
        }

        const guildSettings = {
            success: settings[interaction.guildId]?.logMessages?.success || defaultMessages.success,
            failed: settings[interaction.guildId]?.logMessages?.failed || defaultMessages.failed,
            expired: settings[interaction.guildId]?.logMessages?.expired || defaultMessages.expired
        };

        const embed = new EmbedBuilder()
            .setDescription(
                `# Current Log Messages\n\n` +
                `**âœ… Success Message**\n${guildSettings.success}\n\n` +
                `**âŒ Failed Message**\n${guildSettings.failed}\n\n` +
                `**â° Expired Message**\n${guildSettings.expired}`
            )
            .setColor(0x2f3136);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error('Error reading server settings:', error);
        await interaction.reply({
            content: 'Error retrieving current messages.',
            ephemeral: true
        });
    }
}

export async function handleModalSubmission(interaction) {
    const customId = interaction.customId;
    const guildId = interaction.guildId;
    const newMessage = interaction.fields.getTextInputValue('message_input');

    try {
        let settings = {};
        try {
            const data = await fs.readFile(filePath, 'utf8');
            settings = JSON.parse(data);
        } catch (error) {
        }

        if (!settings[guildId]) settings[guildId] = {};
        if (!settings[guildId].logMessages) settings[guildId].logMessages = {};

        const messageTypeMap = {
            'success_message_modal': 'success',
            'failed_message_modal': 'failed',
            'expired_message_modal': 'expired'
        };

        const messageType = messageTypeMap[customId];
        if (!messageType) {
            throw new Error('Invalid modal customId');
        }

        settings[guildId].logMessages[messageType] = newMessage;

        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(settings, null, 2));

        await interaction.reply({
            content: `âœ… Successfully updated the ${customId.replace('_modal', '').replace('_', ' ')}!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error saving server settings:', error);
        await interaction.reply({
            content: 'âŒ Error saving the message. Please try again.',
            ephemeral: true
        });
    }
}