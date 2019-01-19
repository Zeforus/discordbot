const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');

var config = require("./config.json");
module.exports.dclient = client;



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  
  client.guilds.forEach((guild) => {
    //console.log("###################################################");
    //console.log("Guild -- " + guild.name + ' - ' + guild.id);
    // List all channels

    
    guild.channels.forEach((channel) => {
        //console.log(`Channel -- ${channel.name} (${channel.type}) - ${channel.id}`)
    })

    console.log("########### ROLES ########################");
    guild.roles.forEach((role) => {
        console.log(`Role ID -- ${role.id} (${role.name})`)
    })
    
})

});

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        if (receivedMessage.channel.id === config.rolesChannel) {
            commands.processCommand(receivedMessage);
        } else {
            receivedMessage.channel.send(`I only listen to commands sent directly to me or in the <#${config.rolesChannel}> channel.`);
        }
    }
});


client.on("guildMemberAdd", (member) => {
    member.send("`Welcome to META, please see/read #rules on how to join the server.`");
});

client.on("error", (err) => {
    console.log(err);
});



client.login(config.token);
