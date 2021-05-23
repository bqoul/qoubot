const twitch = require('../twitch');
const points = require('./points');

let slots = ['Jebaited', 'TriHard', 'PogChamp', 'BibleThump', 'WutFace'];

const reward = (channel, user, amount, slot) => {
    switch(slots[slot]) {
        case 'Jebaited':
            return `${user.username} won his ${amount} points back`;

        case 'TriHard':
            points.give(channel, (amount * 10) - amount, user.username);
            return `${user.username} won ${(amount * 10)} points`;

        case 'PogChamp':
            points.give(channel, (amount * 5) - amount, user.username);
            return `${user.username} won ${(amount * 5)} points`;

        case 'BibleThump':
            points.give(channel, -amount * 2, user.username);
            return `${user.username} lost ${amount * 2} points`;

        case 'WutFace':
            let rnd = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            return reward(channel, user, amount, rnd);
    }
}

const gamble = (channel, user, message) => {
    let user_points = points.get(channel, user.username);
    let amount;

    if (message.split(' ')[1] === 'all') {
        amount = user_points;
    } else if (Number.isNaN(parseInt(message.split(' ')[1]))){
        twitch.bot.say(channel, `@${user.username} how do you think im supposed to roll this "${message.slice(8)}" points?!`);
        return;
    } else {
        amount = parseInt(message.split(' ')[1]);
    }

    if (user_points < 100) {
        twitch.bot.say(channel, `@${user.username} you need at least 100 points to gamble, you have ${user_points}`);
    } else if (amount < 0) {
        twitch.bot.say(channel, `@${user.username} how do you think im supposed to roll this "${message.slice(8)}" points?!`);
    } else if ((user_points - amount) < 0) {
        twitch.bot.say(channel, `@${user.username} you dont have enough points`);
    } else {
        let slot_1 = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
        let slot_2 = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
        let slot_3 = Math.floor(Math.random() * (4 - 0 + 1)) + 0;

        if (slot_1 == slot_2 && slot_2 == slot_3 && slot_3 == slot_1) {
            let reward_message = reward(channel, user, amount, slot_1);
            twitch.bot.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ] ${reward_message}`);
        } else if (slot_1 != slot_2 && slot_2 != slot_3 && slot_3 != slot_1){
            twitch.bot.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} lost ${amount} points`);
            points.give(channel, -amount, user.username);
        } else {
            twitch.bot.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won his ${amount} back`);
        }
    }

}

module.exports = gamble;