
const index = require('./index');
const config = require("./config.json");

const playerRole = '';

module.exports = {
    processCommand: function (receivedMessage) {
        let fullCommand = receivedMessage.content.substr(1).toLowerCase(); // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
        let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
        let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, Arguments:  ${fullCommand.substr(fullCommand.indexOf(" "))}  @ ${new Date()}`);

        switch(primaryCommand) {
            case 'help' :
                helpCommand(arguments, receivedMessage);
                break;
            case 'getrole' :
                getRole(arguments[0]);
                break;
            case 'delete' :
                deleteHistory();
                break;
            case 'state' :
                state(arguments[0]);
                break;
            default:
                break;
        }
    },

    roleReactionAdd: async function (client, memberId, roles) {
        client.guilds.forEach((guild) => {
            if(guild.id === config.serverId) {
                guild.members.forEach((member) => {
                    if(member.id === memberId) {
                        member.addRoles(roles);
                    }
                })
            }
        })
    return 1;
    },

    removeGameRoles: async function (client, memberId) {
        client.guilds.forEach((guild) => {
            if(guild.id === config.serverId) {
                guild.members.forEach((member) => {
                    if(member.id === memberId) {
                        const array = [config.Player, config.Captain,
                            config.NSW_ACT_Player, config.NSW_ACT_Captain, 
                            config.New_South_Wales_Australian_Capital_Territory,
                            config.SA_NT_Player, config.SA_NT_Captain,
                            config.South_Australia_Northern_Territory,
                            config.QLD_Player, config.QLD_Captain, config.Queensland,
                            config.TAS_Player, config.TAS_Captain, config.Tasmania,
                            config.VIC_Player, config.VIC_Captain, config.Victoria,
                            config.WA_Player, config.WA_Captain, config.Western_Australia,];
                        member.removeRoles(array);
                    }
                })
            }
        })
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