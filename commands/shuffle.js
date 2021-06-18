const twitch = require('../twitch');

module.exports = (channel, message) => {
    message = message.slice(9);
    let msg = message.split(' ');

    for (let i = msg.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [msg[i], msg[j]] = [msg[j], msg[i]];
    }
    message = msg.join(' ');

    twitch.bot.say(channel, message);
}