module.exports = (channel, user) => {
    return channel.slice(1) === user.username || user.mod ? true : false;
}