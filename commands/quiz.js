const twitch = require('../twitch');
const whitelisted = require('../alias/whitelist_check');
const fetch = require('node-fetch');
const fs = require('fs');

let quiz_intervals = {};

const get_quiz_data = (channel) => {
    try {
        return JSON.parse(fs.readFileSync(`data/quiz/${channel}.json`));
    } catch {
        fs.mkdirSync('data/quiz', {recursive: true});
        fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify({
                running: false,
                delay: 300000,
                answer: '',
                answered: true,
                time_remaining: 300,
        }, null, 1));
        return JSON.parse(fs.readFileSync(`data/quiz/${channel}.json`));
    } 
}

const get_guiz_intervals = (channel) => {
    if (!(channel in quiz_intervals)) {
        Object.defineProperty(quiz_intervals, channel, {
            value: {
                interval: undefined,
                timer_interval: undefined,
            },
            enumerable: true,
            writable: true,
            configurable: true,
        });
    }

    return quiz_intervals;
}

const answer_cleaner = (msg) => { //removing all trash from answer
    let articles = ['the', 'The', 'a', 'A', 'an', 'An', 'to'];
    let tags = ['</i>', '<i>', '</I>', '"', '(', ')', "'", '\\'];

    for (let i = 0; i < articles.length; i++) {
        if (msg.split(' ')[0] == articles[i]) {
            msg = msg.replace(articles[i], '').slice(1);
        }
    }

    const tags_cleaner = (msg, tag) => {
        if(!msg.includes(tag)) return msg;
        return tags_cleaner(msg.replace(tag, ""));
    }

    for (let i = 0; i < tags.length; i++) {
        msg = tags_cleaner(msg, tags[i]);
    }

    return msg;
}

const run = (channel, user, message) => {
    let quiz = get_quiz_data(channel);

    //defining this function here cause i need to create interval with it
    const quiz_run = async () => {
        let response = await fetch('http://jservice.io/api/random?count=1');
        let quiz_responce = await response.json();
        let quiz_question = quiz_responce[0].question;
        let quiz_category = quiz_responce[0].category.title;

        quiz.answered = false;
        quiz.answer = answer_cleaner(quiz_responce[0].answer);

        twitch.bot.say(channel, `/me question from [${quiz_category}] category: ${quiz_question}`)

        clearInterval(quiz_intervals.timer_interval);
        quiz.time_remaining = quiz.delay / 1000;
        quiz_intervals.timer_interval = setInterval(quiz_timer, 1000);

        //logging the answer in console for debugging purpuses (forsenCD)
        console.log('-----------------');
        console.log(`ANSWER: ${quiz.answer}`);
        console.log('-----------------');

        fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz, null, 1));
    }

    //defining this function here cause i need to create interval with it
    const quiz_timer = async () => { //getting remaining time to the next question, so users can spam '&quiz when'
        quiz = get_quiz_data(channel);
        quiz.time_remaining -= 1;

        if (quiz.delay / 1000 - quiz.time_remaining === 30 && !quiz.answered) { //send the answer in chat if no one gave the correct answer for 30 seconds
            twitch.bot.say(channel, `/me no one gave the correct answer, it was [${quiz.answer}]`);
            quiz.answered = true;
        }

        fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz, null, 1));
    }

    switch (message.split(' ')[1]) {
        case 'start':
            if (whitelisted(channel, user)) {
                if (quiz.running) {
                    twitch.bot.say(channel, `@${user.username} quiz already running`);
                } else {
                    quiz.running = true;

                    quiz_run();
                    quiz_intervals = get_guiz_intervals(channel);
                    quiz_intervals.interval = setInterval(quiz_run, quiz.delay);

                    fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz, null, 1));
                }
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'stop':
            if (whitelisted(channel, user)) {
                if (!quiz.running) {
                    twitch.bot.say(channel, `@${user.username} quiz is not running currently`);
                } else {
                    quiz.running = false;

                    quiz_intervals = get_guiz_intervals(channel);
                    clearInterval(quiz_intervals.interval);
                    clearInterval(quiz_intervals.timer_interval);
                    twitch.bot.say(channel, `@${user.username} quiz has been stopped`);

                    fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz, null, 1));
                }
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'delay':
            if (whitelisted(channel, user)) {
                if (message.split(' ')[2] < 60) {
                    twitch.bot.say(channel, `@${user.username} delay cant be less than 60 seconds`);
                } else if (Number.isNaN(message.split(' ')[2] * 1000)) { //checking if user sent actual number, not 'lsakdjf\*#$@()'
                    twitch.bot.say(channel, `@${user.username} this is not a number`);
                } else if (quiz.running) {
                    twitch.bot.say(channel, `@${user.username} cant change delay while quiz is running`);
                } else {
                    quiz.delay = message.split(' ')[2] * 1000;
                    quiz.time_remaining = quiz.delay / 1000;
                    twitch.bot.say(channel, `@${user.username} delay has been set to ${message.split(' ')[2]} seconds`);

                    fs.writeFileSync(`data/quiz/${channel}.json`, JSON.stringify(quiz, null, 1));
                }
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'next':
            if (whitelisted(channel, user)) {
                if (quiz.running) {
                    clearInterval(quiz_intervals.interval);

                    quiz_run();
                    quiz_intervals = get_guiz_intervals(channel);
                    quiz_intervals.interval = setInterval(quiz_run, quiz.delay);
                } else {
                    quiz_run();
                }
            } else {
                twitch.bot.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'when':
            if (quiz.running) {
                let min = ~~((quiz.time_remaining % 3600) / 60);
                let sec = quiz.time_remaining % 60;

                if (min != 0) {
                    twitch.bot.say(channel, `@${user.username} next question will arrive in ${min} min ${sec} sec`);
                } else {
                    twitch.bot.say(channel, `@${user.username} next question will arrive in ${sec} sec`);
                }
            } else {
                twitch.bot.say(channel, `@${user.username} quiz is not running currently`);
            }
            break;
    }
}

module.exports.run = run;
module.exports.get_quiz_data = get_quiz_data;