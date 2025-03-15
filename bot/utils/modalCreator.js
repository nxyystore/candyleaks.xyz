// utils/modalCreator.js
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export function createKeyModal() {
    const modal = new ModalBuilder()
        .setCustomId('key_modal')
        .setTitle('Redeem VIP Key');

    const keyInput = new TextInputBuilder()
        .setCustomId('key_input')
        .setLabel('Enter your VIP key')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(keyInput);

    modal.addComponents(actionRow);

    return modal;
}