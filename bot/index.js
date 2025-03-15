import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands, execute as handleCommand } from './events/interactionCreate.js';
import { loadEvents } from './handlers/eventHandler.js';
import { deployCommands } from './deploy-commands.js';
import { config } from './config.js';
import 'dotenv/config';

if (!process.env.BOT_TOKEN && !process.env.DISCORD_BOT_TOKEN) {
  console.error('ERROR: Bot token not found! Please set BOT_TOKEN or DISCORD_BOT_TOKEN environment variable.');
  console.error('Current environment variables:', process.env);
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('ERROR: Client ID not found! Please set CLIENT_ID environment variable.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await deployCommands();
await loadCommands();
await loadEvents(client);

client.login(config.token);