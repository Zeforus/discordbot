const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');
const setup = require('./setup.js');
const fs = require('fs');

const config = require("./config.json");
var reactions = [];

module.exports.dclient = client;

client.on('ready', () => {

    setup.updateServer(client);
    setup.update(client);
    //setup.showInfo(client);

    
    if(config.active === 1) {
        client.guilds.forEach(guild =>{
            console.log(`${guild.name} reaction listener turning on...`)
            setup.setupRoleTextChannel(guild)
        })
    }

    console.log("METABot is online")
});


client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        if (receivedMessage.channel.id === config.botCommandsChannel) {
            commands.processCommand(receivedMessage);
        } else if (receivedMessage.author.id === config.serverAdminId) {
            commands.processAdminCommand(receivedMessage, client);
        } else {
            //receivedMessage.channel.send(`I only listen to commands sent directly to me or in the <#${config.botCommandsChannel}> channel.`);
        }
    }
});


client.on("guildMemberAdd", (member) => {
    //member.send("`Welcome to META, please see/read #rules on how to join the server.`");
});

client.on("error", (err) => {
    console.log(err);
});

client.on("messageReactionAdd", (reaction, user) => {

    if (user === client.user || reaction.message.channel.name !== 'roles') {
        return;
    }



    if (reactions.indexOf(user.id) > -1) {
        reaction.remove(user);
        return;
    }

    reactions.push(user.id);


    let member = client
        .guilds.find(guild => guild.id === reaction.message.guild.id)
        .members.find(member => member.id === user.id)



        
    i = setup.findGuildId(reaction.message.guild.id);

    async function f() {
        let roles = []
        switch (reaction.emoji.name) {
            case ('🇦'):
                roles = [config.servers[i].NSWACTPlayer, config.servers[i].Player
                    , config.servers[i].NewSouthWalesAustralianCapitalTerritory]

                commands.removeReactions(client, reaction.message, user.id, '🇦')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })
                
                member.setNickname(`NSW-ACT | ${user.username}`).catch();;

                break;
            case ('🇧'):
                roles = [config.servers[i].NSWACTCaptain, config.servers[i].Captain,
                config.servers[i].NewSouthWalesAustralianCapitalTerritory]

                commands.removeReactions(client, reaction.message, user.id, '🇧')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`NSW-ACT | ${user.username}`).catch();
                break;
            case ('🇨'):
                roles = [config.servers[i].NZPlayer, config.servers[i].Player
                    , config.servers[i].NewZealand]

                commands.removeReactions(client, reaction.message, user.id, '🇨')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`NZ | ${user.username}`).catch();
                break;
            case ('🇩'):
                roles = [config.servers[i].NZCaptain,
                config.servers[i].Captain, config.servers[i].NewZealand]

                commands.removeReactions(client, reaction.message, user.id, '🇩')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`NZ | ${user.username}`);
                break;
            case ('🇪'):
                roles = [config.servers[i].SANTPlayer,
                config.servers[i].Player,
                config.servers[i].SouthAustraliaNorthernTerritory]

                commands.removeReactions(client, reaction.message, user.id, '🇪')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`SA-NT | ${user.username}`);
                break;
            case ('🇫'):
                roles = [config.servers[i].SANTCaptain,
                config.servers[i].Captain,
                config.servers[i].SouthAustraliaNorthernTerritory]

                commands.removeReactions(client, reaction.message, user.id, '🇫')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`SA-NT | ${user.username}`)
                break;
            case ('🇬'):
                roles = [config.servers[i].QLDPlayer,
                config.servers[i].Player, config.servers[i].Queensland]

                commands.removeReactions(client, reaction.message, user.id, '🇬')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`QLD | ${user.username}`);
                break;
            case ('🇭'):
                roles = [config.servers[i].QLDCaptain,
                config.servers[i].Captain, config.servers[i].Queesland]


                commands.removeReactions(client, reaction.message, user.id, '🇭')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`QLD | ${user.username}`);
                break;
            case ('🇮'):
                roles = [config.servers[i].TASPlayer,
                config.servers[i].Player, config.servers[i].Tasmania]

                commands.removeReactions(client, reaction.message, user.id, '🇮')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`TAS | ${user.username}`);
                break;
            case ('🇯'):
                roles = [config.servers[i].TASCaptain,
                config.servers[i].Captain, config.servers[i].Tasmania]

                commands.removeReactions(client, reaction.message, user.id, '🇯')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`TAS | ${user.username}`);
                break;
            case ('🇰'):
                roles = [config.servers[i].VICPlayer,
                config.servers[i].Player, config.servers[i].Victoria]

                commands.removeReactions(client, reaction.message, user.id, '🇰')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })

                member.setNickname(`VIC | ${user.username}`);
                break;
            case ('🇱'):
                roles = [config.servers[i].VICCaptain,
                config.servers[i].Captain, config.servers[i].Victoria]

                commands.removeReactions(client, reaction.message, user.id, '🇱')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })
                member.setNickname(`VIC | ${user.username}`);
                break;
            case ('🇲'):
                roles = [config.servers[i].WAPlayer,
                config.servers[i].Player, config.servers[i].WesternAustralia]

                commands.removeReactions(client, reaction.message, user.id, '🇲')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })
                member.setNickname(`WA | ${user.username}`);

                break;
            case ('🇳'):
                roles = [config.servers[i].WACaptain,
                config.servers[i].Captain, config.servers[i].WesternAustralia]

                commands.removeReactions(client, reaction.message, user.id, '🇳')
                commands.removeGameRoles(member).then(function () {
                    member.addRoles(roles).catch(); //Catches roles already added
                })
                member.setNickname(`WA | ${user.username}`);
                break;
            default:
                break;

        }
        return Promise.resolve();
        }

        function g() {
            f();
            reactions.splice(reactions.indexOf(user.id),1)
            return;
        }

        setTimeout(g,1000);

        

    });

client.on("messageReactionRemove", (reaction, user) => {

});


client.login(config.token);
