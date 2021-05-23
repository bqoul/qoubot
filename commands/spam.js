const twitch = require('../twitch');

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = (channel, message) => {
    message = message.slice(message.split(' ')[0].length);
    for(i = 0; i < 5; i++) {
        twitch.bot.say(channel, message);
        sleep(500);
    }
}