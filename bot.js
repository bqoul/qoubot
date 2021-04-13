const client = require('./client');

client.connect();

//global timeout protection
let waiting = false;
let waiting_channels = [];

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gtp = async (channel) => {
    let pos = waiting_channels.push(channel) - 1; //pushing channel in and getting its position
    waiting = true;                               //so i can disable command listener only for channel in which command was used
    await sleep(1500);
    waiting_channels.splice(pos);
    waiting = false;
}

client.on('message', async (channel, user, message, self) => { //message listeners
    if (self) {
        return;
    }
})

client.on('message', async (channel, user, message, self) => { //command listeners separated from message
    if (waiting_channels.includes(channel) && waiting || self) { //listeners cause i dont want gtp to block them
        return;
    }

    switch(message.split(' ')[0]) {
        case '&help':
            client.say(channel, `@${user.username} no elp NOPERS`);
            gtp(channel);
            break;

        case '&commands':
            client.say(channel, `@${user.username} you can find all commands here => https://github.com/bqoul/qoubot`);
            gtp(channel);
            break;

        case '&repeat':
            gtp(channel);
            break;

        case '&repeatshuffle':
            gtp(channel);
            break;

        case '&stop':
            gtp(channel);
            break;

        case '&weather':
            const weather = require('./commands/weather');
            weather(channel, user, message);
            gtp(channel);
            break;

        case '&pyramid':
            const pyramid = require('./commands/pyramid');
            pyramid(channel, message);
            gtp(channel);
            break;

        case '&shuffle':
            const shuffle = require('./commands/shuffle');
            shuffle(channel, message);
            gtp(channel);
            break;

        case '&vanish':
            client.timeout(channel, user.username, 1, 'vanish');
            break;

        case '&gay':
            gtp(channel);
            break;

        case '&iq':
            gtp(channel);
            break;

        case '&quiz':
            gtp(channel);
            break;

    }
});