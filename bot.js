const client = require('./client');
const fs = require('fs');

client.connect();

//global timeout protection
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let waiting = [];

const gtp = async (channel) => {
    let position = waiting.push(channel) - 1; //pushing channel in and getting its position
    await sleep(1500);
    waiting.splice(position);
}

client.on('message', async (channel, user, message, self) => { //message listener
    if (self) {
        return;
    }

    //check repeats
    const repeat = require('./commands/repeat');
    let repeat_data = repeat.get_repeat_data(channel);
    if (user.username.toLowerCase() === repeat_data.target.toLowerCase()) {
        repeat.run(channel, message);
    }

    //check quiz answers
    const quiz = require('./commands/quiz');
    const points = require('./commands/points');
    let quiz_data = quiz.get_quiz_data(channel);
    if (message.toLowerCase().includes(quiz_data.answer.toLowerCase()) && !quiz_data.answered) {
        quiz_data.answered = true;

        let time = quiz_data.timeout / 1000 - quiz_data.time_remaining; //need this to sort amount of points for reward
        let pts;
        //less time user needs to answer, more points he gets
        if (time <= 10) {
            points.get(channel, user.username); //getting points to avoid 'target property is undefined' when user has no points in points.json
            points.give(channel, 300, user.username);
            pts = 300;
        } else if (time <= 20) {
            points.get(channel, user.username);
            points.give(channel, 200, user.username);
            pts = 200;
        } else {
            points.get(channel, user.username);
            points.give(channel, 100, user.username);
            pts = 100;
        }

        client.say(channel, `@${user.username} correct! the answer was [${quiz_data.answer}], you received ${pts} points`);

        fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz_data, null, 1));
    }
})

client.on('message', async (channel, user, message, self) => { //command listener are separated cause i dont
    if (waiting.includes(channel) || self) { //want gtp to block message listener
        return;
    }

    const whitelisted = require('./whitelist_check');
    switch(message.split(' ')[0]) {
        case '&help':
            client.say(channel, `@${user.username} no elp NOPERS`);
            gtp(channel);
            break;

        case '&info':
            client.say(channel, `@${user.username} information about the bot and all source code here => https://github.com/bqoul/qoubot`);
            gtp(channel);
            break;

        case '&repeat':
            if (whitelisted(channel, user)) {
                const repeat = require('./commands/repeat');
                repeat.set_target(channel, user, message);
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&stop':
            if (whitelisted(channel, user)) {
                const stop = require('./commands/stop');
                stop(channel, user);
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&weather':
            const weather = require('./commands/weather');
            await weather(channel, user, message);
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
            const gay = require('./commands/gay');
            gay(channel, user, message);
            gtp(channel);
            break;

        case '&iq':
            const iq = require('./commands/iq');
            iq(channel, user, message);
            gtp(channel);
            break;

        case '&quiz':
            const quiz = require('./commands/quiz');
            quiz.run(channel, user, message);
            gtp(channel);
            break;

        case '&points':
            const points = require('./commands/points');
            points.command(channel, user, message);
            gtp(channel);
            break;

        case '&count':
            const count = require('./commands/count');
            count(channel, user, message);
            gtp(channel);
            break;

        case '&gamble':
            const gamble = require('./commands/gamble');
            gamble(channel, user, message);
            gtp(channel);
            break;

        case '&command':
            if (whitelisted(channel, user)) {
                const command = require('./commands/command');
                command.set(channel, user, message);
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&counter':
            if (whitelisted(channel, user)) {
                const counter = require('./commands/counter');
                counter.set(channel, user, message);
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        default:
            const command = require('./commands/command');
            const counter = require('./commands/counter');

            let commands = command.get(channel);
            let counters = counter.get(channel);
            if (message.split(' ')[0] in commands) {
                client.say(channel, commands[message.split(' ')[0]]);
                gtp(channel);
            } else if (message.split(' ')[0] in counters) {
                counters[message.split(' ')[0]].times += 1;
                client.say(channel, counters[message.split(' ')[0]].text.replace('&', counters[message.split(' ')[0]].times));
                fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify(counters, null, 1));
                gtp(channel);
            }
            break;
    }
});