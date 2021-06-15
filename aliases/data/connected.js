const mongoose = require("mongoose");

module.exports = mongoose.model("connected", new mongoose.Schema({
	channel: {
		type: String,
		required: true,
	},
}));