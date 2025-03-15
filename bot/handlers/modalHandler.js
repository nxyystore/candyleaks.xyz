import { validateKey, markKeyAsUsed } from '../utils/keyManager.js';
import { config } from '../config.js';
import { EmbedBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

const roleTimeouts = new Map();
const settingsFilePath = path.join(process.cwd(), 'botdata', 'server_settings.json');

async function getCustomMessages(guildId) {
  const defaultMessages = {
    success: "<:heart:1338127619840802888> {user.mention} Your **Key** is valid, You have been granted VIP access for `60 minutes`  <:melek:1346508024327442493>",
    failed: "âŒ Invalid or already used key. Please generate a new one.",
    expired: "<:alertt:1346508311473950740> {user.mention} your VIP role has expired. Please generate a new **Key**.<:melek:1346508024327442493>",
    alreadyHasRole: "âŒ You already have the VIP role. Please wait for your current VIP access to expire before using another key."
  };

  try {
    const data = await fs.readFile(settingsFilePath, 'utf8');
    const settings = JSON.parse(data);
    
    return {
      success: settings[guildId]?.logMessages?.success || defaultMessages.success,
      failed: settings[guildId]?.logMessages?.failed || defaultMessages.failed,
      expired: settings[guildId]?.logMessages?.expired || defaultMessages.expired,
      alreadyHasRole: settings[guildId]?.logMessages?.alreadyHasRole || defaultMessages.alreadyHasRole
    };
  } catch (error) {
    console.error('Error reading custom messages:', error);
    return defaultMessages;
  }
}

function formatMessage(message, data) {
  return message
    .replace(/{user\.mention}/g, data.user)
    .replace(/{user\.name}/g, data.user.username)
    .replace(/{client\.username}/g, data.client.user.username)
    .replace(/{client\.mention}/g, data.client)
    .replace(/{role\.name}/g, data.role.name)
    .replace(/{role\.mention}/g, data.role)
    .replace(/{generator\.channel}/g, data.generatorChannel || '#key-generator')
    .replace(/{guild\.name}/g, data.guild.name);
}

export async function handleModal(interaction) {
  if (interaction.customId === 'key_modal') {
    const customMessages = await getCustomMessages(interaction.guildId);
    const logsChannel = interaction.guild.channels.cache.find(
      channel => channel.name === config.logsChannelName
    );
    
    // Check if user already has VIP role
    let vipRole = interaction.guild.roles.cache.find(r => r.name === config.vipRoleName);
    if (vipRole && interaction.member.roles.cache.has(vipRole.id)) {
      const messageData = {
        user: interaction.user,
        client: interaction.client,
        role: vipRole,
        guild: interaction.guild
      };
      
      const formattedAlreadyHasRoleMessage = formatMessage(customMessages.alreadyHasRole, messageData);
      
      await interaction.reply({
        content: formattedAlreadyHasRoleMessage,
        ephemeral: true
      });
      return;
    }

    const key = interaction.fields.getTextInputValue('key_input');
    const validKey = await validateKey(interaction.guildId, key);
    
    if (validKey) {
      await markKeyAsUsed(interaction.guildId, key);

      // Create VIP role if it doesn't exist
      if (!vipRole) {
        vipRole = await interaction.guild.roles.create({
          name: config.vipRoleName,
          color: config.colors.primary,
          reason: 'VIP role for key system'
        });
      }
      await interaction.member.roles.add(vipRole);
      const generatorChannel = interaction.guild.channels.cache.find(
        channel => channel.name === config.generatorChannelName
      );

      const messageData = {
        user: interaction.user,
        client: interaction.client,
        role: vipRole,
        generatorChannel: generatorChannel,
        guild: interaction.guild
      };

      const formattedSuccessMessage = formatMessage(customMessages.success, messageData);

      // Log to logs channel
      if (logsChannel) {
        await logsChannel.send(formattedSuccessMessage);
      }

      const timeout = setTimeout(async () => {
        try {
          await interaction.member.roles.remove(vipRole);
          const formattedExpiredMessage = formatMessage(customMessages.expired, messageData);
          
          if (logsChannel) {
            await logsChannel.send(formattedExpiredMessage);
          }

          roleTimeouts.delete(interaction.user.id);
        } catch (error) {
          console.error('Error removing VIP role:', error);
        }
      }, config.vipDuration);
      roleTimeouts.set(interaction.user.id, timeout);

      await interaction.reply({
        content: 'âœ… Successfully verified! You now have VIP access for 60 minutes.',
        ephemeral: true
      });
    } else {
      const messageData = {
        user: interaction.user,
        client: interaction.client,
        role: { name: config.vipRoleName },
        guild: interaction.guild
      };
      
      const formattedFailedMessage = formatMessage(customMessages.failed, messageData);
      
      await interaction.reply({
        content: formattedFailedMessage,
        ephemeral: true
      });
    }
  }
}

export function handleUserLeave(userId) {
  const timeout = roleTimeouts.get(userId);
  if (timeout) {
    clearTimeout(timeout);
    roleTimeouts.delete(userId);
  }
}