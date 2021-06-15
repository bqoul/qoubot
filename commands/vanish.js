module.exports = {
	tags: ["vanish", "v"],
	run: (param) => {
		param.bot.timeout(param.channel, param.user.username, 60, "vanished");
	}
}