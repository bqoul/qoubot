const aliases = require("../aliases");

module.exports = {
	tags: ["spam"],
	roles: ["streamer", "mod", "vip"],
	run: async (param) => {
		param.message = param.message.slice(`${param.message.split(/[ ]+/)[0]} `.length); //removing "&spam " from the message

		for(i = 0; i < 5; i++) {
			param.bot.say(param.channel, param.message);
			aliases.sleep(500);
		}
	}
}