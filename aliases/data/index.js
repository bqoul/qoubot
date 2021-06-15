const mongoose = require("mongoose");

module.exports = mongoose.model("index", new mongoose.Schema({
	channel: {
		type: String,
		required: true,
	},
	index: {
		type: String,
		required: true,
	},
}));