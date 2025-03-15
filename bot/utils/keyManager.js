import { readFile, writeFile } from 'fs/promises';
import { config } from '../config.js';

export async function loadKeys() {
  try {
    const data = await readFile(config.keysFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function saveKeys(keys) {
  await writeFile(config.keysFile, JSON.stringify(keys, null, 2));
}

export async function validateKey(guildId, key) {
  const keys = await loadKeys();
  const guildKeys = keys[guildId] || [];
  
  const keyData = guildKeys.find(k => k.key === key && !k.used);
  
  if (keyData) {
    const expiryDate = new Date(keyData.expiresAt);
    if (expiryDate < new Date()) {
      return false;
    }
    return true; 
  }
  
  return false; 
}

export async function markKeyAsUsed(guildId, key) {
  const keys = await loadKeys();
  const guildKeys = keys[guildId] || [];
  const validKey = guildKeys.find(k => k.key === key && !k.used);
  if (validKey) {
    validKey.used = true;
    await saveKeys(keys);
    return true;
  }
  return false;
}