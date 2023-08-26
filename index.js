(async function () {
    const { Client, IntentsBitField } = require('discord.js');
    const client = new Client({ intents: Object.keys(IntentsBitField.Flags).filter(i => isNaN(i)) });
    const { token } = require('./config');
    const sqlite = require('sqlite');
    const { readdirSync } = require('fs');

    client.commands = [];
    client.guildInvites = new Map();
    client.db = await sqlite.open({
        filename: './db.sqlite',
        driver: require('sqlite3').Database,
    });

    [
        "CREATE TABLE IF NOT EXISTS members (id TEXT PRIMARY KEY, inviter TEXT, points INTEGER NOT NULL DEFAULT 0, messages INTEGER NOT NULL DEFAULT 0, tempmessages INTEGER NOT NULL DEFAULT 0)",
        "CREATE TABLE IF NOT EXISTS copychan (text TEXT PRIMARY KEY, id TEXT NOT NULL)"
    ].forEach((statement) => client.db.run(statement))


    client.once('ready', async () => {
        // Load all events
        for (path of readdirSync('./events')) {
            if (!path.endsWith('.js')) return;
            let f = require(`./events/${path}`);
            if (f.once) client.once(path.replace('.js', ''), (...args) => f.run(client, ...args));
            else client.on(path.replace('.js', ''), (...args) => f.run(client, ...args));
        };
        console.log('[-] Launched all Events');

        // Load all commands
        await readdirSync('./commands').forEach(async file => {
            if (file.endsWith('.js')) client.commands.push(require(`./commands/${file}`)?.slash)
        })
        await client.application.commands.set(client.commands);
        await console.log('[-] Updated Slash Commands');


        client.guilds.cache.forEach(async guild => {
            let invites = await guild.invites.fetch();

            invites.forEach(inv => {
                client.guildInvites.set(inv.code, { uses: inv.uses, author: inv.inviterId })
            });
            console.log(`[✅] Invites Cached!`);
        });
    })

    client.login(token)
    // ==============---- HANDLE UNCAUGHT ERRORS ----============== \\
    client.on('error', async (error) => { console.error(error); });
    client.on('warn', async (warn) => { console.warn(warn); });
    process.on('unhandledRejection', async (error) => { console.error(error); });
    process.on('uncaughtException', async (error) => { console.error(error); });
})();