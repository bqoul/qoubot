module.exports = {
	tags: ["help", "elp"],
	run: async (params) => {
		params.bot.say(params.channel, `${params.user.username}, no elp NOPERS`);
	},
}