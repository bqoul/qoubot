const fs = require("fs");
const twitch = require("./twitch");
const aliases = require("./aliases");

module.exports = class Bot {
	constructor(channel) {
		//creating new bot in an object for every chat to connect / disconnect qoubot from the channel on call
		this[channel] = twitch.bot(channel);
		//and saving the channel name for simpler access to the bot
		this.channel = channel;
	}
	//empty array for channels, to avoid global timeout
	waiting = [];
	connect() {
		this[this.channel].connect();
		this[this.channel].on("message", async (channel, user, message, self) => {
			if(self || this.waiting.includes(channel)) return;

			//looking for custom index in database, if theres no custom index - setting it to default value
			const {index} = await aliases.data.get("index", channel) ?? {index: "&"};
			//iterating througth all files in the ./commands
			for(const file of fs.readdirSync("./commands")) {
				const command = require(`./commands/${file}`);
				for(const tag of command.tags) {
					//check if tag and roles matched
					if(`${index}${tag}`.toLowerCase() == message.split(" ")[0].toLowerCase() && (!command.roles || command.roles.includes(aliases.role(user)))) {
						// tag.run(this[this.channel], channel, user, message);
						command.run({
							bot: this[this.channel],
							channel: channel,
							user: user,
							message: message,
						});
						//adding channel to the waiting list to avoid global timeout
						aliases.gtp(channel, this.waiting);
						return;
					}
				}
			}
		});
	}
	disconnect() {
		this[this.channel].disconnect();
	}
}