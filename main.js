const aliases = require("./aliases");
const Bot = require("./bot");

aliases.data.connect();

let bot = {};

bot["5gxd"] = new Bot("5gxd");
bot["qoubot"] = new Bot("qoubot");

bot["qoubot"].connect();
bot["5gxd"].connect();