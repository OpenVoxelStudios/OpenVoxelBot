const { EmbedBuilder, SlashCommandBuilder, Client } = require('discord.js');
const { color } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Get the top 10 users that have the most points'),

    /**
    * 
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        let get = await client.db.all('SELECT * FROM members ORDER BY points DESC LIMIT 10');

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Top 10 users with the most points`)
                    .setDescription(get.map((u, i) => `${i + 1}. <@${u.id}>: ${u.points} points`).join('\n'))
            ]
        });
    },
};
