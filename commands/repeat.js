const client = require('../client');
const fs = require('fs');

let repeat_data = JSON.parse(fs.readFileSync('data/repeat.json'));
let target = repeat_data.target;
let shuffle = repeat_data.shuffle;

const set_target = (channel, user, message) => {
    target = message.split(' ')[1];
    shuffling = false;

    if (message.split(' ')[2] == 'shuffle') {
        shuffling = true;
    }

    client.say(channel, `@${user.username} got him TriHard ${target}`);
}

const repeat = (channel, message) => {
    if (shuffle) {
        msg = message.split(' ');

        for (let i = msg.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [msg[i], msg[j]] = [msg[j], msg[i]];
        }

        message = msg.join(' ');
    }

    client.say(channel, message);
}

module.exports.set_target = set_target;
module.exports.target = target;
module.exports.repeat = repeat;