const client = require('../client');
const points = require('./points');

const gamble = (channel, user, message) => {
    let slots = ['Kreygasm', 'NotLikeThis', 'Jebaited', 'TriHard', 'PogChamp', 'CoolCat', 'BibleThump', 'ResidentSleeper', 'Kappa', 'SeemsGood', 'WutFace'];
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
        let slot_1 = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
        let slot_2 = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
        let slot_3 = Math.floor(Math.random() * (10 - 0 + 1)) + 0;

        if (slot_1 == slot_2 && slot_2 == slot_3 && slot_3 == slot_1) {
            give_reward(slot_1);
        } else if (slot_1 != slot_2 && slot_2 != slot_3 && slot_3 != slot_1){
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} lost ${amount} points`);
            points.give(channel, -amount, user.username);
        } else {
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${amount * 2} points`);
            points.give(channel, amount * 2, user.username);
        }
    }

}

const give_reward = (slot) => {
    switch(slot) {
        case 'Kreygasm':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 5) - amount} points`);
            points.give(channel, (amount * 5) - amount, user.username);
            break;

        case 'NotLikeThis':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} lost ${amount * 2} points`);
            points.give(channel, -(amount * 2), user.username);
            break;

        case 'Jebaited':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won his ${amount} points back`);
            break;

        case 'TriHard':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 10) - amount} points`);
            points.give(channel, (amount * 10) - amount, user.username);
            break;

        case 'PogChamp':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 6) - amount} points`);
            points.give(channel, (amount * 6) - amount, user.username);
            break;

        case 'CoolCat':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won 1337 points`);
            points.give(channel, 1337, user.username);
            break;

        case 'BibleThump':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} lost ${amount} points`);
            points.give(channel, -amount, user.username);
            break;

        case 'ResidentSleeper':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 2) - amount} points`);
            points.give(channel, (amount * 2) - amount, user.username);
            break;

        case 'Kappa':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 3) - amount} points`);
            points.give(channel, (amount * 3) - amount, user.username);
            break;

        case 'SeemsGood':
            client.say(channel, `[ ${slots[slot_1]} | ${slots[slot_2]} | ${slots[slot_3]} ]  ${user.username} won ${(amount * 4) - amount} points`);
            points.give(channel, (amount * 4) - amount, user.username);
            break;

        case 'WutFace':
            let rnd = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            give_reward(slots[rnd]);
            break;
    }
}

module.exports = gamble;