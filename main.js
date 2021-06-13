const Bot = require("./bot");

let bot = {};

bot["5gxd"] = new Bot("5gxd");
bot["qoubot"] = new Bot("qoubot");

bot["5gxd"].connect();
bot["qoubot"].connect();