const { EmbedBuilder, SlashCommandBuilder, Client } = require('discord.js');
const { color } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Get the top 10 users of points or messages')
        .addSubcommand(sub =>
            sub.setName('points')
                .setDescription('Get the top 10 users that have the most points')
        )
        .addSubcommand(sub =>
            sub.setName('messages')
                .setDescription('Get the top 10 users that have sent the most messages')
        ),
    /**
    * 
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const sub = interaction.options.getSubcommand();

        if (sub == 'points') {
            let get = await client.db.all('SELECT * FROM members ORDER BY points DESC LIMIT 10');

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`Top 10 users with the most points`)
                        .setDescription(get.map((u, i) => `${i + 1}. <@${u.id}>: ${u.points} points`).join('\n'))
                ]
            });
        }
        else if (sub == 'messages') {
            let get = await client.db.all('SELECT * FROM members ORDER BY messages DESC LIMIT 10');

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`Top 10 users that sent the most messages`)
                        .setDescription(get.map((u, i) => `${i + 1}. <@${u.id}>: ${u.messages} messages`).join('\n'))
                ]
            });
        }
    },
};
