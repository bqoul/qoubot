const fs = require("fs");
//iterating througth all the aliases so can add them to module.expots object
for(const file of fs.readdirSync("./aliases")) {
	module.exports[file.split(".")[0]] = require(`./${file}`);
}