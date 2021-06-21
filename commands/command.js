const aliases = require("../aliases");

module.exports = {
	tags: ["command", "commands", "cmd"],
	roles: ["streamer", "mod"],
	run: async (params) => {
		//expected message => &command add tag1 tag2 tag3 | command text
		const command_text = params.message.slice(`${params.message.split(/[ ]+/)[0]} ${params.message.split(/[ ]+/)[1]} `.length);
		const data = await aliases.data.get("command", params.channel) ?? {channel: params.channel, commands: []};

		switch(params.message.split(/[ ]+/)[1]) {
			case "add":
				const tags = command_text.split(" | ")[0].split(/[ ]+/);
				const text = command_text.split(" | ")[1];

				//check if command with such tag already exists
				for(const command of data.commands) {
					for(const tag of tags) {
						if(command.tags.includes(tag)) {
							params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: command with tag <${tag}> already exists`);
							return;
						}
					}
				}

				//making sure user entered command text
				if(!text || text === "") {
					params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: invalid syntax, expected <&command add tag1 tag2 | commmand text> or <&command remove tag>`);
					return;
				}

				data.commands.push({
					tags: tags,
					text: text,
					calls: 0,
				});
				aliases.data.set("command", data);

				params.bot.say(params.channel, `${params.user.username}, MrDestructoid command was successfully added`);
				break;

			case "remove":
				for(const command of data.commands) {
					if(command.tags.includes(command_text)) {
						data.commands.splice(data.commands.indexOf(command), 1);
						aliases.data.set("command", data);

						params.bot.say(params.channel, `${params.user.username}, MrDestructoid command was successfully removed`);
						return;
					}
				}

				params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: command with tag <${command_text}> does not exists`);
				break;

			default:
				params.bot.say(params.channel, `${params.user.username}, MrDestructoid ERROR: invalid syntax, expected <&command add tag1 tag2 | commmand text> or <&command remove tag>`);
				return;
		}

	}
}