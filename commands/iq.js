module.exports = {
	tags: ["iq"],
	run: async (params) => {
		//random number between 0 and 200
		const iq = ~~(Math.random() * (200 - -1 + 1)) + -1;
		const target = params.message.split(/[ ]+/)[1];
		
		let msg = `${target} has ${iq}iq`;
		if(!target) { //check if user entered "&iq" instead of "&iq someone"
			msg = `${params.user.username}, you have ${iq}iq`;
		}
		params.bot.say(params.channel, msg);
	}
}