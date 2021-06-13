module.exports = {
	tags: ["info", "help"],
	run: (params) => {
		params.bot.say(params.channel, `${params.user.username}, information about the bot and all source code here => github.com/bqoul/qoubot`);
	}
}