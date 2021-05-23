require('dotenv').config();

const twitch = require('../twitch');
const fetch = require('node-fetch');

const weather = async (channel, user, message) => {
    let city = message.slice(9);

    let link = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER}&q=${city}`;
    let responce = await fetch(link);
    let forecast = await responce.json();

    if (forecast.location === undefined) {
        twitch.bot.say(channel, `@${user.username} ${forecast.error.message.toLowerCase()}`);
    } else {
        let city = forecast.location.name;
        let country = forecast.location.country;
        let weather = forecast.current.condition.text;
        let temp_c = forecast.current.temp_c;
        let temp_f = forecast.current.temp_f;
        twitch.bot.say(channel, `@${user.username} weather in ${city} (${country}): ${weather} | temperature ${temp_c}°C (${temp_f}°F).`)
    }
}

module.exports = weather;