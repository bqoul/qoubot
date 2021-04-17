const client = require('../client');
const points = require('./points');

const gamble = (channel, user, message) => {
    let slots = ['Kreygasm', 'NotLikeThis', 'Jebaited'];
    let user_points = points.get(channel, user.username);
    let amount;

    if (message.split(' ')[1] === 'all') {
        amount = user_points;
    } else if (Number.isNaN(parseInt(message.split(' ')[1]))){
        client.say(channel, `@${user.username} how do you think im suppose to roll this "${message.slice(8)}" points?!`);
        return;
    } else {
        amount = parseInt(message.split(' ')[1]);
    }

    if (user_points < 100) {
        client.say(channel, `@${user.username} you need at least 100 points to gamble, you have ${user_points}`);
    } else if ((user_points - amount) < 0) {
        client.say(channel, `@${user.username} you dont have enough points`);
    } else {
        let slot_1 = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        let slot_2 = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        let slot_3 = Math.floor(Math.random() * (2 - 0 + 1)) + 0;

        if (slot_1 == slot_2 && slot_2 == slot_3 && slot_3 == slot_1) {
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${amount * 10} points`);
            points.give(channel, amount * 10, user.username);
        } else if (slot_1 != slot_2 && slot_2 != slot_3 && slot_3 != slot_1){
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won his ${amount} points back`);
        } else {
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} lost ${amount} points`);
            points.give(channel, -amount, user.username);
        }
    }

}

module.exports = gamble;