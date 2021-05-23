const tmi = require('tmi.js');
const TwitchApi = require("node-twitch").default;
const fs = require('fs');

const key = JSON.parse(fs.readFileSync('data/keys.json'));
const channels = JSON.parse(fs.readFileSync('data/channels.json'));


module.exports = {
    bot: new tmi.Client({
        options: {debug: true},
        connection: {reconnect: true},
        identity: {
            username: 'qoubot',
            password: key.oauth,
        },
        channels: channels,
    }),
    api: new TwitchApi({
        client_id: 'y8edt9rbwjfeylx00rzp3g0cwtw4g2',
        client_secret: '604w329yh1hf1qt213uig1omuyu8g3',
    })
}