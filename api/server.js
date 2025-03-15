import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import crypto from 'crypto';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const KEYS_FILE = join(__dirname, '..', 'keys.json');
const VISITORS_FILE = join(__dirname, '..', 'botdata', 'visitors.json');

async function initializeKeysFile() {
  try {
    await readFile(KEYS_FILE);
  } catch {
    await writeFile(KEYS_FILE, JSON.stringify({}));
  }
}

async function initializeVisitorsFile() {
  try {
    await readFile(VISITORS_FILE);
  } catch {
    await writeFile(VISITORS_FILE, JSON.stringify({ visitors: [] }));
  }
}

function generateSecureKey() {
  return `CANDY-${crypto.randomBytes(32).toString('base64url').substring(0, 8).toUpperCase()}`;
}

app.post('/api/generateKey', async (req, res) => {
  try {
    const { guildId } = req.body;
    
    if (!guildId) {
      return res.status(400).json({ error: 'Missing guildId' });
    }

    const key = generateSecureKey();
    const keysData = JSON.parse(await readFile(KEYS_FILE, 'utf8'));
    
    if (!keysData[guildId]) {
      keysData[guildId] = [];
    }

    // Add new key with metadata
    keysData[guildId].push({
      key,
      createdAt: new Date().toISOString(),
      used: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      ip: req.ip // Store IP for tracking
    });

    await writeFile(KEYS_FILE, JSON.stringify(keysData, null, 2));
    
    res.json({ key });
  } catch (error) {
    console.error('Error generating key:', error);
    res.status(500).json({ error: 'Failed to generate key' });
  }
});

app.post('/api/trackVisitor', async (req, res) => {
  try {
    const { serverId } = req.body;
    
    if (!serverId) {
      return res.status(400).json({ error: 'Missing serverId' });
    }

    // Read current visitors data
    let visitorsData;
    try {
      const data = await readFile(VISITORS_FILE, 'utf8');
      visitorsData = JSON.parse(data);
    } catch (error) {
      visitorsData = { visitors: [] };
    }

    // Check if server already exists in visitors array
    const serverIndex = visitorsData.visitors.findIndex(v => v.serverId === serverId);
    
    if (serverIndex >= 0) {
      // Server exists, increment visitor count
      visitorsData.visitors[serverIndex].count += 1;
    } else {
      // Server doesn't exist, add new entry
      visitorsData.visitors.push({
        serverId,
        count: 1
      });
    }

    // Save updated visitors data
    await writeFile(VISITORS_FILE, JSON.stringify(visitorsData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// New endpoint to fetch server info
app.get('/api/server/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    
    if (!serverId) {
      return res.status(400).json({ error: 'Missing serverId' });
    }

    // Import the config directly instead of using require
    const { config } = await import('../bot/config.js');
    const token = process.env.BOT_TOKEN || process.env.DISCORD_BOT_TOKEN || config.token;

    // Use Discord bot token to fetch server info
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}`, {
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}: ${await response.text()}`);
    }

    const serverData = await response.json();
    
    // Return only the necessary data
    res.json({
      id: serverData.id,
      name: serverData.name,
      icon: serverData.icon ? `https://cdn.discordapp.com/icons/${serverId}/${serverData.icon}.png` : null
    });
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ error: 'Failed to fetch server info' });
  }
});

await initializeKeysFile();
await initializeVisitorsFile();
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});