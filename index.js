const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');
const setup = require('./setup.js');

var config = require("./config.json");
module.exports.dclient = client;

client.on('ready', () => {
    
    setup.showInfo(client);
    setup.setupRoles(client);

});


client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        if (receivedMessage.channel.id === config.botCommandsChannel) {
            commands.processCommand(receivedMessage);
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
    if(reaction.message.id === config.rolesTextId) {
        console.log(user.roles)
    }
});

client.on("messageReactionRemove",  (reaction, user) => {
    if(reaction.message.id === config.rolesTextId) {
        console.log("reached");
    }
});


client.login(config.token);
