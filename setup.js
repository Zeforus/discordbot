var Dict = require("collections/dict");
var index = require('./index.js');
var setup = require("./setup.json")

module.exports = {

    /*
     * ROLE FUNCTIONS
     */
    createRoles: function (guild) {
        var dict = new Dict(setup.roles)

        guild.roles.forEach((role) => {
            if (dict.has(role.name)) dict.set(role.name, true);
        })

        defaultColor = setup.roles["@everyone"].defaultColor


        let arr = [...dict.keys()];
        var hoist = [];
        for (let i = 0; i < arr.length; i++) {
            setTimeout(() => {
                key = arr[i];

                if (i === arr.length - 1) console.log("Completed Creating Roles");
                if (dict.get(key).setHoist === true) hoist.push(key);

                if (dict.get(key) === true) return;

                color = (dict.get(key).color !== undefined) ? dict.get(key).color : defaultColor
                permissions = (dict.get(key).permissions) ? dict.get(key).permissions : 0;
                if (dict.get(key).setHoist === true) hoist.push(key);


                guild.createRole({
                    name: key, color: color,
                    permissions: permissions
                }).then(async (role) => {
                    await role.setMentionable(true);
                })
                console.log(`Created Role: ${key}`);
            }, i * 300)
        }


        setTimeout(() => {
            for (index in hoist) {
                guild.roles.find(role => role.name === hoist[index]).setHoist(true)
            }
        }, arr.length * 300)

    },

    createReaction: async function (guild) {

        var rolesChannel = guild.channels.find(channel => channel.name === setup.reaction.channelName)

        if(rolesChannel === null) {
            console.log("Roles Text Channel not setup for server " + guild.name);
            return;
        }

        
        await rolesChannel.fetchMessages({
            limit: 2
        }).then((msgCollection) => {
            if (msgCollection.size == 0) {
                dict = new Dict(setup.reaction.messages)
                dict.forEach((value,key) => {
                    rolesChannel.send(dict.get(key).message);
                })
            }
        }).catch(console.error);


        
        rolesChannel.fetchMessages({ limit: 2 })
            .then((messages) => {
                dict = new Dict(setup.reaction.messages)
                messages.forEach(msg =>{
                    dict.forEach(async (value, key, counter = 0) => {
                        if(dict.get(key).message.replace(/[^0-9a-zA-Z]/g, '') 
                            === msg.content.replace(/[^0-9a-zA-Z]/g, '')) {
                                for (let i = 0 ,  emojis = setup.reaction.messages[key].reactions; i < emojis.length; i++) {
                                    setTimeout(async () => {
                                        msg.react(emojis[i]);
                                    }, i * 1500)   
                                    
                                }
                        }
                        
                    })
                });
            })        
    },

    /*
     * DELETE FUNCTIONS
     */
    deleteRoles: function (client, guild) {
        console.log(`Deleting Roles for Server: ${guild.name}`);
        if (guild === null || guild === undefined) return;

        guild.roles.forEach(async (role) => {
            if (role.name !== client.user.username && role.name !== '@everyone') {
                await role.delete();
            }
        })
    },

    deleteChannels: function (guild) {
        console.log(`Attempting to delete channels for ${guild.name}`);
        if (guild === null) return;

        channels = guild.channels.array();

        for (let i = 0; i < channels.length; i++) {
            setTimeout(() => {
                console.log(`Deleting Channel: ${channels[i].name}`);
                channels[i].delete()
            }, i * 250)
        }
    },


    /*
     * CREATE FUNCTIONS
     */

    createServer: async function (guild) {

        if (guild === null) return;

        var dict = new Dict(setup.channels);

        //Get the name of category channels
        let categories = [...dict.keys()];


        for (let i = 0; i < categories.length; i++) {
            setTimeout(() => {
                if (guild.channels.find(channel => channel.name === categories[i]) === null) {
                    guild.createChannel(categories[i], 'category')
                    console.log(`Creating Category Channel: ${categories[i]}`)
                }
            }, i * 300)
        }



        for (let i = 0, k = 0; i < categories.length; i++) {

            //Creates each channel within the category
            let textArr = [...new Dict(setup.channels[categories[i]].text).keys()]

            //For TEXT CHANNELS
            for (let j = 0; j < textArr.length; j++, k++) {

                setTimeout(() => {

                    key = textArr[j];

                    if (guild.channels.find(channel => channel.name === key)) return;

                    console.log(`Creating Channel: ${key}`);


                    guild.createChannel(key, 'text').then(async channel => {


                        //If there are default global permissions set them
                        permissions = dict.get(categories[i]).default
                        
                        for (role in permissions) {
                            permission = dict.get(categories[i]).default[role];
                            editedRole = guild.roles.find((tempRole) => tempRole.name === role)                 
                            channel.overwritePermissions(editedRole, permission)
                        }


                        //Find if there is any permissions to set up in the json
                        permissions = dict.get(categories[i]).text[key]
                        if (permissions !== false) {
                            for (role in permissions) {
                                permission = dict.get(categories[i]).text[key][role];
                                editedRole = guild.roles.find((tempRole) => tempRole.name === role)
                                
                                channel.overwritePermissions(editedRole, permission) 
                            }
                        }

                        setTimeout(() => {
                            channel.setParent(guild.channels.find(channel => channel.name === categories[i]))
                        }, 100)
                        
                    })

                }, (1000 + ( k * 1000) + (categories.length * 350)))


            }

            //For VOICE CHANNELS

            let voiceArr = [...new Dict(setup.channels[categories[i]].voice).keys()]

            //For TEXT CHANNELS
            for (let j = 0; j < voiceArr.length; j++ , k++) {

                setTimeout(() => {

                    key = voiceArr[j];

                    if (guild.channels.find(channel => channel.name === key)) return;

                    console.log(`Creating Channel: ${key}`);


                    guild.createChannel(key, 'text').then(async channel => {


                        //If there are default global permissions set them
                        permissions = dict.get(categories[i]).default
                        
                        for (role in permissions) {
                            permission = dict.get(categories[i]).default[role];
                            editedRole = guild.roles.find((tempRole) => tempRole.name === role)                 
                            channel.overwritePermissions(editedRole, permission)
                        }

                        //Find if there is any permissions to set up in the json
                        permissions = dict.get(categories[i]).voice[key]
                        if (permissions !== false) {
                            for (role in permissions) {
                                permission = dict.get(categories[i]).voice[key][role];
                                editedRole = guild.roles.find((tempRole) => tempRole.name === role)
                                
                                channel.overwritePermissions(editedRole, permission) 
                            }
                        }

                        setTimeout( () => {
                            channel.setParent(guild.channels.find(channel => channel.name === categories[i]))
                        }, 100)
                        
                    })

                }, (1000 + (k * 1000) + (categories.length * 350)))


            }
        }
    },
}