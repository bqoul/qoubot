const tmi = require('tmi.js');
const fs = require('fs');

const key = JSON.parse(fs.readFileSync('keys.json'));
const channels = JSON.parse(fs.readFileSync('channels.json'));

const client = new tmi.Client({
    options: {debug: true},
    connection: {reconnect: true},
    identity: {
        username: 'qoubot',
        password: key.oauth,
    },
    channels: channels.list,
});

module.exports = client;