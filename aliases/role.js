module.exports = (user) => {
	if(user.badges?.broadcaster) return "streamer";
	if(user.badges?.moderator)  return "moderator";
	if(user.badges?.vip) return "vip";
}