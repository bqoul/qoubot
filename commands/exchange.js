require("dotenv").config();
const fetch = require("node-fetch");

module.exports = {
	tags: ["exchange"],
	run: async (param) => {
		let base, target;
		let amount = param.message.split(/[ ]+/)[1];

		if(isNaN(amount)) {	//check if user entered "&exchange SOME to SOME"
			amount = 1;
			base = param.message.split(/[ ]+/)[1];
			target = param.message.split(/[ ]+/)[3];
		} else { //or "&exchange AMOUNT SOME to SOME"
			base = param.message.split(/[ ]+/)[2];
			target = param.message.split(/[ ]+/)[4];
		}
		try {
			const request = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE}/pair/${base}/${target}/${amount}`);
			const responce = await request.json();

			param.bot.say(param.channel, `${param.user.username}, 📈 ${amount} ${base} is ${responce.conversion_result.toFixed(2)} ${target}`);
		} catch {
			param.bot.say(param.channel, `${param.user.username}, MrDestructoid invalid syntax, expected <&exchange CUR to CUR> or <&exchange AMOUNT CUR to CUR>`);
		}
	},
}