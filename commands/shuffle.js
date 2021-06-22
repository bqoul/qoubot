module.exports = {
	tags: ["shuffle"],
	run: async (params) => {
		params.message = params.message.split(/[ ]+/);
		params.message.shift() //removing "&shuffle " from the message
		//shuffling the message array
		for (let i = params.message.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[params.message[i], params.message[j]] = [params.message[j], params.message[i]];
		}
		params.message = params.message.join(" ");

		params.bot.say(params.channel, params.message);
	}
}