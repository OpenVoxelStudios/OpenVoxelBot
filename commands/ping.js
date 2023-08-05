const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get informations about the bot like the latency and the uptime.'),

    /**
    * 
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        let time = Math.round(Date.now() / 1000 - process.uptime());

        await interaction.editReply({
            content: 'Pong :)',
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle('Informations about the bot')
                    .addFields(
                        { name: 'Latency', value: `${(sent.editedAt || sent.createdAt) - (interaction.editedAt || interaction.createdAt)}ms` },
                        { name: 'Uptime', value: `<t:${time}> (<t:${time}:R>)` },
                    )
            ]
        });
    },
};