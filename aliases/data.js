require("dotenv").config();
const mongoose = require("mongoose");

module.exports = {
	connect: () => {
		mongoose.connect(`mongodb+srv://bqoul:${process.env.DATABASE_PASSWORD}@data.sqprg.mongodb.net/Data?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true,});
	},
	async get(type, channel) {
		const schema = require(`./schemas/${type}`);
		return schema.findOne({channel: channel});
	},
	async getAll(type) {
		const schema = require(`./schemas/${type}`);
		return schema.find();
	},
	async set(type, options) {
		const schema = require(`./schemas/${type}`);
		const get = await this.get(type, options.channel);
		//check if document with this data already exists
		if(get) {
			//if so, updating it with new data
			await schema.updateOne({
				channel: options.channel,
			}, options);
			return;
		}
		//if not, creating new document
		await new schema(options).save();
	},
	async delete(type, channel) {
		const schema = require(`./schemas/${type}`);
		await schema.deleteOne({channel: channel});
	},
}