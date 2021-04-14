const client = require('../client');
const fetch = require('node-fetch');
const fs = require('fs');

const weather = async (channel, user, message) => {
    let key = JSON.parse(fs.readFileSync('keys.json'));
    let city = message.slice(9);

    let link = `http://api.weatherapi.com/v1/current.json?key=${key.weather}&q=${city}`;
    let responce = await fetch(link);
    let forecast = await responce.json();

    if (forecast.location === undefined) {
        client.say(channel, `@${usr.username} cant find this city`);
    } else {
        let city = forecast.location.name;
        let country = forecast.location.country;
        let weather = forecast.current.condition.text;
        let temp_c = forecast.current.temp_c;
        let temp_f = forecast.current.temp_f;
        client.say(channel, `@${user.username} weather in ${city} (${country}): ${weather} | temperature ${temp_c}°C (${temp_f}°F)`)
    }
}

module.exports = weather;