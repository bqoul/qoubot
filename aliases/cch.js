//custom command handler
module.exports = (params) => {
	//adding one to the amount for calls for the data
	params.command.calls += 1;
	//recursive function to format all the tags
	const format = (text) => {
		let substr = text.substring(text.lastIndexOf("{") + 1, text.lastIndexOf("}"));
		switch(substr.split("&")[0]) {
			case "user":
				return format(text.replace(`{${substr}}`, params.user.username));

			case "calls":
				return format(text.replace(`{${substr}}`, params.command.calls));

			case "rnd":
				const options = substr.split("&")[1];
				switch(options) {
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

	params.bot.say(params.channel, format(params.command.text));
}