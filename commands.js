const index = require('./index');
const setup = require("./setup")
const csetup = require("./setup.json")

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
        if(arguments.length === 0) {
            console.log(`Error: missing server name to process ${primaryCommand} command`);
            return;
        }

        //Print out who actioned a command
        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, @ ${new Date()}`);

        //Print all the additional arguments after the command
        for(i = 0 ; i< arguments.length ; i++) console.log(arguments[i]);
        
        //The first argument is always the server to action the command on
        let guild
        if(arguments[0]) {
            guild = client.guilds.find(guild => guild.name.replace(/[^0-9a-zA-Z]/g, '') === arguments[0])

            if(guild === null) {
                console.log(`Unable to process command, ${arguments[0]} does not exist`)
                return;
            }
        }

        switch(primaryCommand) {
            case 'delete' :
                setup.deleteRoles(client, guild);
                break;
            case "del":
                setup.deleteChannels(guild);
                break;
            case "react":
                setup.createReaction(guild);
                break;
            case "setup":
                setup.createServer(guild);
                break;
            case "roles":
                setup.createRoles(guild);
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


    removeGameRoles: function (guild, member) {


        
        array = csetup.reaction.removeRoles;
        roles = []

        for(let i = 0; i < array.length; i++) {

            role = guild.roles.find(role => role.name == array[i]);

            if(role === null) return;

            roles.push(role)
        }
        member.removeRoles(roles)
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