const client = require('../client');

const gay = (channel, user, message) => {
    let persent = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
    let target = message.split(' ')[1];

    if (target === undefined) {
        if (persent < 50) {
            client.say(channel, `@${user.username} you are ${persent}% gay Kappa`);
        } else if (persent > 50) {
            client.say(channel, `@${user.username} you are ${persent}% gay KappaPride`);
        }
    } else {
        if (persent < 50) {
            client.say(channel, `${target} are ${persent}% gay Kappa`);
        } else if (persent > 50) {
            client.say(channel, `${target} are ${persent}% gay KappaPride`);
        }
    }
}

module.exports = gay;