require("dotenv").config();
const express = require("express");
const aliases = require("./aliases");
const Bot = require("./bot");

const app = express();
const PORT = process.env.PORT ?? 3000;
let bot = {};

app.listen(PORT, async () => {
	console.log(`listening to port ${PORT}...`);
	await aliases.data.connect();
	/*
		getting list of connected channels from database
		to reconnect all bots to the channels when website starts up
		(in case if website crashes or something)
	*/
	const connected = await aliases.data.getAll("connected");
	for(const {channel} of connected) {
		bot[channel] = new Bot(channel);
		bot[channel].connect();
	}
});

app.get("/", (req, res) => {
	res.send(`hello, ${req.socket.remoteAddress}!`);
});