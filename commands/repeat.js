const twitch = require('../twitch');
const fs = require('fs');

const set_target = (channel, user, message) => {
    let repeat_data = get_repeat_data(channel);

    repeat_data.target = message.split(' ')[1];
    repeat_data.shuffle = false;

    if (message.split(' ')[2] === 'shuffle') {
        repeat_data.shuffle = true;
    }

    twitch.bot.say(channel, `@${user.username} got him TriHard`);
    fs.writeFileSync(`data/repeat/${channel}.json`, JSON.stringify(repeat_data, null, 1));
}

const run = (channel, message) => {
    let repeat_data = get_repeat_data(channel);

    if (repeat_data.shuffle) {
        msg = message.split(' ');

        for (let i = msg.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [msg[i], msg[j]] = [msg[j], msg[i]];
        }

        message = msg.join(' ');
    }

    twitch.bot.say(channel, message);
}

function get_repeat_data(channel) {
    try {
        return JSON.parse(fs.readFileSync(`data/repeat/${channel}.json`));
    } catch {
        fs.mkdirSync('data/repeat');
        fs.writeFileSync(`data/repeat/${channel}.json`, JSON.stringify({
            target: '',
            shuffle: false,
        }, null, 1));
        return JSON.parse(fs.readFileSync(`data/repeat/${channel}.json`));
    } 
}

module.exports.set_target = set_target;
module.exports.get_repeat_data = get_repeat_data;
module.exports.run = run;