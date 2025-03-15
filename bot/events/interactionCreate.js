import { Collection, Events } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { handleButton } from '../handlers/buttonHandler.js';
import { handleModal } from '../handlers/modalHandler.js';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const commands = new Collection();
const whitelistPath = join(__dirname, '../datas/whitelists.json');
const DEV_SERVER_ID = '1295100112283897987';

function isWhitelisted(userId, guildId) {
    try {
        if (config.ownerId.includes(userId)) {
            return true;
        }
        if (guildId === DEV_SERVER_ID) {
            return true;
        }

        const whitelist = JSON.parse(readFileSync(whitelistPath, 'utf8'));
        
        if (!whitelist.guilds.includes(guildId)) {
            return false;
        }
        return whitelist.users.includes(userId);
    } catch (error) {
        console.error("Error checking whitelist:", error);
        return false;
    }
}

async function loadCommands() {
    const commandsPath = join(__dirname, '..', 'commands');
    try {
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = await import(pathToFileURL(join(commandsPath, file)).href);
            if (command.data && command.execute) {
                commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.warn(`Command ${file} is missing "data" or "execute".`);
            }
        }
    } catch (error) {
        console.error('Error loading commands:', error);
    }
}

export const name = Events.InteractionCreate;

export async function execute(interaction) {
    try {
        if (interaction.isChatInputCommand()) {
            if (!isWhitelisted(interaction.user.id, interaction.guildId)) {
                return await interaction.reply({
                    content: 'You are not authorized to use this command in this server.',
                    ephemeral: true
                });
            }

            const command = commands.get(interaction.commandName);
            if (!command) {
                return await interaction.reply({
                    content: 'Command not found.',
                    ephemeral: true
                });
            }
            await command.execute(interaction);
        } 
        
        else if (interaction.isButton()) {
            if (interaction.customId === 'view_messages') {
                console.log('Handling view_messages button click');
                try {
                    const { handleButton: handleLogButton } = await import('../handlers/logsHandler.js');
                    await handleLogButton(interaction);
                } catch (error) {
                    console.error('Error handling view_messages button:', error);
                    await interaction.reply({
                        content: 'Error processing log messages button.',
                        ephemeral: true
                    });
                }
            } else {
                await handleButton(interaction);
            }
        } 
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'log_type_select') {
                console.log('Handling log_type_select menu selection');
                try {
                    const { handleSelect } = await import('../handlers/logsHandler.js');
                    await handleSelect(interaction);
                } catch (error) {
                    console.error('Error handling log_type_select menu:', error);
                    await interaction.reply({
                        content: 'Error processing log type selection.',
                        ephemeral: true
                    });
                }
            }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId.includes('_message_modal')) {
                console.log(`Handling modal submission: ${interaction.customId}`);
                try {
                    const { handleModalSubmission } = await import('../handlers/logsHandler.js');
                    await handleModalSubmission(interaction);
                } catch (error) {
                    console.error('Error handling log modal submission:', error);
                    await interaction.reply({
                        content: 'Error saving log message.',
                        ephemeral: true
                    });
                }
            } else {
                await handleModal(interaction);
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        try {
            const reply = { content: 'There was an error processing your request.', ephemeral: true };
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply(reply);
            } else if (interaction.replied) {
                await interaction.followUp(reply);
            }
        } catch (e) {
            console.error('Error sending error message:', e);
        }
    }
}

export { commands, loadCommands };