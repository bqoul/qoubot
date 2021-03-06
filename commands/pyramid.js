const twitch = require('../twitch');

module.exports = (channel, message) => {
    let times = message.split(' ')[2];
    let emote = message.split(' ')[1] + ' ';

    if (message.split(' ')[1] === undefined) {
        twitch.bot.say(channel, `@${usr.username} please choose an emote`)
    } else {
        if (times < 3 || times === undefined) {
            times = 3;
        } else if (times > 7) {
            times = 7;
        }

        for (let i = 1; i < times; i++) {
            twitch.bot.say(channel, emote.repeat(i));
        }
        for (times - 1; times > 0; times--) {
            twitch.bot.say(channel, emote.repeat(times));
        }
    }
}