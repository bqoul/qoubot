const fs = require('fs');
const client = require('../client');

const stop = (channel, user) => {
    let rep = {
        target: '',
        shuffle: false,
    }

    client.say(channel, `@${user.username} ok sorry Sadge`);
    fs.writeFileSync('data/repeat.json', JSON.stringify(rep, null, 1));
}

module.exports = stop;