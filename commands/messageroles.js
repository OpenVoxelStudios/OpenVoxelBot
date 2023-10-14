const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color, message_reward } = require('../config');

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('messageroles')
        .setDescription('View every role you can get by sending messages'),

    /**
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        let get = await client.db.get('SELECT * FROM members WHERE id = ?', [interaction.user.id]);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle('OpenVoxel\'s Message-Roles')
                    .setAuthor({ name: `${get?.messages || 0} messages sent - ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(message_reward.map(r => `**${r.messages} messages**: <@&${r.role}>`).join('\n'))
                    .setFooter({ text: 'Just send messages to get roles!' })
            ]
        });
    },
};