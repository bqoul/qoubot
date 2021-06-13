const aliases = require("./");
/*
	gtp(global timeout protection) blocks command handler
	for 1.5 seconds to prevent bot from being timed out gobally
	(twitch only allows to send 20 messages per 30 seconds)
*/
module.exports = async (channel, waiting) => {
    let position = waiting.push(channel) - 1;
    await aliases.sleep(1500);
    waiting.splice(position);
}