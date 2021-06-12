const twitch = require('../twitch');

module.exports = (channel, user, message) => {
    let iq = ~~(Math.random() * (150 - -1 + 1)) + -1;
    let target = message.split(' ')[1];

    if (target === undefined) {
        twitch.bot.say(channel, `@${user.username} you have ${iq}iq`);
    } else {
        twitch.bot.say(channel, `${target} has ${iq} iq`);
    }
}