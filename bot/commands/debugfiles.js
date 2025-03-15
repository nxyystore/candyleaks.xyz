import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const data = new SlashCommandBuilder()
    .setName('debugfiles')
    .setDescription('Debug file reading and structure');

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const paths = [
        { name: 'Current Directory', path: process.cwd() },
        { name: 'Parent Directory', path: path.join(process.cwd(), '..') },
        { name: 'Command Directory', path: __dirname },
        { name: 'Command Parent', path: path.join(__dirname, '..') }
    ];
    
    let response = "File System Debug:\n";
    
    for (const dir of paths) {
        response += `\nðŸ“ ${dir.name}: ${dir.path}`;
    }
    
    response += "\n\nðŸ“„ Redemptions file content:";
    
    const possiblePaths = [
        path.join(process.cwd(), 'botdata/redemptions.json'),
        path.join(process.cwd(), '../botdata/redemptions.json'),
        path.join(__dirname, '../botdata/redemptions.json')
    ];
    
    for (const filePath of possiblePaths) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            response += `\n\nFound at: ${filePath}\nContent:\n\`\`\`json\n${content}\n\`\`\``;
            break;
        } catch (err) {
            response += `\nNot found at: ${filePath}`;
        }
    }
    
    await interaction.editReply(response);
}