
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

        //Error checking for missing server name
        if(arguments.length === 0 && primaryCommand != "update") {
            console.log(`Error: missing server name to process ${primaryCommand} command`);
            return;
        }

        

        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, @ ${new Date()}`);
        for(i = 0 ; i< arguments.length ; i++) {
            console.log(arguments[i]);
        }

        let guild;
        if(arguments[0]) {
            guild = setup.findGuild(client, arguments[0]);
            if(guild === undefined) {
                console.log(`Unable to process command, ${arguments[0]} does not exist`)
                return;
            }
            console.log(`Processing the command on guild: ${guild.name}, ID: ${guild.id}`)
        }

        switch(primaryCommand) {
            case 'delete' :
                setup.deleteRoles(client, guild);
                break;
            case "del":
                setup.deleteChannels(guild);
                break;
            case "react":
                setup.setupRoleTextChannel(guild);
                break;
            case "category":
                setup.setupCategoryChannels(guild);
                break;
            case "global":
                setup.setupGlobalChannels(guild);
            break;
            case "channels":
                setup.setupAdminChannels(guild);
                setup.setupTeacherLoungeChannels(guild);
                setup.setupCheckInChannels(guild);
                setup.setupGameDayChannels(guild);
                setup.setupGameChannels(guild);
                setup.setupOtherChannels(guild);
                setup.setupVoiceChannels(guild);
                break;
            case "roles":
                setup.createRoles(guild);
                break;
            case "update":
                setup.update(client);
                break;
            default:
                break;
        }
    },

    removeReactions: async function(client, messageReaction, memberId, emoji) {

        
        messageReaction.reactions.forEach((value, key) => {
            if(key === emoji) return;
            value.fetchUsers().then(function(result) {
  

                if(result.length === 1) return;

                results = result.find(user => user.id === memberId);
                
                if(results === null) return;

                value.remove(results)

             });
        })

        return await Promise.resolve();

    },


    removeGameRoles: async function (member) {


        
        var array = [config.servers[i].Player, config.servers[i].Captain,
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


        await member.removeRoles(array);
        return await Promise.resolve();
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
        console.log(receivedMessage.member.username).then(receivedMessage.member.setNickname("")).then(function() {
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