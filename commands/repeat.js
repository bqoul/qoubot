const aliases = require("../aliases")

module.exports = {
	tags: ["repeat"],
	roles: ["streamer", "mod", "vip"],
	run: async (params) => {
		//message expamle => user: &repeat target shuffle
		let shuffle = false;
		if(params.message.split(/[ ]+/)[2] === "shuffle") {
			shuffle = true;
		}

		if(params.message.split(/[ ]+/)[1] === "stop") {
			aliases.data.delete("repeat", params.channel);
		} else {
			aliases.data.set("repeat", {
				channel: params.channel,
				target: params.message.split(/[ ]+/)[1],
				shuffle: shuffle,
			})
		}

		params.bot.say(params.channel, `${params.user.username} MrDestructoid got it, boss`);
	}
}