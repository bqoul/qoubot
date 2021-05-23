require('dotenv').config();

const tmi = require('tmi.js');
const TwitchApi = require("node-twitch").default;
const fs = require('fs');
const channels = JSON.parse(fs.readFileSync('data/channels.json'));


module.exports = {
    bot: new tmi.Client({
        options: {debug: true},
        connection: {reconnect: true},
        identity: {
            username: 'qoubot',
            password: process.env.OAUTH_TOKEN,
        },
        channels: channels,
    }),
    api: new TwitchApi({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    })
}