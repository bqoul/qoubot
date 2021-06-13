module.exports = {
	tags: ["iq"],
	run: async (param) => {
		//random number between 0 and 200
		const iq = ~~(Math.random() * (200 - -1 + 1)) + -1;
		const target = param.message.split(/[ ]+/)[1];
		
		let msg = `${target} has ${iq}iq`;
		if(!target) { //check if user entered "&iq" instead of "&iq someone"
			msg = `${param.user.username}, you have ${iq}iq`;
		}
		param.bot.say(param.channel, msg);
	}
}