const bot = require('../bot');

const iq = (channel, user, message) => {
    let iq = ~~(Math.random() * (150 - -1 + 1)) + -1;
    let target = message.split(' ')[1];

    if (target === undefined) {
        bot.say(channel, `@${user.username} you have ${iq}iq`);
    } else {
        bot.say(channel, `${target} has ${iq} iq`);
    }
}

module.exports = iq;