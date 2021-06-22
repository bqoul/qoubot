const fetch = require("node-fetch");
const aliases = require("../aliases");
//custom command handler
module.exports = async (params) => {
	//adding one to the amount for calls for the data
	params.command.calls += 1;
	//recursive function to format all the tags
	const format = async (text) => {
		const substr = text.substring(text.lastIndexOf("{") + 1, text.lastIndexOf("}"));
		switch(substr.split("&")[0]) {
			case "user":
				return format(text.replace(`{${substr}}`, params.user.username));

			case "calls":
				return format(text.replace(`{${substr}}`, params.command.calls));

			case "rnd":
				const options = substr.split("&")[1];
				const user = await aliases.twitch.api.getUsers(params.channel.slice(1));

				switch(options) {
					//expected tag -> {rnd&f}, returns random follower
					case "f":
						const followers = await aliases.twitch.api.getFollows({first: 100, to_id: user.data[0].id});
						const follower = ~~(Math.random() * ((followers.data.length - 1) - 0 + 1)) + 0;

						return format(text.replace(`{${substr}}`, followers.data[follower].from_name));

					//expected tag -> {rnd&v}, returns random viewer
					case "v":
						return format(text.replace(`{${substr}}`, await get_viewer("viewers")));
					
					//expected tag -> {rnd&vip}, returns random vip
					case "vip":
						return format(text.replace(`{${substr}}`, await get_viewer("vips")));

					//expected tag -> {rnd&mod}, returns random mod
					case "mod":
						return format(text.replace(`{${substr}}`, await get_viewer("moderators")));

					//expected tag -> {rnd&min-max}
					default: 
						const min = parseInt(options.split("-")[0]);
						const max = parseInt(options.split("-")[1]);
						const num = ~~(Math.random() * (max - min + 1)) + min;

						return format(text.replace(`{${substr}}`, num));
				}

			default:
				return text;
		}
	}

	//some of the data are unavailable in twitch.api, so i have to use this EXTREMELY SLOW solution
	const get_viewer = async (user_type) => {
		//this works very slow :(
		const request = await fetch(`https://tmi.twitch.tv/group/user/${params.channel.slice(1)}/chatters`);
		const responce = await request.json();
		const user = ~~(Math.random() * ((responce.chatters[user_type].length - 1) - 0 + 1)) + 0;
		return responce.chatters[user_type][user];
	}

	params.bot.say(params.channel, await format(params.command.text));
}