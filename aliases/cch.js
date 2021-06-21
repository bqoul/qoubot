const fetch = require("node-fetch");
//custom command handler
module.exports = async (params) => {
	//adding one to the amount for calls for the data
	params.command.calls += 1;
	//recursive function to format all the tags
	const format = async (text) => {
		let substr = text.substring(text.lastIndexOf("{") + 1, text.lastIndexOf("}"));
		switch(substr.split("&")[0]) {
			case "user":
				return format(text.replace(`{${substr}}`, params.user.username));

			case "calls":
				return format(text.replace(`{${substr}}`, params.command.calls));

			case "rnd":
				const options = substr.split("&")[1];
				switch(options) {
					//expected tag -> {rnd&v}
					case "v":
						//this works little slow but it works!
						const request = await fetch(`https://tmi.twitch.tv/group/user/${params.channel.slice(1)}/chatters`);
						const responce = await request.json();

						const viewer = ~~(Math.random() * ((responce.chatters.viewers.length - 1) - 0 + 1)) + 0;

						return format(text.replace(`{${substr}}`, responce.chatters.viewers[viewer]));

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

	params.bot.say(params.channel, await format(params.command.text));
}