const client = require('../client');
const whitelisted = require('../whitelist_check');
const fetch = require('node-fetch');
const fs = require('fs');

let quiz = JSON.parse(fs.readFileSync('data/quiz.json'));
let timer_interval = undefined;
let interval = undefined;

const run = (channel, user, message) => {
    const quiz_run = async () => {
        quiz.answered = false;
        let response = await fetch('http://jservice.io/api/random?count=1');
        let quiz_responce = await response.json();
        quiz.answer = answer_cleaner(quiz_responce[0].answer);
        let quiz_question = quiz_responce[0].question;
        let quiz_category = quiz_responce[0].category.title;

        client.say(channel, `/me question from [${quiz_category}] category: ${quiz_question}`)

        clearInterval(timer_interval);
        quiz.time_remaining = quiz.timeout / 1000;
        timer_interval = setInterval(quiz_timer, 1000);

        //logging the answer in console for debugging purpuses (forsenCD)
        console.log('-----------------');
        console.log(`ANSWER: ${quiz.answer}`);
        console.log('-----------------');

        fs.writeFileSync('data/quiz.json', JSON.stringify(quiz, null, 1));
    }

    const quiz_timer = async () => { //getting remaining time to the next question, so users can spam '&quiz when'
        quiz = JSON.parse(fs.readFileSync('data/quiz.json'));
        quiz.time_remaining -= 1;

        if (quiz.timeout / 1000 - quiz.time_remaining === 30 && !quiz.answered) { //send the answer in chat if no one gave the correct answer for 30 seconds
            client.say(channel, `/me no one gave the correct answer, it was [${quiz.answer}]`);
            quiz.answered = true;
        }

        fs.writeFileSync('data/quiz.json', JSON.stringify(quiz, null, 1));
    }

    switch (message.split(' ')[1]) {
        case 'start':
            if (whitelisted(channel, user)) {
                if (quiz.running) {
                    client.say(channel, `@${user.username} quiz already running`);
                } else {
                    quiz.running = true;

                    quiz_run();
                    interval = setInterval(quiz_run, quiz.timeout);

                    fs.writeFileSync('data/quiz.json', JSON.stringify(quiz, null, 1));
                }
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'stop':
            if (whitelisted(channel, user)) {
                if (!quiz.running) {
                    client.say(channel, `@${user.username} quiz is not running currently`);
                } else {
                    quiz.running = false;

                    clearInterval(interval);
                    clearInterval(timer_interval);
                    client.say(channel, `@${user.username} quiz has been stopped`);

                    fs.writeFileSync('data/quiz.json', JSON.stringify(quiz, null, 1));
                }
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;
            
        case 'timeout':
            if (whitelisted(channel, user)) {
                if (message.split(' ')[2] < 60) {
                    client.say(channel, `@${user.username} timeout cant be less than 60 seconds`);
                } else if (Number.isNaN(message.split(' ')[2] * 1000)) { //checking if user sent actual number, not 'lsakdjf\*#$@()'
                    client.say(channel, `@${user.username} this is not a number`);
                } else if (quiz.running) {
                    client.say(channel, `@${user.username} cant change timeout while quiz is running`);
                } else {
                    quiz.timeout = message.split(' ')[2] * 1000;
                    quiz.time_remaining = quiz.timeout / 1000;
                    client.say(channel, `@${user.username} timeout has been set to ${message.split(' ')[2]} seconds`);

                    fs.writeFileSync('data/quiz.json', JSON.stringify(quiz, null, 1));
                }
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'next':
            if (whitelisted(channel, user)) {
                if (quiz.running) {
                    clearInterval(interval);

                    quiz_run();
                    interval = setInterval(quiz_run, quiz.timeout);
                } else {
                    quiz_run();
                }
            } else {
                client.say(channel, `@${user.username} this command is only for whitelisted users`);
            }
            break;

        case 'when':
            if (quiz.running) {
                client.say(channel, `@${user.username} next question will arrive in ${quiz.time_remaining} seconds`);
            } else {
                client.say(channel, `@${user.username} quiz is not running currently`);
            }
            break;
    }
}

function answer_cleaner(msg) { //removing all trash from quiz_answer
    let articles = ['the', 'The', 'a', 'A', 'an', 'An', 'to'];
    let tags = ['</i>', '<i>', '</I>', '"', '(', ')', "'"];

    for (let i = 0; i < articles.length; i++) {
        if (msg.split(' ')[0] == articles[i]) {
            msg = msg.replace(articles[i], '').slice(1);
        }
    }

    for (let i = 0; i < tags.length; i++) {
        for (let j = 0; j < 20; j++) { //dont blame me, .replaceAll() only avalible in node v15+, which is not lts
            msg = msg.replace(tags[i], ''); // and i cant install it in my termux
        }
    }

    return msg;
}

module.exports.run = run;