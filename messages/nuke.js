const aliases = require("../aliases");

module.exports = {
	run: async (params) => {
		const role = aliases.role(params.user);
		if(role === "streamer" || role === "mod" || role === "vip") return;

		const {nukes} = await aliases.data.get("nuke", params.channel);
		for(const [phrase, duration] of Object.entries(nukes)) {
			//TODO: fix bug with single emote phrases (bot timeouting every second time for some reason)
			if(params.message.toLowerCase().includes(phrase.toLowerCase())) {
				params.bot.timeout(params.channel, params.user.username, duration, "nuked");
				return;
			}
		}
	}
}