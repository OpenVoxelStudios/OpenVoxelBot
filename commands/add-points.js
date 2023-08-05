const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { shop, channels } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('add-points')
        .setDescription('Add points to someone (like /give)')
        .setDefaultMemberPermissions(0)
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('Give to who?')
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt.setName('amount')
                .setDescription('The amount to give')
                .setMinValue(1)
                .setRequired(true)
        ),


    /**
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        let user = interaction.options.getUser('user');
        let amount = interaction.options.getInteger('amount');

        let get = await client.db.get('SELECT * FROM members WHERE id = ?;', [user.id]);

        if (get) {
            await client.db.run('UPDATE members SET points = ? WHERE id = ?', [parseInt(get?.points) + amount, user.id])
        }
        else await client.db.run('INSERT INTO members (id, points) VALUES (?, ?);', [user.id, amount]);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`**${amount} points** has been added to <@${user.id}>!`)
            ]
        });

        await interaction.guild.channels.cache.get(channels.log).send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<@${interaction.user.id}> just added **${amount} points** to <@${user.id}>'s account.`)
            ]
        });
    },
};