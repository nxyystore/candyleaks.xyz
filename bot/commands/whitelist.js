import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { config } from '../config.js';

const whitelistPath = join(__dirname, '../datas/whitelists.json');

function getWhitelist() {
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

function saveWhitelist(data) {
    const safeData = {
        users: Array.isArray(data.users) ? data.users : [],
        guilds: Array.isArray(data.guilds) ? data.guilds : []
    };
    writeFileSync(whitelistPath, JSON.stringify(safeData, null, 4));
}

export const data = new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Manage the whitelist')
    .addSubcommand(subcommand => 
        subcommand.setName('add')
            .setDescription('Add a user or guild to the whitelist')
            .addUserOption(option => option.setName('user').setDescription('User to whitelist'))
            .addStringOption(option => option.setName('guild').setDescription('Guild ID to whitelist'))
    );

    export async function execute(interaction) {
        if (!config.ownerId.includes(interaction.user.id)) {
            return await interaction.reply({ 
                content: 'Only the bot owner can use this command.', 
                ephemeral: true 
            });
        }
    
        const user = interaction.options.getUser('user');
        const guildId = interaction.options.getString('guild');
        if (!user && !guildId) {
            return await interaction.reply({ 
                content: 'You must specify at least a user or a guild to whitelist.', 
                ephemeral: true 
            });
        }
    
        const whitelist = getWhitelist();
    
        let responseMessage = 'Added to whitelist:\n';
        let added = false;
    
        if (user) {
            if (!whitelist.users.includes(user.id)) {
                whitelist.users.push(user.id);
                added = true;
            }
            responseMessage += `\`${user.id}\` : [\`${user.username}\`]\n`;
        }
    
        if (guildId) {
            if (!whitelist.guilds.includes(guildId)) {
                whitelist.guilds.push(guildId);
                added = true;
            }
            
            try {
                const guild = await interaction.client.guilds.fetch(guildId);
                responseMessage += `\`${guildId}\` : [\`${guild.name}\`]\n`;
            } catch {
                responseMessage += `\`${guildId}\` : [Unable to fetch guild name]\n`;
            }
        }
    
        if (added) {
            saveWhitelist(whitelist);
        }
    
        await interaction.reply({ 
            content: responseMessage, 
            ephemeral: true 
        });
    }