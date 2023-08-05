const { Invite, Client } = require("discord.js");

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {Invite} invite 
     */
    async run(client, invite) {
        const invites = await invite.guild.invites.fetch();

        invites.forEach(inv => {
            client.guildInvites.set(inv.code, { uses: inv.uses, author: inv.inviterId })
        });
    }
}