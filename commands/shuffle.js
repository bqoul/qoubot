module.exports = {
	tags: ["shuffle"],
	run: async (param) => {
		param.message = param.message.split(/[ ]+/);
		param.message.shift() //removing "&shuffle " from the message
		for (let i = param.message.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[param.message[i], param.message[j]] = [param.message[j], param.message[i]];
		}
		param.message = param.message.join(" ");

		param.bot.say(param.channel, param.message);
	}
}