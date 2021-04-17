const client = require('../client');
const fs = require('fs');

const get = (channel, username) => {
    let all_points = JSON.parse(fs.readFileSync('data/points.json'));

    //creating new object for channel if such does not exist
    if (!(channel in all_points)) {
        Object.defineProperty(all_points, channel, {
            value: {

            },
            writable: true,
            configurable: true,
            enumerable: true,
        })
    }

    //creating user key if such does not exist
    if (!(username in all_points[channel])) {
        Object.defineProperty(all_points[channel], username, {
            value: 0,
            writable: true,
            configurable: true,
            enumerable: true,
        }) 
    }

    fs.writeFileSync('data/points.json', JSON.stringify(all_points, null, 1));

    return all_points[channel][username];
}

const give = (channel, amount, target) => {
    let all_points = JSON.parse(fs.readFileSync('data/points.json'));
    let current_points = get(channel, target);

    all_points[channel][target] = current_points + parseInt(amount);

    fs.writeFileSync('data/points.json', JSON.stringify(all_points, null, 1));
}

const command = (channel, user, message) => {
    let points;
    
    switch(message.split(' ')[1]) {
        case undefined:
            points = get(channel, user.username);
            client.say(channel, `@${user.username} you have ${points} points`);
            break;

        case 'give':
            let user_points = get(channel, user.username);
            let amount = parseInt(message.split(' ')[3]);
            if (user_points - amount >= 0) {
                let all_points = JSON.parse(fs.readFileSync('data/points.json'));
                all_points[channel][user.username] = user_points - amount;
                fs.writeFileSync('data/points.json', JSON.stringify(all_points, null, 1));

                give(channel, amount, message.split(' ')[2]);
                client.say(channel, `@${user.username} transfer was successful, now you have ${all_points[channel][user.username]} points`);
            } else {
                client.say(channel, `@${user.username} you have only ${user_points} points`);
            }
            break;

        default:
            points = get(channel, message.split(' ')[1]);
            client.say(channel, `@${user.username} ${message.split(' ')[1]} has ${points} points`);
            break;
    }
}

module.exports.get = get;
module.exports.give = give;
module.exports.command = command;