require('dotenv').config();

const twitch = require('../twitch');
const fetch = require('node-fetch');

const get = async (base, target, amount) => {
    let request = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE}/pair/${base}/${target}/${amount}`);
    return await request.json();
}

module.exports = async (channel, username, message) => {
    let base, target, data;
    let amount = message.split(' ')[1];

    if (isNaN(amount)) {
        base = message.split(' ')[1];
        target = message.split(' ')[3];
        amount = 1;
        data = await get(base, target, amount);
    } else {
        base = message.split(' ')[2];
        target = message.split(' ')[4];
        data = await get(base, target, amount);
    }

    twitch.bot.say(channel, `@${username} ${amount} ${base} is ${data.conversion_result.toFixed(2)} ${target}`);
}