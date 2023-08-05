const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { color, shop } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the shop and the items that you can buy.'),

    /**
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async getDataFor(client, interaction) {
        let get = await client.db.get('SELECT * FROM members WHERE id = ?', [interaction.user.id]);

        let embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('OpenVoxel\'s Shop')
            .setAuthor({ name: `${get?.points || 0} points - ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
            .setDescription(`You can earn points by sending messages or inviting active people!`)
            .setFooter({ text: 'Everything you buy is converted into a role that is added on your profile, if you leave you loose your roles! (but not your points)' });

        let selectMenu = new StringSelectMenuBuilder()
            .setCustomId('buy')
            .setMaxValues(1)
            .setPlaceholder('Click to buy!');

        for (item of shop) {
            embed.addFields({
                name: item.name,
                value: `${item.price} points`,
                inline: true
            });

            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(item.name)
                    .setLabel(item.name)
                    .setDescription(`This costs ${item.price} points`)
            )
        }

        return {
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        selectMenu
                    )
            ]
        };
    },

    /**
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply(await this.getDataFor(client, interaction));
    },
};