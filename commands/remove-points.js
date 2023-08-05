const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { shop, channels } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('remove-points')
        .setDescription('Remove points to someone (like /clear)')
        .setDefaultMemberPermissions(0)
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('Remove to who?')
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt.setName('amount')
                .setDescription('The amount to remove')
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
            if (parseInt(get?.points) - amount >= 0) {
                await client.db.run('UPDATE members SET points = ? WHERE id = ?', [parseInt(get?.points) - amount, user.id])

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`**${amount} points** has been removed from <@${user.id}>!`)
                    ]
                });

                await interaction.guild.channels.cache.get(channels.log).send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`<@${interaction.user.id}> just removed **${amount} points** from <@${user.id}>'s account.`)
                    ]
                });
            }

            else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`❌ You can't remove more than the amount of points that a user have!\n> That user has **${get?.points} points**.`)
                    ]
                });
            }
        }

        else {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`❌ This user don't have any points!`)
                ]
            });
        }
    },
};