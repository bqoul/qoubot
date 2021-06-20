const fetch = require("node-fetch");

module.exports = {
	tags: ["weather", "forecast"],
	run: async (params) => {
		let city = params.message.slice(`${params.message.split(" ")[0]} `.length); //removing "&weather " from the city name

		const link = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER}&q=${city}`;
		const responce = await fetch(link);
		const forecast = await responce.json();

		//if bot couldnt find the location
		if (!forecast.location) {
			params.bot.say(params.channel, `@${params.user.username} MrDestructoid ${forecast.error.message.toLowerCase()}`);
			return;
		}

		city = forecast.location.name;
		const country = forecast.location.country;
		const weather = forecast.current.condition.text;
		const temp_c = forecast.current.temp_c;
		const temp_f = forecast.current.temp_f;
		params.bot.say(params.channel, `@${params.user.username} weather in ${city} (${country}): ${weather} | temperature ${temp_c}°C (${temp_f}°F).`)
	}
}