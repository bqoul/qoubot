module.exports = {
	tags: ["pyramid"],
	run: async (params) => {
		//expected message => "&pyramid EMOTE AMOUNT_OF_TIMES"
		const emote = params.message.split(/[ ]+/)[1];
		let times = params.message.split(/[ ]+/)[2] ?? 3;

		if(!emote) {
			params.bot.say(params.channel, `${params.user.username}, MrDestructoid invalid syntax, expected <&pyramid EMOTE> or <&pyramid EMOTE AMOUNT_OF_TIMES>`);
			return;
		}
		//little control to the amount of times
		if(times < 3) {
			times = 3;
		} else if (times > 5) {
			times = 5;
		}

		for(i = 1; i < times; i++) {
			params.bot.say(params.channel, `${emote} `.repeat(i));
		}
		for(times - 1; times > 0; times--) {
			params.bot.say(params.channel, `${emote} `.repeat(times));
		}
	}
}