const fetch = require("node-fetch");
const aliases = require("../aliases");
//custom command handler
module.exports = async (params) => {
	//adding one to the amount for calls for the data
	params.command.calls += 1;
	//recursive function to format all the tags
	const format = async (text) => {
		const tag = text.substring(text.lastIndexOf("{") + 1, text.lastIndexOf("}"));
		switch(tag.split("&")[0]) {
			case "user":
				return format(text.replace(`{${tag}}`, params.user.username));

			case "calls":
				return format(text.replace(`{${tag}}`, params.command.calls));

			case "rnd":
				const options = tag.split("&")[1];

				switch(options) {
					//expected tag -> {rnd&f}, returns random follower
					case "f":
						const user = await aliases.twitch.api.getUsers(params.channel.slice(1));
						const followers = await aliases.twitch.api.getFollows({first: 100, to_id: user.data[0].id});
						const follower = ~~(Math.random() * ((followers.data.length - 1) - 0 + 1)) + 0;

						return format(text.replace(`{${tag}}`, followers.data[follower].from_name));

					//expected tag -> {rnd&v}, returns random viewer
					case "v":
						const viewer = ~~(Math.random() * ((params.chatters.viewers.length - 1) - 0 + 1)) + 0;
						return format(text.replace(`{${tag}}`, params.chatters.viewers[viewer]));
					
					//expected tag -> {rnd&vip}, returns random vip
					case "vip":
						const vip = ~~(Math.random() * ((params.chatters.vips.length - 1) - 0 + 1)) + 0;
						return format(text.replace(`{${tag}}`, params.chatters.vips[vip]));

					//expected tag -> {rnd&mod}, returns random mod
					case "mod":
						const mod = ~~(Math.random() * ((params.chatters.moderators.length - 1) - 0 + 1)) + 0;
						return format(text.replace(`{${tag}}`, params.chatters.moderators[mod]));

					//expected tag -> {rnd&min-max}
					default: 
						const min = parseInt(options.split("-")[0]);
						const max = parseInt(options.split("-")[1]);
						const num = ~~(Math.random() * (max - min + 1)) + min;

						return format(text.replace(`{${tag}}`, num));
				}

			default:
				return text;
		}
	}

	params.bot.say(params.channel, await format(params.command.text));
}