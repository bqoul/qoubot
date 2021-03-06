const twitch = require('./twitch');
const fs = require('fs');

twitch.bot.connect();

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

twitch.bot.on('message', async (channel, user, message, self) => { //message listener
    if (self) {
        return;
    }

    //check nukes
    const nuke = require('./commands/nuke');
    let nukes = nuke.get(channel);
    for(i = 0; i < nukes.length; i++) {
        if(message.toLowerCase().includes(nukes[i].toLowerCase()) && message.split(' ')[0] != '&nuke') {
            twitch.bot.timeout(channel, user.username, 60, 'nuked');
        }
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

        let time = quiz_data.delay / 1000 - quiz_data.time_remaining; //need this to sort amount of points for reward
        let pts;
        //less time user needs to answer, more points he gets
        if (time <= 10) {
            pts = 300;
        } else if (time <= 20) {
            pts = 200;
        } else {
            pts = 100;
        }

        points.get(channel, user.username); //getting points to avoid 'target property is undefined' when user has no points in points.json
        points.give(channel, pts, user.username);
        twitch.bot.say(channel, `@${user.username} correct! the answer was [${quiz_data.answer}], you received ${pts} points`);

        fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz_data, null, 1));
    }
});

twitch.bot.on('message', async (channel, user, message, self) => { //command listener are separated cause i dont
    if (waiting.includes(channel) || self) { //want gtp to block message listener
        return;
    }

    const whitelisted = require('./alias/whitelist_check');
    const command_tag = message.split(' ')[0].toLowerCase();
    switch(command_tag) {
        case '&help':
            twitch.bot.say(channel, `@${user.username} no elp NOPERS`);
            gtp(channel);
            break;

        case '&info':
            twitch.bot.say(channel, `@${user.username} information about the bot and all source code here => https://github.com/bqoul/qoubot`);
            gtp(channel);
            break;

        case '&repeat':
            if (whitelisted(channel, user)) {
                const repeat = require('./commands/repeat');
                repeat.set_target(channel, user, message);
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&stop':
            if (whitelisted(channel, user)) {
                const stop = require('./commands/stop');
                stop(channel, user);
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
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
            twitch.bot.timeout(channel, user.username, 1, 'vanish');
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
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&counter':
            if (whitelisted(channel, user)) {
                const counter = require('./commands/counter');
                counter.set(channel, user, message);
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&nuke':
            if (whitelisted(channel, user)) {
                const nuke = require('./commands/nuke');
                nuke.run(channel, message, user);
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        case '&exchange':
            const exchange = require('./commands/exchange');
            exchange(channel, user.username, message);
            gtp(channel);
            break;

        case '&spam':
            const spam = require('./commands/spam');
            if (whitelisted(channel, user)) {
                spam(channel, message);
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            gtp(channel);
            break;

        default: //if none of the commands matched check for custom ones
            const command = require('./commands/command');
            const counter = require('./commands/counter');

            let commands = command.get(channel);
            let counters = counter.get(channel);

            if (command_tag in commands) {
                twitch.bot.say(channel, commands[command_tag]);
                gtp(channel);
            } else if (command_tag in counters) {
                counters[command_tag].times += 1;
                twitch.bot.say(channel, counters[command_tag].text.replace('&', counters[command_tag].times));
                fs.writeFileSync(`data/counters/${channel}.json`, JSON.stringify(counters, null, 1));
                gtp(channel);
            }
            break;
    }
});