require("dotenv").config();
const express = require("express");
const aliases = require("./aliases");

aliases.data.connect();
const app = express();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
	console.log(`listening to port ${PORT}...`);
});

app.get("/", (req, res) => {
	res.send("hello world!");
});