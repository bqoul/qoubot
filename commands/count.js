const math = require("mathjs");

module.exports = {
	tags: ["count", "calculate"],
	run: async (params) => {
		try {
			const equasion = params.message.slice(`${params.message.split(" ")[0]} `.length);
			const result = math.evaluate(equasion);
			params.bot.say(params.channel, `${params.user.username}, MrDestructoid ${equasion} = ${result}`);
		} catch {
			params.bot.say(params.channel, `${params.user.username}, MrDestructoid unnable to calculate.`);
		}
	},
}