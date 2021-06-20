require("dotenv").config();
const fetch = require("node-fetch");

module.exports = {
	tags: ["exchange"],
	run: async (params) => {
		let base, target;
		let amount = params.message.split(/[ ]+/)[1];

		if(isNaN(amount)) {	//check if user entered "&exchange SOME to SOME"
			amount = 1;
			base = params.message.split(/[ ]+/)[1];
			target = params.message.split(/[ ]+/)[3];
		} else { //or "&exchange AMOUNT SOME to SOME"
			base = params.message.split(/[ ]+/)[2];
			target = params.message.split(/[ ]+/)[4];
		}
		try {
			const request = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE}/pair/${base}/${target}/${amount}`);
			const responce = await request.json();

			params.bot.say(params.channel, `${params.user.username}, 📈 ${amount} ${base} is ${responce.conversion_result.toFixed(2)} ${target}`);
		} catch {
			params.bot.say(params.channel, `${params.user.username}, MrDestructoid invalid syntax, expected <&exchange CUR to CUR> or <&exchange AMOUNT CUR to CUR>`);
		}
	},
}