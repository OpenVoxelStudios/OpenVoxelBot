const { Client, Message } = require("discord.js");
const { coinByMessage, coinForInvite } = require("../config");

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async run(client, message) {

        // The message = point system
        if (!message.author.bot) {
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