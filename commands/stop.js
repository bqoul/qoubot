const fs = require('fs');
const client = require('../client');

const stop = (channel, user) => {
    let repeat_data = JSON.parse(fs.readFileSync(`data/repeat/${channel}.json`));
    
    repeat_data[channel].target = '';

    client.say(channel, `@${user.username} ok sorry Sadge`);
    fs.writeFileSync(`data/repeat/${channel}.json`, JSON.stringify(repeat_data, null, 1));
}

module.exports = stop;