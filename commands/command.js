const twitch = require('../twitch');
const fs = require('fs');

module.exports = {
    get(channel) {
        try {
            return JSON.parse(fs.readFileSync(`data/commands/${channel}.json`));
        } catch {
            fs.mkdirSync('data/commands', {recursive: true});
            fs.writeFileSync(`data/commands/${channel}.json`, JSON.stringify({}, null, 1));
            return JSON.parse(fs.readFileSync(`data/commands/${channel}.json`));
        } 
    },
    set(channel, user, message) {
        let commands = this.get(channel);

        switch (message.split(' ')[1]) {
            case 'add':
                if (!(message.split(' ')[2] in commands)) {
                    let command_text = message.slice((`${message.split(' ')[0]} ${message.split(' ')[1]} ${message.split(' ')[2]} `).length);
                    Object.defineProperty(commands, message.split(' ')[2], {
                        value: command_text,
                        enumerable: true,
                    });

                    fs.writeFileSync(`data/commands/${channel}.json`, JSON.stringify(commands, null, 1));
                    twitch.bot.say(channel, `@${user.username} command ${message.split(' ')[2]} was added successfully`);
                } else {
                    twitch.bot.say(channel, `@${user.username} such command already exists`);
                }

                break;

            case 'remove':
                if (message.split(' ')[2] in commands) {
                    delete commands[message.split(' ')[2]];
                    fs.writeFileSync(`data/commands/${channel}.json`, JSON.stringify(commands, null, 1));
                    twitch.bot.say(channel, `@${user.username} command ${message.split(' ')[2]} was removed successfully`);
                } else {
                    twitch.bot.say(channel, `@${user.username} such command does not exists`);
                }

                break;
        }
    }
}