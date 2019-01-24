
const index = require('./index');
var config = require('./config.json');
const setup = require("./setup")

const playerRole = '';

module.exports = {
    processCommand: function (receivedMessage) {
        let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
        let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
        let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, Arguments:  ${fullCommand.substr(fullCommand.indexOf(" "))}  @ ${new Date()}`);

        switch(primaryCommand) {
            case 'help' :
                //helpCommand(arguments, receivedMessage);
                break;
            case 'getrole' :
                //getRole(arguments[0]);
                break;
            case 'delete' :
                //deleteHistory();
                break;
            case 'state' :
                //state(arguments[0]);
                break;
            default:
                break;
        }
    },

    processAdminCommand: function (receivedMessage, client) {
        let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
        let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
        let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, Arguments:  ${fullCommand.substr(fullCommand.indexOf(" "))}  @ ${new Date()}`);

        switch(primaryCommand) {
            case 'delete' :
                setup.deleteRoles(client, arguments[0]);
                break;
            case "del":
                setup.deleteChannels(client, arguments[0]);
                break;
            case "react":
                setup.setupRoleTextChannel(client, arguments[0]);
                break;
            case "category":
                setup.setupCategoryChannels(client, arguments[0]);
                break;
            case "global":
                setup.setupGlobalChannels(client,arguments[0]);
            break;
            case "channels":
                setup.setupAdminChannels(client,arguments[0]);
                setup.setupTeacherLoungeChannels(client,arguments[0]);
                setup.setupCheckInChannels(client,arguments[0]);
                setup.setupGameChannels(client,arguments[0]);
                setup.setupOtherChannels(client,arguments[0]);
                setup.setupVoiceChannels(client,arguments[0]);
                break;
            case "roles":
                setup.createRoles(client, arguments[0]);
                break;
            case "update":
                setup.update(client);
                break;
            default:
                break;
        }
    },


    removeGameRoles: async function (client, reactionMessage, memberId) {
        i = setup.findGuildId(reactionMessage.guild.id);

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

        removeMember = client.guilds.find(guild => reactionMessage.guild.id = guild.id)
            .members.find(member => member.id = memberId);
        removeMember.removeRoles(array);
    }
}

function getRole(role) {
    if (role === "player") {
        receivedMessage.member.removeRoles(receivedMessage.member.roles).then (function() {
            receivedMessage.member.addRole(config.playerRole);
        });      
    } else if (role === "captain") {
        receivedMessage.member.removeRoles(receivedMessage.member.roles).then (function() {
            receivedMessage.member.addRole(config.captainRole);
        });  
    } else {
        receivedMessage.channel.send("You did not ask for an existing role. Try `!help`")
    }
}

function deleteHistory() {
    // Create a message collector
    const filter = m => m.content;
    const collector = receivedMessage.channel.createMessageCollector(filter, { time: 10000 });
    collector.on('collect', m => console.log(`Collected ${m.content}`));
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));


    receivedMessage.channel.fetchMessages({ 
        limit: 50 // Fetch last 50 messages.
    }).then((msgCollection) => { // Resolve promise
        msgCollection.forEach((msg) => { // forEach on message collection
            //console.log(msg.createdTimestamp)
            //var v = new Date();
            //console.log(v.getDate());
            msg.delete(); // Delete each message
        })
    });
    /*
    console.log(receivedMessage.channel.bulkDelete(100).then(messages => console.log(`Bulk deleted ${messages.size} messages`)).catch(console.error));

    */
}


function state(state) {
    if(state === "vic") {
        console.log(receivedMessage.member.displayName);
        console.log(receivedMessage.member.username);
        receivedMessage.member.setNickname("").then(function() {
            receivedMessage.member.setNickname("VIC | " + receivedMessage.member.displayName)
        });
    }
}

function helpCommand(arguments, receivedMessage) {
    let command = arguments[0];
    if (command === 'commands') {
        receivedMessage.channel.send("Commands: !getrole");
    } else if (command === 'getrole') {
        receivedMessage.channel.send("!getrole player, !getrole captain");
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]` or `!help commands` for a list of commands.");
    }
}