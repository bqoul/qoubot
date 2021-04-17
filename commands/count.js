const client = require("../client");
const math = require('mathjs');

const count = (channel, user, message) => {
    try {
        let result = math.evaluate(message.slice(7));
        client.say(channel, `@${user.username} ${message.slice(7)} = ${result}`);
    } catch {
        client.say(channel, `@${user.username} i cant count this`);
    }
}

module.exports = count;