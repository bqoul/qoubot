module.exports = {
	tags: ["vanish", "v"],
	run: (params) => {
		params.bot.timeout(params.channel, params.user.username, 1, "vanished");
	}
}