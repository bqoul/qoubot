const mongoose = require("mongoose");

module.exports = mongoose.model("command", new mongoose.Schema({
	channel: {
		type: String,
		required: true,
	},
	commands: [{}],
}))