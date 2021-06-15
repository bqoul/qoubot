require("dotenv").config();
const express = require("express");
const aliases = require("./aliases");
const Bot = require("./bot");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
	console.log(`listening to port ${PORT}...`);
	aliases.data.connect();
	/*
		getting list of connected channels from database
		to connect the bot to this channels when website starts
		(in case if website crashes or something)
	*/
	const connected = require("./aliases/data/connected");
	const channel_list = await connected.find();

	let bot = {};
	for(const {channel} of channel_list) {
		bot[channel] = new Bot(channel);
		bot[channel].connect();
	}
});

app.get("/", (req, res) => {
	res.send("hello world!");
});