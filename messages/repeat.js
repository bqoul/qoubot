const aliases = require("../aliases");

module.exports = {
	run: async (params) => {
		const repeat = await aliases.data.get("repeat", params.channel) ?? {
			//setting default value to a dummy object to prevent runtime errors
			target: "",
			shuffle: false,
		}

		if(params.user.username === repeat.target) {
			if(repeat.shuffle) {
				params.message = params.message.split(/[ ]+/);
				for (let i = params.message.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[params.message[i], params.message[j]] = [params.message[j], params.message[i]];
				}
				params.message = params.message.join(" ");
			}

			params.bot.say(params.channel, params.message);
		}
	}
}