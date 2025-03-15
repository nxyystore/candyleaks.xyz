import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get statistics about visitors, key redemptions, and verified members for your server.');

export async function execute(interaction) {
    if (!interaction.guild) {
        return await interaction.reply({ 
            content: 'This command can only be used in a server.', 
            ephemeral: true 
        });
    }

    try {
        const guildId = interaction.guild.id;
        const guildName = interaction.guild.name;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const visitorPaths = [
            path.join(process.cwd(), 'botdata/visitors.json'),
            path.join(process.cwd(), '../botdata/visitors.json'),
            path.join(__dirname, '../botdata/visitors.json'),
            path.join(__dirname, '../../botdata/visitors.json')
        ];

        const redemptionPaths = [
            path.join(process.cwd(), 'botdata/redemptions.json'),
            path.join(process.cwd(), '../botdata/redemptions.json'),
            path.join(__dirname, '../botdata/redemptions.json'),
            path.join(__dirname, '../../botdata/redemptions.json')
        ];
        async function loadJsonFile(paths) {
            for (const filePath of paths) {
                try {
                    console.log(`Trying path: ${filePath}`);
                    const fileContent = await fs.readFile(filePath, 'utf8');
                    console.log(`Found file at: ${filePath}`);
                    return JSON.parse(fileContent);
                } catch (err) {
                    console.log(`File not found at: ${filePath} (${err.code})`);
                }
            }
            return null;
        }
        const visitorsData = await loadJsonFile(visitorPaths);
        const redemptionsData = await loadJsonFile(redemptionPaths);
        let visitorCount = 0;
        if (visitorsData && visitorsData.visitors) {
            const serverStats = visitorsData.visitors.find(v => v.serverId === guildId);
            visitorCount = serverStats ? serverStats.count : 0;
        }
        let redemptionCount = 0;
        if (redemptionsData && redemptionsData.redemptions) {
            const serverRedemptions = redemptionsData.redemptions.find(r => r.serverId === guildId);
            redemptionCount = serverRedemptions ? serverRedemptions.count : 0;
        }
        let membersInRole = 0;
        let roleId = 'Unknown Role';

        const role = interaction.guild.roles.cache.find(r => r.name === config.verifyRoleName);
        if (role) {
            membersInRole = role.members.size;
            roleId = role.id;
        }

        const embed = new EmbedBuilder()
            .setDescription(
                `# ðŸ“Š STATS OF ${guildName} \n` + 
                `- ðŸŒ You have **${visitorCount}** visitors on your website of [\`${config.domainname}\`](https://${config.domainname}?serverid=${guildId}).\n` +
                `- ðŸ”‘ **${redemptionCount}** users who clicked redeem key.\n` +
                `- âœ… **${membersInRole}** users who have the <@&${roleId}> role.`
            )
            .setColor(0x2f3136)
            .setTimestamp();
        return await interaction.reply({ 
            embeds: [embed],
            ephemeral: false
        });

    } catch (error) {
        console.error('Error executing stats command:', error);
        return await interaction.reply({ 
            content: `An error occurred while fetching server statistics: ${error.message}`, 
            ephemeral: true 
        });
    }
}