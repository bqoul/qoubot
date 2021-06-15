require("dotenv").config();
const mongoose = require("mongoose");

module.exports = {
	connect: () => {
		mongoose.connect(`mongodb+srv://bqoul:${process.env.DATABASE_PASSWORD}@data.sqprg.mongodb.net/Data?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true,});
	},
	async get(type, channel) {
		const data = require(`./data/${type}`);
		return data.findOne({channel: channel});
	},
	async set(type, options) {
		const data = require(`./data/${type}`);
		const get = await this.get(type, options.channel);
		//check if document with this data already exists
		if(get) {
			//if so, updating it with new data
			await data.updateOne({
				channel: options.channel,
			}, options);
			return;
		}
		//if not, creating new document
		await new data(options).save();
	}
}