const tmi = require('tmi.js');
const fs = require('fs');

const key = JSON.parse(fs.readFileSync('data/keys.json'));
const channels = JSON.parse(fs.readFileSync('data/channels.json'));

module.exports = new tmi.Client({
    options: {debug: true},
    connection: {reconnect: true},
    identity: {
        username: 'qoubot',
        password: key.oauth,
    },
    channels: channels,
});