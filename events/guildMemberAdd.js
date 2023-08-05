const { GuildMember, Client } = require("discord.js");
const { channels } = require("../config");

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    async run(client, member) {
        const newInvites = await member.guild.invites.fetch();

        const usedInvite = newInvites.find(inv => client.guildInvites.get(inv.code)?.uses < inv.uses);
        newInvites.each(inv => client.guildInvites.set(inv.code, { uses: inv.uses, author: inv.inviterId }));

        member.guild.channels.cache.get(channels.welcome)?.send({ content: `<@${member.user.id}> was invited by <@${usedInvite.inviterId}> using code **${usedInvite.code}** (code use count: ${usedInvite.uses}).` });
        let getDb = await client.db.get('SELECT * FROM members WHERE id = ?', [member.user.id]);

        if (!getDb?.id) {
            await client.db.run('INSERT INTO members (id, inviter) VALUES (?, ?)', [member.user.id, usedInvite.inviterId]);
        }
    }
}