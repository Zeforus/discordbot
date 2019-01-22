const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');
const setup = require('./setup.js');

var config = require("./config.json");
module.exports.dclient = client;

client.on('ready', () => {
    setup.showInfo(client);
    setup.setupRoles(client);
    setup.createRoles(client);

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
        switch(reaction.emoji.name) {
            case('🇦'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.NSW_ACT_Player, 
                    config.Player, config.New_South_Wales_Australian_Capital_Territory]));
                break;
            case('🇧'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.NSW_ACT_Captain, 
                    config.Captain, config.New_South_Wales_Australian_Capital_Territory]));
            case('🇨'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.NZ_Player, 
                    config.Player, config.New_Zealand]));
                break;
            case('🇩'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.NZ_Captain, 
                    config.Captain, config.New_Zealand]));
                break;
            case('🇪'): 
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.SA_NT_Player, 
                    config.Player, config.South_Australia_Northern_Territory]));
                break;
            case('🇫'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.SA_NT_Captain, 
                    config.Captain, config.South_Australia_Northern_Territory]));    
                break;
            case('🇬'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.QLD_Player, 
                    config.Player, config.Queensland])); 
                break;
            case('🇭'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.QLD_Captain, 
                    config.Captain, config.Queesland]));
                break;
            case('🇮'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.TAS_Player, 
                    config.Player, config.Tasmania])); 
                break;
            case('🇯'): 
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.TAS_Captain, 
                    config.Captain, config.Tasmania]));
                break;
            case('🇰'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.VIC_Player, 
                    config.Player, config.Victoria])); 
                break;
            case('🇱'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.VIC_Captain, 
                    config.Captain, config.Victoria])); 
                break;
            case('🇲'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.WA_Player, 
                    config.Player, config.Western_Australia]));
                break;
            case('🇳'):
                commands.removeGameRoles(client, user.id).then(commands.roleReactionAdd(client, user.id, [config.WA_Captain, 
                    config.Captain, config.Western_Australia])); 
                break;                
            default:
                break;
        }
    }
});

client.on("messageReactionRemove",  (reaction, user) => {
    if(reaction.message.id === config.rolesTextId) {
        commands.removeGameRoles(client, user.id);
    }
});


client.login(config.token);
