var Dict = require("collections/dict");
const index = require('./index');
var config = require("./config.json");
const fs = require('fs');

module.exports = {

    updateServer: function (client) {
        let rawData = fs.readFileSync('config.json');
        let configText = JSON.parse(rawData);

        client.guilds.forEach((guild) => {

            //Fetching Guild Index
            i = findGuildId(guild.id);

            //Updating Server
            let serverName = guild.name.replace(/[^0-9a-zA-Z]/g, '');
            exists = false;

            if (i !== false) {
                if (configText.servers[i].id === guild.id) {
                    exists = true;
                    if (configText.servers[i].name != guild.name) {
                        configText.servers[i].name = serverName
                    }
                }
                if (!exists) {
                    object = {};
                    object.id = guild.id;
                    object.name = serverName;
                    configText.servers.push(object);
                }
            } else {
                if (!exists) {
                    object = {};
                    object.id = guild.id;
                    object.name = serverName;
                    configText.servers.push(object);
                }
            }
        })
        let data = JSON.stringify(configText, null, 2);
        fs.writeFileSync('config.json', data);
    },

    update: function (client) {
        let rawData = fs.readFileSync('config.json');
        let configText = JSON.parse(rawData);

        client.guilds.forEach((guild) => {

            //Fetching Guild Index
            i = findGuildId(guild.id);

            //Updating Roles
            guild.roles.forEach((role) => {
                let roleName = role.name.replace(/[^0-9a-zA-Z]/g, '');
                if (typeof (configText.servers[i][roleName]) === "undefined") {
                    configText.servers[i][roleName] = role.id;
                } else if (configText.servers[i][roleName] != role.id) {
                    configText.servers[i][roleName] = role.id;
                }
            });

            //Updating Channels
            if (configText.servers[i].id === guild.id) {
                guild.channels.forEach((channel) => {
                    if (channel.type === "text" || channel.type === "category") {
                        let channelName = channel.name.replace(/[^0-9a-zA-Z]/g, '');
                        if (typeof (configText.servers[i].channelName) === "undefined") {
                            configText.servers[i][channelName] = channel.id;
                        } else if (configText.servers[i].channelName != channel.id) {
                            configText.servers[i][channelName] = channel.id;
                        }
                    }
                })
            }
        })
        let data = JSON.stringify(configText, null, 2);
        fs.writeFileSync('config.json', data);
    },

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

    createRoles: function (guild) {


        //Create a dictionary to store what roles have and haven't been created
        var dict = new Dict({
            'League Commissioner': false, 'Admin': false, 'Broadcast': false,
            'Teacher': false, 'NSW/ACT Teacher': false, 'NZ Teacher': false,
            'SA/NT Teacher': false, 'QLD Teacher': false, 'TAS Teacher': false,
            'VIC Teacher': false, 'WA Teacher': false, 'NSW/ACT Player': false,
            'NSW/ACT Captain': false, 'NZ Player': false, 'NZ Captain': false,
            'SA/NT Player': false, 'SA/NT Captain': false, 'QLD Player': false,
            'QLD Captain': false, 'TAS Player': false, 'TAS Captain': false,
            'VIC Player': false, 'VIC Captain': false, 'WA Player': false,
            'WA Captain': false, 'Teacher': false, 'Player': false,
            'Captain': false,
            'New South Wales / Australian Capital Territory': false,
            "New Zealand": false, 'South Australia / Northern Territory': false,
            'Queensland': false, 'Tasmania': false, 'Victoria': false,
            'Western Australia': false,
        }, function (key) {
            return "default: " + key;
        });


        // Checking to see whether the role can be found
        guild.roles.forEach((role) => {
            if (dict.has(role.name)) {
                dict.set(role.name, true);
            }
        })

        // Iterate the dictionary to check for values then creates the role
        dict.forEach((value, key) => {
            if (value === true) {
                return;
            }
            
            if (key.match(/Teacher/) && key != "Teacher") {
                guild.createRole({
                    name: key,
                    color: 'f1c40f',
                })
                return;
            }

            switch (key) {
                case ('League Commissioner'):
                    guild.createRole({
                        name: key,
                        color: 'RED',
                        permissions: ['ADMINISTRATOR'],
                    })
                    break;
                case ('Admin'):
                    guild.createRole({
                        name: key,
                        color: 'RED',
                        permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                            'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK',
                            'CHANGE_NICKNAME', 'MOVE_MEMBERS', 'USE_VAD',
                            'EMBED_LINKS', 'ADD_REACTIONS', 'KICK_MEMBERS',
                            'MANAGE_NICKNAMES', 'BAN_MEMBERS',
                            'MANAGE_MESSAGES', 'MENTION_EVERYONE',
                            'CREATE_INSTANT_INVITE']
                    })
                    break;
                case ('Broadcast'):
                    guild.createRole({
                        name: key,
                        color: 'RED',
                        permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                            'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK',
                            'CHANGE_NICKNAME', 'USE_VAD', 'EMBED_LINKS',
                            'ADD_REACTIONS', 'KICK_MEMBERS', 'MOVE_MEMBERS',
                            'BAN_MEMBERS', 'MANAGE_MESSAGES',
                            'MENTION_EVERYONE', 'CREATE_INSTANT_INVITE']
                    })
                    break;
                case ('Teacher'):
                    guild.createRole({
                        name: key,
                        color: 'f1c40f',
                        permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                            'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK',
                            'CHANGE_NICKNAME', 'USE_VAD', 'EMBED_LINKS',
                            'ADD_REACTIONS']
                    })
                    break;
                case ('Player'):
                case ('Captain'):
                    guild.createRole({
                        name: key,
                        color: 'BLUE',
                        permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                            'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK',
                            'CHANGE_NICKNAME', 'USE_VAD', 'EMBED_LINKS',
                            'ADD_REACTIONS']
                    })
                    break;
                default:
                    guild.createRole({
                        name: key,
                        color: 'BLUE',
                    })
                    break;
            }
        })
    },

    setupRoleTextChannel: async function (guild) {

        i = findGuildId(guild.id)

        var rolesChannel = guild.channels.find(channel => channel.id === config.servers[i].roles)

        await rolesChannel.fetchMessages({
            limit: 1 // Fetch the last message.
        }).then((msgCollection) => { // Resolve promise
            if (msgCollection.size == 0) {
                rolesChannel.send("**Click the icon related to your role, it grants you access to main channels in rare cases @MetaBot is offline " +
                    "it means you will be unable to gain access to other channels.** \n\n" +
                    'NSW-ACT Player \t:regional_indicator_a: | NSW-ACT Captain \t:regional_indicator_b:\n' +
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
            async function f() {

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

            }

            //Check for an empty reactions container
            if (msg.first().reactions.array().length === 0) {
                f();
                let rawData = fs.readFileSync('config.json');
                let configText = JSON.parse(rawData);
                i = findGuildId(guild.id);
                configText.servers[i].reaction = msg.keys().next().value;
                let data = JSON.stringify(configText, null, 2);
                fs.writeFileSync('config.json', data);

            }
        }).catch(console.error);

    },

    deleteRoles: function (client, serverName) {
        if (serverName === undefined) {
            return;
        }
        client.guilds.find(guild => guild.name.replace(/[^0-9a-zA-Z]/g, '') === serverName).roles.forEach((role) => {
            if (role.name != 'MetaBOT' && role.name != '@everyone') {
                role.delete();
            }
        })
    },

    deleteChannels: function (guild) {
        console.log(`Attempting to delete channels for ${guild.name}`);
        guild.channels.forEach((channel) => {
            setTimeout(function() {channel.delete()}, 250);
        })
    },

    setupCategoryChannels: function (guild) {

        var dict = new Dict({
            'Production': false, 'Teacher Lounge': false, 'Game Day' : false,
            'Check In': false, 'Questions And Results' : false, 'Game': false, 
            'Voice Channels': false
        });


        //Find if guild exists
        if(guild === null) {
            return;
        }

        //Find if the channels are setup and set the dictionary values to true
        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        i = findGuildId(guild.id);


        dict.forEach((value, key) => {
            if (value === true) {
                return;
            }
            switch (key) {
                case ('Production'):
                    guild.createChannel(key, 'category')
                    .then(channel => {
                        channel.overwritePermissions(
                            (config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Broadcast), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Admin), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                    })
                    break;
                case ('Teacher Lounge'):
                    guild.createChannel(key, 'category').then(channel => {
                        channel.overwritePermissions(
                            (config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Admin), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Teacher), {
                            VIEW_CHANNEL: true,
                        })
                    })
                    break;
                case ('Questions And Results'):
                    guild.createChannel(key, 'category').then(channel => {
                        channel.overwritePermissions(
                            (config.servers[i].Captain), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Player), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Broadcast), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Admin), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Teacher), {
                            VIEW_CHANNEL: true,
                        })
                    })
                    break;
                case ('Game Day'):
                    guild.createChannel(key, 'category').then(channel => {
                        channel.overwritePermissions(
                            (config.servers[i].Captain), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Player), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Admin), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(
                            (config.servers[i].Teacher), {
                            VIEW_CHANNEL: true,
                        })
                    })
                    break;
                case ('Game'):
                case ('Other'):
                case ('Voice Channels'):
                case ('Global'):
                    guild.createChannel(key, 'category')
                    break;
                default:
                    break;
            }


        })




    },

    setupGlobalChannels: function (guild) {

        var dict = new Dict({
            'welcome-and-rules': false, 'announcements': false,
            'faq': false, 'links': false, 'roles': false, 'bot-commands': false
        });


        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        i = findGuildId(guild.id);


        dict.forEach((value, key) => {
            if (!value) {
                switch (key) {
                    case ('roles'):
                        guild.createChannel(key, 'text').then(channel => {
                            channel.overwritePermissions(config.servers[i].everyone, {
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                ADD_REACTIONS: true,
                            })
                        })
                        break;
                    case ('bot-commands'):
                        guild.createChannel(key, 'text').then(channel => {
                            channel.overwritePermissions(config.servers[i].everyone, {
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                SEND_MESSAGES: true,
                            })
                        })
                        break;
                    default:
                        guild.createChannel(key, 'text').then(channel => {
                            channel.overwritePermissions(config.servers[i].everyone, {
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                SEND_MESSAGES: false,
                            })
                            channel.overwritePermissions(
                                (config.servers[i].Captain), {
                                    SEND_MESSAGES: false,
                                })
                            channel.overwritePermissions(
                                (config.servers[i].Player), {
                                    SEND_MESSAGES: false,
                                })
                            channel.overwritePermissions(
                                (config.servers[i].Broadcast), {
                                    SEND_MESSAGES: false,
                                })
                            channel.overwritePermissions(
                                (config.servers[i].Admin), {
                                    SEND_MESSAGES: false,
                                })
                            channel.overwritePermissions(
                                (config.servers[i].Teacher), {
                                    SEND_MESSAGES: false,
                                })
                        })
                        break;
                }
            }
        })

    },

    setupAdminChannels: function (guild) {

        var dict = new Dict({
            'admin-chat': false, 'production-chat': false,
            'admin-voice': false, 'broadcast': false
        });

        if(guild === null) return;



        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        i = findGuildId(guild.id);

        dict.forEach((value, key) => {
            if (value) return;

            switch (key) {
                case ('admin-chat'):
                case ('production-chat'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].Production);
                    })
                    break;
                case ('admin-voice'):
                case ('broadcast'):
                    guild.createChannel(key, 'voice').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].Production);
                    })
                    break;
                default:
                    break;
            }


        })

    },

    setupTeacherLoungeChannels: function (guild) {

        var dict = new Dict({
            'lounge': false, 'nsw-act': false,
            'nz': false, 'sa-nt': false, 'qld': false,
            'tas': false, 'vic': false, 'wa': false
        });

        if (guild === null) return;

        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        dict.forEach((value, key) => {
            if (value) return;

            switch (key) {
                case ('lounge'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('nsw-act'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NSWACTTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('nz'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NZTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('sa-nt'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].SANTTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('qld'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].QLDTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('tas'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].TASTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('vic'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].VICTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                case ('wa'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].WATeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].TeacherLounge);
                    })
                    break;
                default:
                    break;
            }
        })
    },

    setupCheckInChannels: function (guild) {

        var dict = new Dict({
            'nsw-act-checkin': false, 'nz-checkin': false, 
            'sa-nt-checkin': false, 'qld-checkin': false,
            'tas-checkin': false, 'vic-checkin': false, 
            'wa-checkin': false,
            'nsw-act-match-reschedule': false, 'nz-match-reschedule' : false,
            'sa-nt-match-reschedule' : false, 'qld-match-reschedule': false,
            'tas-match-reschedule' : false, 'vic-match-reschedule' : false,
            'wa-match-reschedule' : false
        });

        if (guild === null) return;



        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        dict.forEach((value, key) => {
            if (value) return;

            switch (key) {
                case ('nsw-act-checkin'):
                case ('nsw-act-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NSWACTTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NSWACTPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].NSWACTCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('nz-checkin'):
                case ('nz-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NZTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].NZPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].NZCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('sa-nt-checkin'):
                case ('sa-nt-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].SANTTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].SANTPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].SANTCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('qld-checkin'):
                case ('qld-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].QLDTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].QLDPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].QLDCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('tas-checkin'):
                case ('tas-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].TASTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].TASPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].TASCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('vic-checkin'):
                case ('vic-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].VICTeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].VICPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].VICCaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                case ('wa-checkin'):
                case ('wa-match-reschedule'):
                    guild.createChannel(key, 'text').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].WATeacher, {
                            VIEW_CHANNEL: true,
                        })
                        channel.overwritePermissions(config.servers[i].WAPlayer, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false,
                        })
                        channel.overwritePermissions(config.servers[i].WACaptain, {
                            VIEW_CHANNEL: true,
                        })
                        channel.setParent(config.servers[i].GameDay);
                    })
                    break;
                default:
                    break;
            }


        })

    },

    setupGameDayChannels: function (guild) {

        var dict = new Dict({
            'nsw-act-questions': false, 'nz-questions': false,
            'sa-nt-questions': false, 'qld-questions': false,
            'tas-questions': false, 'vic-questions': false,
            'wa-questions': false, 'wa-results': false,
            'nsw-act-results': false, 'nz-results': false,
            'sa-nt-results': false, 'qld-results': false,
            'tas-results': false, 'vic-results': false,
        });




            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                
                    switch (key) {
                        case ('nsw-act-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('nz-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NZTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NZPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NZCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('sa-nt-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].SANTTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].SANTPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].SANTCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('qld-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].QLDTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].QLDPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].QLDCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('tas-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].TASTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].TASPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].TASCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('vic-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].VICTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].VICPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].VICCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('wa-questions'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].WATeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].WAPlayer, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].WACaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('nsw-act-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACTCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('nz-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NZTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].NZPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].NZCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('sa-nt-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].SANTTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].SANTPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].SANTCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('qld-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].QLDTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].QLDPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].QLDCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('tas-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].TASTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].TASPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].TASCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('vic-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].VICTeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].VICPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].VICCaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        case ('wa-results'):
                            guild.createChannel(key, 'text').then(channel => {
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions(config.servers[i].Admin, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].WATeacher, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions(config.servers[i].WAPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].WACaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                .then(channel.setParent(config.servers[i].QuestionsAndResults));
                            })
                            break;
                        default:
                            break;
                    }
                
            })
        
    },


    setupGameChannels: function (guild) {

        var dict = new Dict({
            'general-chat': false, 'rules-discussion': false, 
            'highlight-plays': false, 'streamed-game': false,
            'looking-for-scrim': false
        });

        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        dict.forEach((value, key) => {
            if (value) return;
            switch (key) {
                default:
                    guild.createChannel(key, 'text').then(channel => {
                        channel.setParent(config.servers[i].Game)
                    })
                    break;
            }
        })


    },

    setupOtherChannels: function (guild) {





        var dict = new Dict({

        });

        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })

        dict.forEach((value, key) => {
            if (value) return
            switch (key) {
                default:
                    guild.createChannel(key, 'text').then(channel => {
                        channel.setParent(config.servers[i].Other)
                    })
                    break;
            }


        })

    },

    setupVoiceChannels: function (guild) {


        var dict = new Dict({
            'waiting-for-help' : false,
            'help-channel-one': false, 'help-channel-two': false,
            'help-channel-three': false, 'help-channel-four': false
        });


        if(guild === null) {
            return;
        }

        guild.channels.forEach((channel) => {
            if (dict.has(channel.name)) {
                dict.set(channel.name, true);
            }
        })
        
        i = findGuildId(guild.id);
        console.log(`i is ${i}`)

        dict.forEach((value, key) => {
            
            if (value === true) {
                return;
            }
            switch (key) {
                case('waiting-for-help'):
                    console.log(guild.name);
                    guild.createChannel(key, 'voice').then(channel => channel.setParent(config.servers[i].VoiceChannels))
                    console.log(guild.name);
                    break;
                default:
                    guild.createChannel(key, 'voice').then(channel => {
                        channel.overwritePermissions((config.servers[i].Player), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Captain), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Teacher), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions((config.servers[i].Broadcast), {
                            VIEW_CHANNEL: false,
                        })
                        channel.overwritePermissions(config.servers[i].Admin, {
                            VIEW_CHANNEL: true,
                        }).then(channel.setParent(config.servers[i].VoiceChannels))
                       
                    })
                    break;
            }
        })
    },

    findGuildId: function (id) {
        for (i = 0; i < config.servers.length; i++) {
            if (id === config.servers[i].id) {
                return i;
            }
        }
        return false;
    },


    findGuild: function(client, serverName) {
        guild = client.guilds.find(guild => guild.name.replace(/[^0-9a-zA-Z]/g, '') === serverName);
    
    
    
        if(guild !== null) return guild;
        console.log("Guild not found")
        
    }
}

function findGuildId(id) {
    if (config.servers.length == 0) {
        return 0;
    }
    for (i = 0; i < config.servers.length; i++) {
        if (id === config.servers[i].id) {
            return i;
        }
    }

    return false;
}


