var Dict = require("collections/dict");
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
                console.log(`"${role.name}" : "${role.id}",`)
            }) 
        })

    },

    createRoles: function(client) {
        var guildRef;
        //Create a dictionary to store what roles have and haven't been created
        var dict = new Dict({'NSW/ACT Player' : false, 'NSW/ACT Captain' : false,
        'NZ Player' : false, 'NZ Captain': false, 'SA/NT Player' : false, 
        'SA/NT Captain' : false, 'QLD Player' : false, 'QLD Captain' : false, 'TAS Player' : false, 
        'TAS Captain' : false, 'VIC Player' : false, 'VIC Captain' : false, 'WA Player' : false, 
        'WA Captain' : false, 'Teacher' : false, 'Player' : false, 'Captain' : false, 
        'New South Wales / Australian Capital Territory' : false, "New Zealand" : false, 'South Australia / Northern Territory' : false,
        'Queensland' : false, 'Tasmania' : false, 'Victoria' : false, 'Western Australia' : false,
        'Teacher' : false, 'NSW/ACT Teacher' : false, 'SA/NT Teacher' : false,
        'QLD Teacher' : false, 'TAS Teacher' : false, 'VIC Teacher' : false,
        'WA Teacher' : false}, function (key) {
            return "default: " + key;
        });
        

        client.guilds.forEach((guild) => {
            if(guild.id === config.serverId) {
                guildRef = guild;
                guild.roles.forEach((role) => {
                    if(dict.has(role.name)) {
                        dict.set(role.name, true);
                    }
                })
            }
        })


        dict.forEach((value, key) => {
            if(!value) {
                guildRef.createRole({
                    name: key,
                    color: 'BLUE',
                })
            }
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
                'NSW-ACT Player \t:regional_indicator_a: | NSW-ACT Captain \t:regional_indicator_b:\n'+
                'NZ Player               \t:regional_indicator_c: | NZ Captain               \t:regional_indicator_d: \n' +
                'SA-NT Player        \t:regional_indicator_e: | SA-NT Captain        \t:regional_indicator_f: \n' +
                'QLD Player        \t\t:regional_indicator_g: | QLD Captain        \t\t:regional_indicator_h: \n' +
                'TAS Player         \t\t:regional_indicator_i: | TAS Captain        \t\t:regional_indicator_j: \n' +
                'VIC Player          \t\t:regional_indicator_k: | VIC Captain         \t\t:regional_indicator_l: \n' +
                'WA Player             \t:regional_indicator_m: | WA Captain             \t:regional_indicator_n: \n');
                
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
                await msg.first().react('🇲');
                await msg.first().react('🇳');
                await console.log(`ADD THIS TO ID TO rolesTextId ${msg.first().id}`);
            }

            //Check for an empty reactions container
            if(msg.first().reactions.array().length === 0) {
                f();
            }
        }).catch(console.error);
    },

    setupGlobalChannels : function(client) {
        client.guilds.forEach((guild) => {
            var dict = new Dict({'announcements' : false, 'bot-commands' : false, 
                'faq' : false, 'roles' : false})
        })
    }
}