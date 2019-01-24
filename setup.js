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

    createRoles: function (client, serverName) {

        //Create a dictionary to store what roles have and haven't been created
        var dict = new Dict({
            'League Commissioner': false, 'Admin': false, 'Broadcast': false,
            'Teacher': false, 'NSW/ACT Teacher': false, 'NZ Teacher': false, 'SA/NT Teacher': false,
            'QLD Teacher': false, 'TAS Teacher': false, 'VIC Teacher': false,
            'WA Teacher': false, 'NSW/ACT Player': false, 'NSW/ACT Captain': false,
            'NZ Player': false, 'NZ Captain': false, 'SA/NT Player': false,
            'SA/NT Captain': false, 'QLD Player': false, 'QLD Captain': false, 'TAS Player': false,
            'TAS Captain': false, 'VIC Player': false, 'VIC Captain': false, 'WA Player': false,
            'WA Captain': false, 'Teacher': false, 'Player': false, 'Captain': false,
            'New South Wales / Australian Capital Territory': false, "New Zealand": false, 'South Australia / Northern Territory': false,
            'Queensland': false, 'Tasmania': false, 'Victoria': false, 'Western Australia': false,
        }, function (key) {
            return "default: " + key;
        });


        // Variable for guild referencing later
        var guildRef;

        client.guilds.forEach((guild) => {
            i = findGuildName(serverName);

            if (i !== false) {
                guild.roles.forEach((role) => {
                    if (dict.has(role.name)) {
                        dict.set(role.name, true);
                    }
                })
                guildRef = guild;
                guild.roles.forEach((role) => {
                    if (dict.has(role.name)) {
                        dict.set(role.name, true);
                    }
                })
            }
        })

        dict.forEach((value, key) => {
            if (!value) {
                async function f() {

                    if (key.match(/Teacher/) && key != "Teacher") {
                        await guildRef.createRole({
                            name: key,
                            color: 'f1c40f',
                        })
                    } else {
                        switch (key) {
                            case ('League Commissioner'):
                                await guildRef.createRole({
                                    name: key,
                                    color: 'RED',
                                    permissions: ['ADMINISTRATOR'],
                                })
                                break;
                            case ('Admin'):
                                await guildRef.createRole({
                                    name: key,
                                    color: 'RED',
                                    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                                        'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'CHANGE_NICKNAME', 'MOVE_MEMBERS',
                                        'USE_VAD', 'EMBED_LINKS', 'ADD_REACTIONS', 'KICK_MEMBERS', 'MANAGE_NICKNAMES',
                                        'BAN_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'CREATE_INSTANT_INVITE']
                                })
                                break;
                            case ('Broadcast'):
                                await guildRef.createRole({
                                    name: key,
                                    color: 'RED',
                                    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                                        'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'CHANGE_NICKNAME',
                                        'USE_VAD', 'EMBED_LINKS', 'ADD_REACTIONS', 'KICK_MEMBERS', 'MOVE_MEMBERS',
                                        'BAN_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'CREATE_INSTANT_INVITE']
                                })
                                break;
                            case ('Teacher'):
                                await guildRef.createRole({
                                    name: key,
                                    color: 'f1c40f',
                                    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                                        'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'CHANGE_NICKNAME',
                                        'USE_VAD', 'EMBED_LINKS', 'ADD_REACTIONS']
                                })
                                break;
                            case ('Player'):
                            case ('Captain'):
                                await guildRef.createRole({
                                    name: key,
                                    color: 'BLUE',
                                    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL',
                                        'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'CHANGE_NICKNAME',
                                        'USE_VAD', 'EMBED_LINKS', 'ADD_REACTIONS']
                                })
                                break;
                            default:
                                await guildRef.createRole({
                                    name: key,
                                    color: 'BLUE',
                                })
                                break;
                        }
                    }
                }
                f();
            }
        })

    },

    setupRoleTextChannel: async function (client, serverName) {

        i = findGuildName(serverName);
        

        var rolesChannel = client.guilds.find(guild => guild.name = serverName).channels.find(channel => channel.id === config.servers[i].roles)


        
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
                /*
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
                */
            }

            //Check for an empty reactions container
            if (msg.first().reactions.array().length === 0) {
                f();
                console.log('reached')
                let rawData = fs.readFileSync('config.json');
                let configText = JSON.parse(rawData);
                i = findGuildName(serverName);
                //console.log(configText.servers[i])
                //console.log(msg.keys().[0]);
                configText.servers[i].reaction = msg.id;
                let data = JSON.stringify(configText, null, 2);
                fs.writeFileSync('config.json', data);
                
            }
        }).catch(console.error);
        
    },

    deleteRoles: function (client, serverName) {
        client.guilds.find(guild => guild.name = serverName)
            .roles.forEach((role) => {
                if (role.name != 'MetaBOT' && role.name != '@everyone') {
                    role.delete();
                }
            })
    },

    deleteChannels: function (client, serverName) {
        console.log(serverName)

        if (client.guilds.find(guild => guild.name = serverName) === null) {
            console.log('bruh, you enter a server name')
        } else {
            client.guilds.find(guild => guild.name = serverName)
                .channels.forEach((channel) => {
                    channel.delete();
                })
        }

    },

    setupCategoryChannels: function (client, serverName) {

        var dict = new Dict({
            'Production': false, 'Teacher Lounge': false,
            'Check In': false, 'Game': false, 'Other': false, 'Voice Channels': false
        });

        guild = client.guilds.find(guild => guild.name = serverName)

        if (guild !== null) {
            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
                    i = findGuildId(guild.id);
                    switch (key) {
                        case ('Production'):
                            guild.createChannel(key, 'category').then(channel => {
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions((config.servers[i].Admin), {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: false,
                                })
                            })
                            break;
                        case ('Teacher Lounge'):
                            guild.createChannel(key, 'category').then(channel => {
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Admin), {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
                                    VIEW_CHANNEL: true,
                                })
                            })
                            break;
                        case ('Check In'):
                            guild.createChannel(key, 'category').then(channel => {
                                channel.overwritePermissions((config.servers[i].Captain), {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions((config.servers[i].Player), {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions((config.servers[i].Broadcast), {
                                    VIEW_CHANNEL: false,
                                })
                                channel.overwritePermissions((config.servers[i].Admin), {
                                    VIEW_CHANNEL: true,
                                })
                                channel.overwritePermissions((config.servers[i].Teacher), {
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

                }
            })
        }



    },

    setupGlobalChannels: function (client, serverName) {

        var dict = new Dict({
            'welcome-and-rules': false, 'announcements': false,
            'faq': false, 'links': false, 'roles': false, 'bot-commands': false
        });

        guild = client.guilds.find(guild => guild.name = serverName);

        if (guild !== null) {
            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })
            i = findGuildName(serverName);

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
                                })
                            })
                            break;
                    }
                }
            })
        }
    },

    setupAdminChannels: function (client, serverName) {

        var dict = new Dict({
            'admin-chat': false, 'production-chat': false,
            'admin-voice': false, 'broadcast': false
        });

        guild = client.guilds.find(guild => guild.name = serverName);



        if (guild !== null) {
            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            i = findGuildName(serverName);

            dict.forEach((value, key) => {
                if (!value) {
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

                }
            })
        }
    },

    setupTeacherLoungeChannels: function (client, serverName) {

        var dict = new Dict({
            'lounge': false, 'nsw-act': false,
            'nz': false, 'sa-nt': false, 'qld': false,
            'tas': false, 'vic': false, 'wa': false
        });

        guild = client.guilds.find(guild => guild.name = serverName);

        if (guild !== null) {

            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
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

                }
            })
        }
    },

    setupCheckInChannels: function (client, serverName) {

        var dict = new Dict({
            'nsw-act-checkin': false,
            'nz-checkin': false, 'sa-nt-checkin': false, 'qld-checkin': false,
            'tas-checkin': false, 'vic-checkin': false, 'wa-checkin': false
        });

        guild = client.guilds.find(guild => guild.name = serverName);
        if (guild !== null) {

            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
                    switch (key) {
                        case ('nsw-act-checkin'):
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
                                channel.overwritePermissions(config.servers[i].NSWPlayer, {
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: false,
                                })
                                channel.overwritePermissions(config.servers[i].NSWACaptain, {
                                    VIEW_CHANNEL: true,
                                })
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('nz-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('sa-nt-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('qld-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('tas-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('vic-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        case ('wa-checkin'):
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
                                channel.setParent(config.servers[i].CheckIn);
                            })
                            break;
                        default:
                            break;
                    }

                }
            })
        }
    },

    setupGameChannels: function (client, serverName) {

        var dict = new Dict({
            'results': false, 'questions': false,
            'rules-discussion': false, 'general-chat': false
        });

        guild = client.guilds.find(guild => guild.name = serverName);



        if (guild !== null) {
            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
                    switch (key) {
                        default:
                            guild.createChannel(key, 'text').then(channel => {
                                channel.setParent(config.servers[i].Game)
                            })
                            break;
                    }
                }
            })
        }

    },

    setupOtherChannels: function (client, serverName) {
        guild = client.guilds.find(guild => guild.name = serverName);



        if (guild !== null) {
            var dict = new Dict({
                'highlight-plays': false, 'streamed-game': false,
                'looking-for-scrim': false
            });

            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
                    switch (key) {
                        default:
                            guild.createChannel(key, 'text').then(channel => {
                                channel.setParent(config.servers[i].Other)
                            })
                            break;
                    }

                }
            })
        }
    },

    setupVoiceChannels: function (client, serverName) {

        var dict = new Dict({
            'help-channel-one': false, 'help-channel-two': false,
            'help-channel-three': false, 'help-channel-four': false
        });
        guild = client.guilds.find(guild => guild.name = serverName);



        if (guild !== null) {
            guild.channels.forEach((channel) => {
                if (dict.has(channel.name)) {
                    dict.set(channel.name, true);
                }
            })

            dict.forEach((value, key) => {
                if (!value) {
                    switch (key) {
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
                                })
                                channel.setParent(config.servers[i].VoiceChannels)
                            })
                            break;
                    }

                }
            })
        }
    },

    findGuildName: function (name) {
        for (i = 0; i < config.servers.length; i++) {
            if (name === config.servers[i].name) {
                return i;
            }
        }
        return false;
    },

    findGuildId: function (id) {
        for (i = 0; i < config.servers.length; i++) {
            if (id === config.servers[i].id) {
                return i;
            }
        }
        return false;
    }

}


function findGuildName(name) {
    for (i = 0; i < config.servers.length; i++) {
        if (name === config.servers[i].name) {
            return i;
        }
    }
    return false;
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


