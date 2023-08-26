const { Client, Message, EmbedBuilder } = require("discord.js");
const { coinByMessage, coinForInvite, channels } = require("../config");

var countr = {
    lastNum: undefined,
    lastUser: undefined,
};

function isValid(nbr) {
    if (nbr.replace(/ /g, '') == '') return false;
    if (isNaN(nbr)) return false;
    if (Math.floor(nbr) != nbr) return false;

    return true;
};

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async run(client, message) {
        // The counter thing
        if (!message.author.bot && message.channel.id == channels.counter) {
            // If countr isn't fetched

            if (countr.lastNum == undefined) {
                let last = (await message.channel.messages.fetch({ limit: 2 })).at(1);
                let lastnbr = last.content.split(' ')[0];

                if (isValid(lastnbr)) {
                    countr.lastNum = parseInt(lastnbr, 10);
                    countr.lastUser = last.member.id;

                    console.log(`[+] Counter parsed. Starting at ${lastnbr}`);
                }
                else {
                    countr.lastNum = 0;

                    console.log(`[+] Counter starting at 0`);
                }
            }

            let nextnum = message.content.split(' ')[0];
            if (!isValid(nextnum)) return await message.delete();
            nextnum = parseInt(nextnum, 10);

            // Test if it's right number + different user
            if (countr.lastNum + 1 != nextnum || countr.lastUser == message.member.id) return await message.delete();

            // Update the current count
            countr.lastNum += 1;
            countr.lastUser = message.member.id;


            // Test if it's a round number
            if (nextnum != 1 && nextnum % 10 == 0) {
                let give = Math.round(Math.pow(Math.floor(String(nextnum).split('').length - 1), 3) / 1.5);

                // Add the points
                let get = await client.db.get('SELECT * FROM members WHERE id = ?;', [message.author.id]);
                if (get) await client.db.run('UPDATE members SET points = ? WHERE id = ?', [parseInt(get?.points) + give, message.author.id])
                else await client.db.run('INSERT INTO members (id, points) VALUES (?, ?);', [message.author.id, amount]);

                // Tell the user he won points
                await message.react('🎉');
                let msg = await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Yellow')
                            .setTitle(`🎉 Congratulations!`)
                            .setDescription(`You just won **${give} points** for the **${nextnum}th** number!`)
                    ]
                });

                await message.guild.channels.cache.get(channels.log).send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Yellow')
                            .setDescription(`<@${message.member.id}> just won **${give} points** for the **${nextnum}th** number.\n> ${msg.url}`)
                    ]
                });

                setTimeout(async (msg) => await msg.delete(), 7000, msg);
            }
        }


        // The message = point system
        if (!message.author.bot && message.channel.id != channels.counter) {
            let get = await client.db.get('SELECT * FROM members WHERE id = ?', [message.member.id]);

            if (!get) await client.db.run('INSERT INTO members (id, messages, tempmessages) VALUES (?, 1, 1);', [message.member.id])
            else {
                let newPoints = parseInt(get?.points);
                let newMessages = parseInt(get?.messages) + 1;
                let newTempmessages = parseInt(get?.tempmessages) + 1;

                if (newTempmessages >= coinByMessage.messageCount) {
                    newTempmessages -= coinByMessage.messageCount;
                    newPoints += coinByMessage.points;
                }

                await client.db.run('UPDATE members SET points = ?, messages = ?, tempmessages = ? WHERE id = ?', [newPoints, newMessages, newTempmessages, message.member.id]);

                if (newMessages == coinForInvite.messageCount) {
                    if (get?.inviter) {
                        let get2 = await client.db.get('SELECT * FROM members WHERE id = ?', [get?.inviter]);
                        if (get2) await client.db.run('UPDATE members SET points = ? WHERE id = ?;', [parseInt(get2?.points) + coinForInvite.points, get?.inviter]);
                    }
                }
            }
        }
    }
}