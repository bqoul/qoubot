const client = require('../client');
const fs = require('fs');

const command = (channel, user, message) => {
    let commands = JSON.parse(fs.readFileSync('data/commands.json'));
    let command_text = message.slice((`${message.split(' ')[0]} ${message.split(' ')[1]} ${message.split(' ')[2]} `).length);

    switch(message.split(' ')[1]) {
        case 'add':
            if(!(channel in commands)) {
                Object.defineProperty(commands, channel, {
                    value: {},
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }

            if (!(message.split(' ')[2] in commands[channel])) {
                Object.defineProperty(commands[channel], message.split(' ')[2], {
                    value: command_text,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });

                fs.writeFileSync('data/commands.json', JSON.stringify(commands, null, 1));
                client.say(channel, `@${user.username} command ${message.split(' ')[2]} was added successfully`);
            } else {
                client.say(channel, `@${user.username} such command already exists`);
            }
            break;

        case 'remove':
            if (message.split(' ')[2] in commands[channel]) {
                delete commands[channel][message.split(' ')[2]];
                fs.writeFileSync('data/commands.json', JSON.stringify(commands, null, 1));
                client.say(channel, `@${user.username} command ${message.split(' ')[2]} was removed successfully`);
            } else {
                client.say(chanel, `@${user.username} such command does not exists`);
            }
            break;
    }
}

module.exports = command;