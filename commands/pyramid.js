const client = require('../client');

const pyramid = (channel, message) => {
    let times = message.split(' ')[2];
    let emote = message.split(' ')[1] + ' ';

    if (emote === undefined) {
        client.say(channel, `@${usr.username} please choose an emote`)
    } else {
        if (times < 3 || times === undefined) {
            times = 3;
        } else if (times > 7) {
            times = 7;
        }

        for (let i = 1; i < times; i++) {
            client.say(channel, emote.repeat(i));
        }
        for (times - 1; times > 0; times--) {
            client.say(channel, emote.repeat(times));
        }
    }
}

module.exports = pyramid;