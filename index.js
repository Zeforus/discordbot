const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');
const setup = require('./setup.js');
const fs = require('fs');

var config = require("./config.json");
module.exports.dclient = client;

client.on('ready', () => {
    setup.update(client);
    setup.showInfo(client);
    //setup.setupRoleTextChannel(client, "METARocketLeague")
});


client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        console.log(receivedMessage.author.id)
        if (receivedMessage.channel.id === config.botCommandsChannel) {
            commands.processCommand(receivedMessage);
        } else if (receivedMessage.author.id === config.serverAdminId) {
            commands.processAdminCommand(receivedMessage, client);
        } else {
            receivedMessage.channel.send(`I only listen to commands sent directly to me or in the <#${config.botCommandsChannel}> channel.`);
        }
    }
});


client.on("guildMemberAdd", (member) => {
    member.send("`Welcome to META, please see/read #rules on how to join the server.`");
});

client.on("error", (err) => {
    console.log(err);
});

client.on("messageReactionAdd",  (reaction, user) => {
    console.log("messageReacted")
    
    i = setup.findGuildId(reaction.message.guild.id);

    if(reaction.message.channel.name === 'roles') {
        switch(reaction.emoji.name) {
            case('🇦'):
            commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].NSWACTPlayer, 
                    config.servers[i].Player, config.servers[i].NewSouthWalesAustralianCapitalTerritory])).catch(console.error("Error NSW ACT P"));
                break;
            case('🇧'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].NSWACTCaptain, 
                    config.servers[i].Captain, config.servers[i].NewSouthWalesAustralianCapitalTerritory])).catch(console.error("Error NSW ACT C"));
            case('🇨'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].NZPlayer, 
                    config.servers[i].Player, config.servers[i].NewZealand])).catch(console.error("Error NZ P"));
                break;
            case('🇩'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].NZCaptain, 
                    config.servers[i].Captain, config.servers[i].NewZealand])).catch(console.error("Error NZ C"));
                break;
            case('🇪'): 
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].SANTPlayer, 
                    config.servers[i].Player, config.servers[i].SouthAustraliaNorthernTerritory])).catch(console.error("Error SA NT P"));
                break;
            case('🇫'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].SANTCaptain, 
                    config.servers[i].Captain, config.servers[i].SouthAustraliaNorthernTerritory])).catch(console.error("Error SA NT C"));    
                break;
            case('🇬'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].QLDPlayer, 
                    config.servers[i].Player, config.servers[i].Queensland])).catch(console.error("Error QLD P"));
                break;
            case('🇭'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].QLDCaptain, 
                    config.servers[i].Captain, config.servers[i].Queesland])).catch(console.error("Error QLD C"));
                break;
            case('🇮'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].TASPlayer, 
                    config.servers[i].Player, config.servers[i].Tasmania])).catch(console.error("Error TAS P")); 
                break;
            case('🇯'): 
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].TASCaptain, 
                    config.servers[i].Captain, config.servers[i].Tasmania])).catch(console.error("Error TAS C"));
                break;
            case('🇰'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].VICPlayer, 
                    config.servers[i].Player, config.servers[i].Victoria])).catch(console.error("Error VIC P")); 
                break;
            case('🇱'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].VICCaptain, 
                    config.servers[i].Captain, config.servers[i].Victoria])).catch(console.error("Error VIC C")); 
                break;
            case('🇲'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].WAPlayer, 
                    config.servers[i].Player, config.servers[i].WesternAustralia])).catch(console.error("Error WA P"));
                break;
            case('🇳'):
                commands.removeGameRoles(client, user.id).then(client.guilds.find(guild => guild.id = reaction.message.guild.id).members.find(member => member.id = reaction.message.member.id).addRoles([config.servers[i].WACaptain, 
                    config.servers[i].Captain, config.servers[i].WesternAustralia])).catch(console.error("Error WA C")); 
                break;                
            default:
                break;
        }
    }    
    
});

client.on("messageReactionRemove",  (reaction, user) => {
    console.log('reaction removed');
    if(reaction.message.channel.name === 'roles') {

        i = setup.findGuildId(reaction.message.guild.id);

        const array = [config.servers[i].Player, config.servers[i].Captain,
        config.servers[i].NSWACTPlayer, config.servers[i].NSWACTCaptain, 
        config.servers[i].NewSouthWalesAustralianCapitalTerritory,
        config.servers[i].NZPlayer, config.servers[i].NZCaptain, 
        config.servers[i].NewZealand, config.servers[i].SANTPlayer, 
        config.servers[i].SANTCaptain, config.servers[i].SouthAustraliaNorthernTerritory,
        config.servers[i].QLDPlayer, config.servers[i].QLDCaptain, 
        config.servers[i].Queensland, config.servers[i].TASPlayer, 
        config.servers[i].TASCaptain, config.servers[i].Tasmania,
        config.servers[i].VICPlayer, config.servers[i].VICCaptain, 
        config.servers[i].Victoria, config.servers[i].WAPlayer, 
        config.servers[i].WACaptain, config.servers[i].WesternAustralia]

        removeMember = client.guilds.find(guild => reaction.message.guild.id = guild.id)
            .members.find(member => member.id = reaction.message.member.id);
        removeMember.removeRoles(array).catch(console.error("Error Removing Game Roles"));
    }
});


client.login(config.token);
