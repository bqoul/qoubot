const twitch = require('../twitch');
const fs = require('fs');

module.exports = {
    get(channel, username) {
        let points;

        try {
            points = JSON.parse(fs.readFileSync(`data/points/${channel}.json`));
        } catch {
            fs.mkdirSync('data/points', {recursive: true});
            fs.writeFileSync(`data/points/${channel}.json`, JSON.stringify({}, null, 1));
            points = JSON.parse(fs.readFileSync(`data/points/${channel}.json`));
        } 

        if (!(username in points)) {
            Object.defineProperty(points, username, {
                value: 0,
                writable: true,
                configurable: true,
                enumerable: true,
            }) 
            fs.writeFileSync(`data/points/${channel}.json`, JSON.stringify(points, null, 1));
        }

        return points[username];
    },
    give(channel, amount, target) {
        let points = JSON.parse(fs.readFileSync(`data/points/${channel}.json`));
        let current_points = this.get(channel, target);

        points[target] = current_points + parseInt(amount);

        fs.writeFileSync(`data/points/${channel}.json`, JSON.stringify(points, null, 1));
    },
    command(channel, user, message) {
        let points;
        let amount = parseInt(message.split(' ')[3]);

        switch(message.split(' ')[1]) {
            case 'give':
                let user_points = this.get(channel, user.username);
                if (message.split(' ')[3] === 'all'){
                    points = JSON.parse(fs.readFileSync(`data/points/${channel}.json`));
                    points[user.username] -= user_points;
                    fs.writeFileSync(`data/points/${channel}.json`, JSON.stringify(points, null, 1));

                    this.give(channel, user_points, message.split(' ')[2]);
                    twitch.bot.say(channel, `@${user.username} transfer was successful, now you have ${points[user.username]} points`);
                } else if (user_points - amount >= 0) {
                    let points = JSON.parse(fs.readFileSync(`data/points/${channel}.json`));
                    points[user.username] = user_points - amount;
                    fs.writeFileSync(`data/points/${channel}.json`, JSON.stringify(points, null, 1));

                    this.give(channel, amount, message.split(' ')[2]);
                    twitch.bot.say(channel, `@${user.username} transfer was successful, now you have ${points[user.username]} points`);
                } else {
                    twitch.bot.say(channel, `@${user.username} you have only ${user_points} points`);
                }
                break;

            case undefined:
                points = this.get(channel, user.username);
                twitch.bot.say(channel, `@${user.username} you have ${points} points`);
                break;

            default:
                points = this.get(channel, message.split(' ')[1]);
                twitch.bot.say(channel, `@${user.username} ${message.split(' ')[1]} has ${points} points`);
                break;
        }
    }
}