const client = require('../client');
const fs = require('fs');

const get = (channel) => {
    try {
        return JSON.parse(fs.readFileSync(`./data/nukes/${channel}.json`));
    } catch {
        fs.mkdirSync('./data/nukes');
        fs.writeFileSync(`./data/nukes/${channel}.json`, JSON.stringify([], null, 1));
        return JSON.parse(fs.readFileSync(`./data/nukes/${channel}.json`));
    } 
}

const run = (channel, message, user) => {
    let nukes = get(channel);
    let phrase = message.slice(`${message.split(' ')[0]} ${message.split(' ')[1]} `.length);

    switch(message.split(' ')[1]) {
        case 'add':
            for(i = 0; i < nukes.length; i++) {
                if(nukes[i] == phrase) { 
                    client.say(channel, `@${user.username} phrase "${phrase}" already in the nuke list`);
                    return;
                }
            }

            nukes.push(phrase);
            fs.writeFileSync(`./data/nukes/${channel}.json`, JSON.stringify(nukes, null, 1));

            client.say(channel, `@${user.username} phrase "${phrase}" was added to the nuke list`);
            break;

        case 'remove':
            for(i = 0; i < nukes.length; i++) {
                if(nukes[i] == phrase) {
                    nukes.splice(i, 1);

                    fs.writeFileSync(`./data/nukes/${channel}.json`, JSON.stringify(nukes, null, 1));
                    client.say(channel, `@${user.username} phrase "${phrase}" was removed from the nuke list`);
                } else {
                    client.say(channel, `@${user.username} theres to such phrase in the nuke list`);
                }
            }

            break;
    }
}

module.exports.run = run;
module.exports.get = get;