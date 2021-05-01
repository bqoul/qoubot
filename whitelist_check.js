const whitelisted = (channel, user) => {
    if (channel.slice(1) === user.username || user.mod) {
        return true;
    } else {
        return false;
    }
}

module.exports = whitelisted;