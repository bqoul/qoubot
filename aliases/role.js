module.exports = (user) => {
	if(user.badges?.broadcaster) return "streamer";
	if(user.badges?.moderator)  return "mod";
	if(user.badges?.vip) return "vip";
}