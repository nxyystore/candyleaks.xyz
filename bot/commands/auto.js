import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { 
    activePings, 
    loadAutoPingData, 
    saveAutoPingData 
} from '../utils/autoPingUtils.js'; 

export const data = new SlashCommandBuilder()
    .setName('auto')
    .setDescription('Manage auto-ping settings')
    .addSubcommand(subcommand =>
        subcommand
            .setName('ping')
            .setDescription('Set up auto-ping in this channel')
            .addIntegerOption(option =>
                option.setName('interval')
                    .setDescription('The interval in hours (1 to 12)')
                    .setRequired(true)
                    .setMinValue(1)  // Minimum 1 hour
                    .setMaxValue(12) // Maximum 12 hours
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('stop')
            .setDescription('Stop auto-ping in this channel')
    );

export async function execute(interaction) {
    if (!interaction.guild) {
        return await interaction.reply({
            content: 'This command can only be used in a server.',
            ephemeral: true,
        });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'ping') {
        const intervalInHours = interaction.options.getInteger('interval');
        const intervalInMinutes = intervalInHours * 60; // Convert hours to minutes

        const embed = new EmbedBuilder()
            .setTitle('Auto-Ping Settings')
            .setDescription(
                `Settings will be saved for <#${interaction.channel.id}>.\n\n` +
                '**Overview:**\n' +
                `- Channel: <#${interaction.channel.id}>\n` +
                `- Interval: ${intervalInHours} hour(s) for every ping.\n` +
                '- Starting: Now'
            )
            .setColor(0x2f3136);

        const confirmButton = new ButtonBuilder()
            .setCustomId(`confirm_ping_${intervalInMinutes}`)  // Pass converted minutes
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(confirmButton)],
            ephemeral: true,
        });
    } else if (subcommand === 'stop') {
        const channelId = interaction.channel.id;
        if (activePings.has(channelId)) {
            clearInterval(activePings.get(channelId));
            activePings.delete(channelId);
            const autoPingData = loadAutoPingData();
            delete autoPingData[channelId];
            saveAutoPingData(autoPingData);

            await interaction.reply({
                content: `Auto-ping stopped in <#${channelId}>.`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `No active auto-ping found in <#${channelId}>.`,
                ephemeral: true,
            });
        }
    }
}