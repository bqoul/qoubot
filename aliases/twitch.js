require('dotenv').config();

const tmi = require('tmi.js');
const TwitchApi = require("node-twitch").default;

module.exports = {
    bot: (channel) => {
        return new tmi.Client({
            options: {debug: true},
            connection: {reconnect: true},
            identity: {
                username: 'qoubot',
                password: process.env.OAUTH_TOKEN,
            },
            channels: [channel],
        });
    },
    api: new TwitchApi({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    })
}