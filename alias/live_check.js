const twitch = require('../twitch');

module.exports = async (channel) => {
    const stream = await twitch.api.getStreams({channel: channel.replace('#', '')});

    if(stream.data[0]?.type === 'live') {
        return true;
    } else {
        return false;
    }
}