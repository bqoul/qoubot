const mongoose = require("mongoose");

module.exports = mongoose.model("nuke", new mongoose.Schema({
	channel: {
		type: String,
		required: true,
	},
	nukes: {
		type: Object,
	},
}));