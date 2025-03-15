import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const whitelistPath = join(__dirname, '../datas/whitelists.json');

export function getWhitelist() {
    try {
        const data = JSON.parse(readFileSync(whitelistPath, 'utf8'));
        return {
            users: Array.isArray(data.users) ? data.users : [],
            guilds: Array.isArray(data.guilds) ? data.guilds : []
        };
    } catch {
        return { users: [], guilds: [] };
    }
}

export const data = new SlashCommandBuilder()
    .setName('whitelists')
    .setDescription('Manage the whitelist')
    .addSubcommand(subcommand => 
        subcommand.setName('show')
            .setDescription('Show the current whitelist')
            .addStringOption(option => 
                option.setName('type')
                    .setDescription('Type of whitelist to show')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Users', value: 'users' },
                        { name: 'Guilds', value: 'guilds' }
                    )
    ));

export async function execute(interaction) {
    if (!config.ownerId.includes(interaction.user.id)) {
        return await interaction.reply({ 
            content: 'Only the bot owner can use this command.', 
            ephemeral: true 
        });
    }

    const whitelist = getWhitelist();
    const type = interaction.options.getString('type');
    const list = type === 'users' ? whitelist.users : whitelist.guilds;

    const itemsPerPage = 4;
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const pageDetails = await fetchPageDetails(interaction.client, type, list, 0, itemsPerPage);
    const navigationRow = createNavigationButtons(0, totalPages);

    await interaction.reply({
        content: pageDetails.content,
        components: totalPages > 1 ? [navigationRow] : [],
        ephemeral: true
    });
}

export async function fetchPageDetails(client, type, list, page, itemsPerPage) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = list.slice(startIndex, endIndex);

    let content = `**Whitelisted ${type.toUpperCase()}** (Page ${page + 1}):\n\n`;

    if (type === 'users') {
        for (const userId of pageItems) {
            try {
                const user = await client.users.fetch(userId);
                content += `â€¢ ID: \`${userId}\` [\`${user.username}\`]\n`;
            } catch {
                content += `â€¢ ID: \`${userId}\` [Unable to fetch user]\n`;
            }
        }
    } else {
        for (const guildId of pageItems) {
            try {
                const guild = await client.guilds.fetch(guildId);
                content += `â€¢ ID: \`${guildId}\` [\`${guild.name}\`]\n`;
            } catch {
                content += `â€¢ ID: \`${guildId}\` [Unable to fetch guild]\n`;
            }
        }
    }

    return { content, type, list, page };
}

export function createNavigationButtons(currentPage, totalPages) {
    const prevButton = new ButtonBuilder()
        .setCustomId(`whitelist_prev_${currentPage}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0);

    const nextButton = new ButtonBuilder()
        .setCustomId(`whitelist_next_${currentPage}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === totalPages - 1);

    return new ActionRowBuilder().addComponents(prevButton, nextButton);
}

export async function handleWhitelistNavigation(interaction) {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    if (!customId.startsWith('whitelist_prev_') && !customId.startsWith('whitelist_next_')) return;

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