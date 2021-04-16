const client = require('../client');
const fs = require('fs');

let repeat_data = undefined;

const set_target = (channel, user, message) => {
    repeat_data = get_repeat_data(channel);

    repeat_data[channel].target = message.split(' ')[1];
    repeat_data[channel].shuffle = false;

    if (message.split(' ')[2] === 'shuffle') {
        repeat_data[channel].shuffle = true;
    }

    client.say(channel, `@${user.username} got him TriHard`);
    fs.writeFileSync('data/repeat.json', JSON.stringify(repeat_data, null, 1));
}

const run = (channel, message) => {
    repeat_data = get_repeat_data(channel);

    if (repeat_data[channel].shuffle) {
        msg = message.split(' ');

        for (let i = msg.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [msg[i], msg[j]] = [msg[j], msg[i]];
        }

        message = msg.join(' ');
    }

    client.say(channel, message);
}

function get_repeat_data(channel) {
    let repeat_data = JSON.parse(fs.readFileSync('data/repeat.json'));

    if (!(channel in repeat_data)) {
        Object.defineProperty(repeat_data, channel, {
            value: {
                target: '',
                shuffle: false,
            },
            enumerable: true,
            writable: true,
            configurable: true,
        })
    }

    return repeat_data;
}

module.exports.set_target = set_target;
module.exports.run = run;