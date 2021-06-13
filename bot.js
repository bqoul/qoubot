const fs = require("fs");
const twitch = require("./twitch");
const aliases = require("./aliases");
const {index} = require("./data/index.json");

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

		//message handler
		this[this.channel].on("message", async (channel, user, message, self) => {
			if(self) return;
		});

		/*
			SEPARATED SO GTP WONT BLOCK MESSAGE HANGLER
		*/

		//command handler
		this[this.channel].on("message", async (channel, user, message, self) => {
			if(self || this.waiting.includes(channel)) return;

			//iterating througth all files in the ./commands
			for(const file of fs.readdirSync("./commands")) {
				const cmd = require(`./commands/${file}`);
				for(const alias of cmd.tags) {
					//check if command and roles matched
					if(`${index}${alias}`.toLowerCase() === message.split(" ")[0].toLowerCase() && (!cmd.roles || cmd.roles.includes(aliases.role(user)))) {
						// cmd.run(this[this.channel], channel, user, message);
						cmd.run({
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