module.exports = {
	tags: ["help", "elp"],
	run: async (param) => {
		param.bot.say(param.channel, `${param.user.username}, no elp NOPERS`);
	},
}