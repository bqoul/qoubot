const client = require('../client');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('data/repeat.json'));

let rep = {
    target: data.target,
    shuffle: data.shuffle,
}

const set_target = (channel, user, message) => {
    rep.target = message.split(' ')[1];
    rep.shuffle = false;

    if (message.split(' ')[2] === 'shuffle') {
        rep.shuffle = true;
    }

    client.say(channel, `@${user.username} got him TriHard`);
    fs.writeFileSync('data/repeat.json', JSON.stringify(rep, null, 1));
}

const run = (channel, message) => {
    if (rep.shuffle) {
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
module.exports.run = run;