export const getChannelLastMessage = function(user, channel) {

    if (channel.messages.length !== 0) {
        let lastMessage = channel.messages.slice(-1)[0];

        if (lastMessage.from === user._id) {
            return {
                from: "You",
                text: lastMessage.text,
                createdAt: lastMessage.createdAt
            }
        }
        
        return {
            from: channel.participants[lastMessage.from].name || channel.participants[lastMessage.from].phoneNo,
            text: lastMessage.text,
            createdAt: lastMessage.createdAt
        }

    }

    return null;
}