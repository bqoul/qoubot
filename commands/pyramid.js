module.exports = {
	tags: ["pyramid"],
	run: async (param) => {
		//expected message => "&pyramid EMOTE AMOUNT_OF_TIMES"
		const emote = param.message.split(/[ ]+/)[1];
		let times = param.message.split(/[ ]+/)[2] ?? 3;

		if(!emote) {
			param.bot.say(param.channel, `${param.user.username}, MrDestructoid invalid syntax, expected <&pyramid EMOTE> or <&pyramid EMOTE AMOUNT_OF_TIMES>`);
			return;
		}
		//little control to the amount of times
		if(times < 3) {
			times = 3;
		} else if (times > 5) {
			times = 5;
		}

		for(i = 1; i < times; i++) {
			param.bot.say(param.channel, `${emote} `.repeat(i));
		}
		for(times - 1; times > 0; times--) {
			param.bot.say(param.channel, `${emote} `.repeat(times));
		}
	}
}