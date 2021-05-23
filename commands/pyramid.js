const bot = require('../bot');

const pyramid = (channel, message) => {
    let times = message.split(' ')[2];
    let emote = message.split(' ')[1] + ' ';

    if (message.split(' ')[1] === undefined) {
        bot.say(channel, `@${usr.username} please choose an emote`)
    } else {
        if (times < 3 || times === undefined) {
            times = 3;
        } else if (times > 7) {
            times = 7;
        }

        for (let i = 1; i < times; i++) {
            bot.say(channel, emote.repeat(i));
        }
        for (times - 1; times > 0; times--) {
            bot.say(channel, emote.repeat(times));
        }
    }
}

module.exports = pyramid;