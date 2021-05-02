const client = require('../client');
const fs = require('fs');

const get = (channel) => {
    try {
        return JSON.parse(fs.readFileSync(`data/counters/${channel}.json`));
    } catch {
        fs.mkdirSync('data/counters', {recursive: true});
        fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify({}, null, 1));
        return JSON.parse(fs.readFileSync(`data/counters/${channel}.json`));
    } finally {
        fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify({}, null, 1));
        return JSON.parse(fs.readFileSync(`data/counters/${channel}.json`));
    }
}

const set = (channel, user, message) => { 
    let counters = get(channel);
    switch (message.split(' ')[1]) {
        case 'add':
            if (!(message.split(' ')[2] in counters)) {
                let text = message.slice((`${message.split(' ')[0]} ${message.split(' ')[1]} ${message.split(' ')[2]} `).length);
                Object.defineProperty(counters, message.split(' ')[2], {
                    value: {
                        text: text,
                        times: 0,
                    },
                    configurable: true,
                    writable: true,
                    enumerable: true,
                });

                fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify(counters, null, 1));
                client.say(channel, `@${user.username} counter ${message.split(' ')[2]} was added successfully`);
            } else {
                client.say(channel, `@${user.username} such counter already exists`);
            }

            break;

        case 'remove':
            if (message.split(' ')[2] in counters) {
                delete counters[message.split(' ')[2]];
                fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify(counters, null, 1));
                client.say(channel, `@${user.username} counter ${message.split(' ')[2]} was removed successfully`);
            } else {
                client.say(channel, `@${user.username} such counter does not exists`);
            }

            break;
    }
}

module.exports.set = set;
module.exports.get = get;