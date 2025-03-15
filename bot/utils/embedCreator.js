import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { config } from '../config.js';

export function createVerificationEmbed(guildId, guildName, buttonUrl) {
  const embed = new EmbedBuilder()
    .setTitle(`${guildName} -> Key System`)
    .setDescription(
      '___Here is a tutorial to access all our VIP channels.___\n\n' +
      '> - Click on the "**Generate Key**" button.\n' +
      '> - Watch the **ads** and click Done.\n' +
      '> - Click **"Generate Key & Copy to clipboard**".\n' +
      '> - Press "**Redeem Key**" button.\n',
      '> - **DONE**, Enjoy your access!'
    )
    .setImage('https://i.imgur.com/vLUIBhP.png')
    .setColor(0x979a8f);

  const generateButton = new ButtonBuilder()
    .setLabel('Generate Key')
    .setURL(buttonUrl)
    .setStyle(ButtonStyle.Link);

  const redeemButton = new ButtonBuilder()
    .setCustomId('redeem_key')
    .setLabel('Redeem Key')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(generateButton, redeemButton);
  
  return { embed, components: [row] };
}