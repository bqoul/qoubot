const client = require('../client');

const iq = (channel, user, message) => {
    let iq = Math.floor(Math.random() * (150 - -1 + 1)) + -1;
    let target = message.split(' ')[1];

    if (target === undefined) {
        client.say(channel, `@${user.username} you have ${iq}iq`);
    } else {
        client.say(channel, `${target} has ${iq} iq`);
    }
}

module.exports = iq;