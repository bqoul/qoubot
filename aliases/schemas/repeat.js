const mongoose = require("mongoose")

module.exports = mongoose.model("repeat", new mongoose.Schema({
	channel: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		required: true,
	},
	shuffle: {
		type: Boolean,
		required:	false,
	},
}));