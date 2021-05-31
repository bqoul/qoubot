const twitch = require('../twitch');
const fs = require('fs');

const get = (channel) => {
    try {
        return JSON.parse(fs.readFileSync(`./data/nukes/${channel}.json`));
    } catch {
        fs.mkdirSync('./data/nukes', {recursive: true});
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
                    twitch.bot.say(channel, `@${user.username} phrase "${phrase}" already in the nuke list`);
                    return;
                }
            }

            nukes.push(phrase);
            fs.writeFileSync(`./data/nukes/${channel}.json`, JSON.stringify(nukes, null, 1));

            twitch.bot.say(channel, `@${user.username} phrase "${phrase}" was added to the nuke list`);
            break;

        case 'remove':
            let removed = false;
            for(i = 0; i < nukes.length; i++) {
                if(nukes[i] == phrase && !removed) {
                    nukes.splice(i, 1);

                    fs.writeFileSync(`./data/nukes/${channel}.json`, JSON.stringify(nukes, null, 1));
                    twitch.bot.say(channel, `@${user.username} phrase "${phrase}" was removed from the nuke list`);
                    removed = true;
                }
            }
            if (!removed) {
                twitch.bot.say(channel, `@${user.username} theres to such phrase in the nuke list`);
            }

            break;
    }
}

module.exports.run = run;
module.exports.get = get;