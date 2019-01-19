
const index = require('./index');
const playerRole = '536149624512315395';

module.exports = {
    processCommand: function (receivedMessage) {
        let fullCommand = receivedMessage.content.substr(1).toLowerCase(); // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
        let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
        let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

        console.log(`${receivedMessage.author.username} entered command: ${primaryCommand}, Arguments:  ${fullCommand.substr(fullCommand.indexOf(" "))}  @ ${new Date()}`);

        if (primaryCommand === "help") {
            helpCommand(arguments, receivedMessage)
        } else if (primaryCommand === "getrole") {
            if (arguments[0] === "player") {
                receivedMessage.member.removeRoles(receivedMessage.member.roles).then (function(){
                    receivedMessage.member.addRole(playerRole);
                })
                    
                } else if (arguments[0] === "captain") {

            } else {
                receivedMessage.channel.send("You did not ask for an existing role. Try `!help`")
            }
        } else {
            receivedMessage.channel.send("I don't understand the command. Try `!help`")
        }
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