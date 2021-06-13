const math = require("mathjs");

module.exports = {
	tags: ["count", "calculate"],
	run: async (param) => {
		try {
			const equasion = param.message.slice(`${param.message.split(/[ ]+/)[0]} `.length);
			const result = math.evaluate(equasion);
			param.bot.say(param.channel, `${param.user.username}, MrDestructoid ${equasion} = ${result}`);
		} catch {
			param.bot.say(param.channel, `${param.user.username}, MrDestructoid unnable to calculate.`);
		}
	},
}