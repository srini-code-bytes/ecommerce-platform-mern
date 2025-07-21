const Chat = require("../../models/Chat");

const saveChatToDB = async({ userId, messages }) => {
    if(!userId || !messages || !Array.isArray(messages)) {
        throw new Error("Invalid chat data");
    }

    let chat = await Chat.find({ userId });

    if(!chat || chat.length === 0) {
        chat = new Chat({
            id: `chat-${Date.now()}`, // Unique ID for the chat
            userId,
            messages: []
        });
    }

    chat.messages.push(...messages);
    chat.updatedAt = new Date();
    await chat.save();
    return chat;
}

module.exports = {
    saveChatToDB
}