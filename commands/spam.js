const aliases = require("../aliases");

module.exports = {
	tags: ["spam"],
	roles: ["streamer", "moderator", "vip"],
	run: async (params) => {
		params.message = params.message.slice(`${params.message.split(" ")[0]} `.length); //removing "&spam " from the message

		for(i = 0; i < 5; i++) {
			params.bot.say(params.channel, params.message);
			aliases.sleep(500);
		}
	}
}