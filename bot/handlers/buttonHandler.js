import { createKeyModal } from '../utils/modalCreator.js';
import { loadAutoPingData, saveAutoPingData, startAutoPing } from '../utils/autoPingUtils.js';
import { trackRedemption } from '../utils/redemptionTracker.js';
import { getWhitelist, fetchPageDetails, createNavigationButtons } from '../commands/wllist.js'; // Import from your whitelist command file

export async function handleButton(interaction) {
    const { customId } = interaction;

    try {
        switch(true) {
            case customId === 'redeem_key':
                await trackRedemption(interaction.guild.id);
                
                const modal = createKeyModal();
                await interaction.showModal(modal);
                break;

            case customId.startsWith('confirm_ping_'):
                await handleAutoPingConfirm(interaction);
                break;

            case customId.startsWith('whitelist_prev_'):
            case customId.startsWith('whitelist_next_'):
                await handleWhitelistNavigation(interaction);
                break;

            default:
                console.warn(`Unknown button interaction: ${customId}`);
                await interaction.reply({ 
                    content: "âŒ Unknown button interaction!", 
                    ephemeral: true 
                });
                break;
        }
    } catch (error) {
        console.error('Error handling button interaction:', error);
        await interaction.reply({ 
            content: "âŒ An error occurred while processing your request.", 
            ephemeral: true 
        });
    }
}

async function handleWhitelistNavigation(interaction) {
    const customId = interaction.customId;
    const currentPage = parseInt(customId.split('_')[2]);
    const isNextPage = customId.startsWith('whitelist_next_');

    const whitelist = getWhitelist();
    const selectedType = interaction.message.content.includes('Users') ? 'users' : 'guilds';
    const list = selectedType === 'users' ? whitelist.users : whitelist.guilds;

    const itemsPerPage = 4;
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const newPage = isNextPage ? currentPage + 1 : currentPage - 1;

    const pageDetails = await fetchPageDetails(interaction.client, selectedType, list, newPage, itemsPerPage);

    const navigationRow = createNavigationButtons(newPage, totalPages);

    await interaction.update({
        content: pageDetails.content,
        components: [navigationRow],
        ephemeral: true
    });
}

async function handleAutoPingConfirm(interaction) {
    await interaction.deferUpdate();
    const interval = parseInt(interaction.customId.split('_')[2]);
    const channel = interaction.channel;
    const autoPingData = loadAutoPingData();
    autoPingData[channel.id] = { interval };
    saveAutoPingData(autoPingData);
    startAutoPing(channel, interval);

    await interaction.editReply({
        content: `Auto-ping started in <#${channel.id}> with an interval of ${interval} minute(s).`,
        embeds: [],
        components: []
    });
}