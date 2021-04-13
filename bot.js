const c = require('./client');

c.client.connect();

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

c.client.on('message', async (channel, user, message, self) => { //command listeners
    if (waiting_channels.includes(channel) && waiting || self) {
        return;
    }

    switch(message.split(' ')[0]) {
        case '&help':
            c.client.say(channel, `@${user.username} no elp NOPERS`);
            gtp(channel);
            break;

        case '&commands':
            c.client.say(channel, `@${user.username} you can find all commands here => https://github.com/bqoul/qoubot`);
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
            gtp(channel);
            break;

        case '&pyramid':
            gtp(channel);
            break;

        case '&shuffle':
            gtp(channel);
            break;

        case '&vanish':
            gtp(channel);
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

c.client.on('message', async (channel, user, message, self) => { //message listeners
    if (self) {
        return;
    }
})