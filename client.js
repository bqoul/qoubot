const tmi = require('tmi.js');
const fs = require('fs');

const oauth = JSON.parse(fs.readFileSync('oauth.json'));
const channels = JSON.parse(fs.readFileSync('channels.json'));

module.exports = {
    client : new tmi.Client({
        options: {debug: true},
        connection: {reconnect: true},
        identity: {
            username: 'qoubot',
            password: oauth.token,
        },
        channels: channels.list,
    })
}