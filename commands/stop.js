const fs = require('fs');
const bot = require('../bot');

const stop = (channel, user) => {
    let repeat_data = JSON.parse(fs.readFileSync(`data/repeat/${channel}.json`));
    
    repeat_data.target = '';

    bot.say(channel, `@${user.username} ok sorry Sadge`);
    fs.writeFileSync(`data/repeat/${channel}.json`, JSON.stringify(repeat_data, null, 1));
}

module.exports = stop;