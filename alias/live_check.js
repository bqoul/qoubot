const twitch = require('../twitch');

module.exports = async (channel) => {
    const stream = await twitch.api.getStreams({channel: channel.slice(1)});
    return stream.data[0]?.type === 'live' ? true : false;
}