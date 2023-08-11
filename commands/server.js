const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder, Client } = require('discord.js');
const { server } = require('../config');
const mcutil = require('minecraft-server-util');
const { createCanvas, loadImage, registerFont } = require('canvas');
registerFont('./assets/fonts/minecraft_font.ttf', { family: 'Minecraft' });

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get our Minecraft server infos'),


    /**
    * @param {Client} client 
    * @param {import("discord.js").Interaction} interaction 
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        try {
            const status = await mcutil.status(server.ip, server.port);

            const canvas = createCanvas(860, 240);
            const ctx = canvas.getContext('2d');

            let bg = await loadImage('./assets/images/stats_background.png');
            ctx.drawImage(bg, 0, 0, 860, 240);

            let srvIcon = await loadImage(status.favicon || client.user.avatarURL({ extension: 'png' }));
            ctx.drawImage(srvIcon, 24, 24, 192, 192);

            ctx.font = '40px "Minecraft"';
            ctx.fillStyle = '#46e288';
            ctx.fillText(`• Online`, 250, 65);

            ctx.fillStyle = '#cccccc';
            ctx.fillText(`${server.ip}${(port == 25565) ? '' : `:${server.port}`}`, 250, 140);

            ctx.fillText(`${status.players.online}/${status.players.max} players`, 250, 215);


            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`Server IP: ${server.ip}${(port == 25565) ? '' : `:${server.port}`}`)
                        .setImage(`attachment://server-status.png`)
                ],
                files: [
                    new AttachmentBuilder(canvas.toBuffer(), { name: `server-status.png` })
                ]
            });
        }
        catch (err) {
            console.error(err);
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`❌ An error occured while getting the server infos. The server is probably offline.`)
                ]
            });
        }
    },
};