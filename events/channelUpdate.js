const { Client, GuildChannel, ChannelType } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const wait = require('node:timers/promises').setTimeout;

const voiceEastereggs = {
    'WTF BOOM': './assets/sounds/WTF_BOOM.mp3',
    'SUS': './assets/sounds/SUS.mp3',
    'AMOGUS': './assets/sounds/AMOGUS.mp3',
    'YAY': './assets/sounds/YAY.mp3',

    'EASTER EGG': './assets/sounds/RICKROLL.mp3',
    'STEVELOCKS WHEN NEXT DEVLOG': './assets/sounds/RICKROLL.mp3',

    'WHAT IS KARLSON?': './assets/sounds/KARLSON.mp3',
    'WHAT\'S KARLSON?': './assets/sounds/KARLSON.mp3',
    'YOU DONT KNOW WHAT KARLSON IS?': './assets/sounds/KARLSON.mp3',
    'YOU DON\'T KNOW WHAT KARLSON IS?': './assets/sounds/KARLSON.mp3',

    'E': './assets/sounds/E.mp3',
}

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {GuildChannel} oldchannel 
     * @param {GuildChannel} newchannel 
     */
    async run(client, oldchannel, newchannel) {

        // Play random sounds DONT ASK WHY idk
        if (newchannel.name != oldchannel.name && newchannel.type == ChannelType.GuildVoice && Object.keys(voiceEastereggs).includes(newchannel.name.toUpperCase())) {
            await wait(3000)

            const player = createAudioPlayer();
            const resource = createAudioResource(voiceEastereggs[newchannel.name.toUpperCase()]);

            const connection = joinVoiceChannel({
                channelId: newchannel.id,
                guildId: newchannel.guild.id,
                adapterCreator: newchannel.guild.voiceAdapterCreator,
            });

            player.play(resource);
            connection.subscribe(player);

            player.on('stateChange', async (oldState, newState) => {
                if (oldState.status == 'playing' && newState.status == 'idle') {
                    connection.disconnect();
                }
            });
        }
    }
}