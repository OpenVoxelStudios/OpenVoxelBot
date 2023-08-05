const { EmbedBuilder, SlashCommandBuilder, Client } = require('discord.js');
const { color } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Check your inventory and how many points you have.')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('You can look at other users inventory!')
                .setRequired(false)
        ),

    /**
    * 
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        let get = await client.db.get('SELECT * FROM members WHERE id = ?', [interaction.options.getUser('user')?.id || interaction.user.id]);

        if (interaction.options.getUser('user')?.bot) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`Bots are too powerful to have points.`)
                ]
            });
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${(interaction.options.getUser('user')?.id) ? `${interaction.guild.members.cache.get(interaction.options.getUser('user')?.id).displayName}'s` : 'Your'} Inventory`)
                    .setAuthor({ name: (interaction.options.getUser('user')?.id) ? interaction.guild.members.cache.get(interaction.options.getUser('user')?.id).displayName : interaction.member.displayName, iconURL: (interaction.options.getUser('user')?.id) ? interaction.guild.members.cache.get(interaction.options.getUser('user')?.id).displayAvatarURL() : interaction.member.displayAvatarURL() })
                    .setFooter({ text: `Points can be earned by sending messages or inviting active people!`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`${(interaction.options.getUser('user')?.id) ? `<@${interaction.options.getUser('user')?.id}>` : 'You'} currently have **${get?.points || 0}** points.`)
            ]
        });
    },
};