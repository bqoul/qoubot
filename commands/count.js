const bot = require("../bot");
const math = require('mathjs');

const count = (channel, user, message) => {
    try {
        let result = math.evaluate(message.slice(7));
        bot.say(channel, `@${user.username} ${message.slice(7)} = ${result}`);
    } catch {
        bot.say(channel, `@${user.username} i cant count this`);
    }
}

module.exports = count;