const aliases = require("../aliases");

module.exports = {
	tags: ["nuke", "nukes"],
	roles: ["streamer", "mod", "vip"],
	run: async (params) => {
		//expected message => &nuke add some phrase | timeout duration in seconds
		const message = params.message.slice(`${params.message.split(/[ ]+/)[0]} ${params.message.split(/[ ]+/)[1]} `.length);
		const {nukes} = await aliases.data.get("nuke", params.channel) ?? {nukes: {}};

		const phrase = message.split("|")[0];
		const duration = message.split("|")[1] ?? 1;

		if(isNaN(parseInt(duration))) {
			params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: invalid syntax, expected: <&nuke add PHRASE | DURATION IN SECONDS> or <&nuke remove PHRASE>`);
			return;
		}

		switch(params.message.split(/[ ]+/)[1]) {
			case "add":
				if(phrase in nukes) {
					params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: phrase already in the nuke list.`);
					return;
				} 

				nukes[phrase] = parseInt(duration);
				params.bot.say(params.channel, `${params.user.username}, MrDestructoid phrase < ${phrase} > was added to the nuke list.`);
				break;

			case "remove":
				if(!(phrase in nukes)) {
					params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: theres no such phrase in the nuke list.`);
					return;
				}

				delete nukes[phrase];
				params.bot.say(params.channel, `${params.user.username}, MrDestructoid phrase < ${phrase} > was removed from the nuke list.`);
				break;

			default: 
				params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: invalid syntax, expected: <&nuke add PHRASE | DURATION IN SECONDS> or <&nuke remove PHRASE>`);
				return;
		}

		aliases.data.set("nuke", {
			channel: params.channel,
			nukes: nukes,
		});
	}
}