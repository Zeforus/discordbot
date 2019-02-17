const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');
const setup = require('./setup.js');
var config = require("./config.json");
const csetup = require('./setup.json')
var reactions = [];

module.exports.dclient = client;

client.on('ready', () => {

    if (config.active === 1) {
        client.guilds.forEach(guild => {
            console.log(`${guild.name} reaction listener turning on...`);
            setup.createReaction(guild);
        })
    }

    console.log(`${client.user.username} is online`);
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

    //Making sure it processes only one reaction at a time
    if (reactions.indexOf(user.id) > -1) {
        reaction.remove(user);
        return;
    }
    reactions.push(user.id);

    //Finds the Member
    let guild = client.guilds.find(guild => guild.id === reaction.message.guild.id)
    let member = guild.members.find(member => member.id === user.id)


    //Remove Other Roles
    commands.removeGameRoles(guild, member)

    //Assigns the roles
    setTimeout(() => {
        roles = csetup.reaction.roleAssign[reaction.emoji.name].roles
        for (let i = 0; i < roles.length; i++) {
            setTimeout(() => {
                role = guild.roles.find(role => role.name === roles[i]);
                if (role === null) return;
                member.addRole(role);
            }, i * 100)

        }
        member.setNickname(`${csetup.reaction.roleAssign[reaction.emoji.name].nickname} ${user.username}`).catch(console.error)
        reactions.splice(reactions.indexOf(user.id), 1)
    }, 5000)

});

client.on("messageReactionRemove", (reaction, user) => {
    if (user === client.user || reaction.message.channel.name !== 'roles') {
        return;
    }
    if (reactions.indexOf(user.id) > -1) {
        return;
    }
    reactions.push(user.id);
    setTimeout(() => {
    let guild = client.guilds.find(guild => guild.id === reaction.message.guild.id)
    let member = guild.members.find(member => member.id === user.id)
    member.setNickname('').catch(console.error);
    commands.removeGameRoles(guild, member)
    reactions.splice(reactions.indexOf(user.id), 1)
}, 5000)
    
});


client.login(config.token);
