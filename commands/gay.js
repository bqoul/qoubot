const client = require('../client');

const gay = (channel, user, message) => {
    let persent = Math.floor(Math.random() * (100 - -1 + 1)) + -1;
    let target = message.split(' ')[1];

    if (target === undefined) {
        if (persent < 50) {
            client.say(channel, `@${user.username} you are ${persent}% gay Kappa`);
        } else if (persent > 50) {
            client.say(channel, `@${user.username} you are ${persent}% gay KappaPride`);
        } else if (persent == -1) {
            client.say(channel, `@${user.username} you are a̷͂̌s̴̛͠%̴̈́̓ gay AppaK`);
        }
    } else {
        if (persent < 50) {
            client.say(channel, `${target} are ${persent}% gay Kappa`);
        } else if (persent > 50) {
            client.say(channel, `${target} are ${persent}% gay KappaPride`);
        } else if (persent == -1) {
            client.say(channel, `${target} are a̷͂̌s̴̛͠%̴̈́̓ gay AppaK`);
        }
    }
}

module.exports = gay;