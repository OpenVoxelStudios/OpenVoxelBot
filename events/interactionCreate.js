const { Client, EmbedBuilder } = require("discord.js");
const { shop, channels } = require("../config");

module.exports = {
    once: false,
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async run(client, interaction) {

        if (interaction.isCommand()) {
            require(`../commands/${interaction.commandName}`).run(client, interaction);
        }

        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'buy') {
                await interaction.deferUpdate();

                let get = await client.db.get('SELECT * FROM members WHERE id = ?', [interaction.user.id]);
                let selected = shop.find(v => v.name == interaction.values[0]);


                await interaction.editReply(await require('../commands/shop').getDataFor(client, interaction))
                if (!get || (parseInt(get?.points) || 0) < selected.price) {
                    await interaction.followUp({
                        ephemeral: true,
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`❌ You don\'t have enough coins to buy this!\n> You have ${get?.points || 0} points out of ${selected.price} points for that item`)
                        ]
                    })
                }

                else if (parseInt(get?.points || 0) > selected.price) {
                    let hasRole = interaction.member.roles.cache.has(selected.role);

                    if (hasRole) {
                        await interaction.followUp({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription(`❌ You already have that item! You can't buy it again!`)
                            ]
                        })
                    } else {
                        let newAmount = parseInt(get.points) - selected.price;
                        if (newAmount < 0) {
                            await interaction.followUp({
                                ephemeral: true,
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription(`❌ Something went really wrong, please try again.`)
                                ]
                            })
                            return
                        }

                        await client.db.run('UPDATE members SET points = ? WHERE id = ?;', [newAmount, interaction.user.id]);
                        await interaction.member.roles.add(selected.role);
                        
                        await interaction.followUp({
                            ephemeral: true,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setDescription(`✅ You just bought **${selected.name}** for **${selected.price} points**!`)
                            ]
                        });

                        await interaction.guild.channels.cache.get(channels.log).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setDescription(`<@${interaction.user.id}> just bought **${selected.name}** for **${selected.price} points**!`)
                            ]
                        });
                    }
                }
            }
        }
    }
}