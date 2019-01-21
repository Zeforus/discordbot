const index = require('./index');
var config = require("./config.json");

module.exports = {

    showInfo: function (client) {

        console.log(`Logged in as ${client.user.tag}!`);
  
        client.guilds.forEach((guild) => {
            console.log("###################################################");
            console.log("Guild -- " + guild.name + ' - ' + guild.id);
            
            // List all channels
            guild.channels.forEach((channel) => {
                console.log(`Channel -- ${channel.name} (${channel.type}) - ${channel.id}`);
            })

            // List all roles
            console.log("########### ROLES ########################");
            guild.roles.forEach((role) => {
                console.log(`Role ID -- ${role.id} (${role.name})`)
            }) 
        })

    },

    setupRoles: async function(client) {

        var rolesChannel = client.guilds.find(guild => guild.id === "536125787305410563").channels.find(channel => channel.name === "roles")

        await rolesChannel.fetchMessages({ 
            limit: 1 // Fetch the last message.
        }).then((msgCollection) => { // Resolve promise
            if(msgCollection.size == 0) {
                rolesChannel.send("**Click the icon related to your role, it grants you access to main channels in rare cases @MetaBot is offline " +
                "it means you will be unable to gain access to other channels.** \n\n" + 
                'NSW Player \t\t:regional_indicator_a: | NSW Captain \t\t:regional_indicator_b:\n'+  
                'NT-SA Player  \t:regional_indicator_c: | NT-SA Captain   \t:regional_indicator_d: \n' +
                'QLD Player  \t\t:regional_indicator_e: | QLD Captain   \t\t:regional_indicator_f: \n' +
                'TAS Player   \t\t:regional_indicator_g: | TAS Captain   \t\t:regional_indicator_h: \n' +
                'VIC Player    \t\t:regional_indicator_i: | VIC Captain    \t\t:regional_indicator_j: \n' +
                'WA player       \t:regional_indicator_k: | WA Captain       \t:regional_indicator_l: \n');
                
            }
        }).catch(console.error);
        
        rolesChannel.fetchMessages({ 
            limit: 1 // Fetch the last message.
        }).then((msg) => { // Resolve promise
            async function f () {
                await msg.first().react('🇦');
                await msg.first().react('🇧');
                await msg.first().react('🇨');
                await msg.first().react('🇩');
                await msg.first().react('🇪');
                await msg.first().react('🇫');
                await msg.first().react('🇬');
                await msg.first().react('🇭');
                await msg.first().react('🇮');
                await msg.first().react('🇯');
                await msg.first().react('🇰');
                await msg.first().react('🇱');
                await console.log(`ADD THIS TO ID TO rolesTextId ${msg.first().id}`);
            }
            if(msg.first().reactions.array().length === 0) {
                f();
            }
        }).catch(console.error);
    }
}