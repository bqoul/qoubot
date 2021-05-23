const fs = require('fs');
const twitch = require('../twitch');

const stop = (channel, user) => {
    let repeat_data = JSON.parse(fs.readFileSync(`data/repeat/${channel}.json`));
    
    repeat_data.target = '';

    twitch.bot.say(channel, `@${user.username} ok sorry Sadge`);
    fs.writeFileSync(`data/repeat/${channel}.json`, JSON.stringify(repeat_data, null, 1));
}

module.exports = stop;