const fs = require("fs");
const aliases = require("./aliases");

module.exports = class Bot {
	constructor(channel) {
		//saving the channel name for easier access to the bot
		this.channel = channel;
		//creating new bot in an object for every chat to connect / disconnect qoubot from the channel on call
		this[channel] = aliases.twitch.bot(channel);
		/* 
			setting interval that will refresh chatters data for the channel every 5 minutes,
			so i can make custom command tags like {rnd&v}, {rnd&mod}, {rnd&vip} work faster
		*/
		setInterval(async () => {
			this.viewers_data.seconds_passed += 1;
			if(this.viewers_data.seconds_passed >= 300) {
				const fetch = require("node-fetch");
				const request = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
				const responce = await request.json();

				this.viewers_data.chatters = responce.chatters;
				this.viewers_data.seconds_passed = 0;
			}
		}, 1000);
	}
	//empty array for the global timeout protection
	waiting = [];
	//empty object for the chatters
	viewers_data = {
		seconds_passed: 300,
	};
	connect() {
		this[this.channel].connect();
		this[this.channel].on("message", async (channel, user, message, self) => {
			//making sure bot wont respond to himself
			if(self) return;

			//message handler
			for(const file of fs.readdirSync("./messages")) {
				const message_handler = require(`./messages/${file}`);
				message_handler.run({
					bot: this[this.channel],
					channel: channel,
					user: user,
					message: message,
				});
			}

			//check if channel is waiting, to block command handlers
			if(this.waiting.includes(channel)) return;
			//looking for custom index in database, if theres no custom index - setting it to default value
			const {index} = await aliases.data.get("index", channel) ?? {index: "&"};

			//command handler for the custom commands
			const {commands} = await aliases.data.get("command", channel) ?? {commands: []};
			for(const command of commands) {
				for(const tag of command.tags) {
					if(`${index}${tag}`.toLowerCase() == message.split(" ")[0].toLowerCase()) {
						//passing the data to the custom command handler
						aliases.cch({
							bot: this[this.channel],
							channel: channel,
							user: user,
							message: message,
							command: command,
							chatters: this.viewers_data.chatters,
						})
						//adding channel to the waiting array to avoid global timeout
						aliases.gtp(channel, this.waiting);
						//saving commands witch changed amount of calls to the database
						aliases.data.set("command", {
							channel: channel,
							commands: commands,
						})
						return;
					}
				}
			}

			//command handler for the precoded commands
			for(const file of fs.readdirSync("./commands")) {
				const command_handler = require(`./commands/${file}`);
				for(const tag of command_handler.tags) {
					//check if tag and roles matched
					if(`${index}${tag}`.toLowerCase() == message.split(" ")[0].toLowerCase() && (!command_handler.roles || command_handler.roles.includes(aliases.role(user)))) {
						command_handler.run({
							bot: this[this.channel],
							channel: channel,
							user: user,
							message: message,
						});
						//adding channel to the waiting array to avoid global timeout
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