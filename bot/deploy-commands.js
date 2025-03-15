import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function deployCommands() {
  try {
    const commands = [];
    const commandsPath = join(__dirname, 'commands');

    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const { data } = await import(`./commands/${file}`);
      if (data) commands.push(data.toJSON());
    }
    const rest = new REST({ version: '10' }).setToken(config.token);
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

    console.log('Successfully registered application (/) commands.');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}