const Chat = require("../../models/Chat");
const { getGroqReply } = require("../../services/chatbot/groq-service");

const handleMessage = async (req, res) => {
  const { userMessage, sessionId, userId } = req.body; // Extract userMessage, sessionId, and userId from the request body
  console.log(
    "** handleGrokReply - userMessage **",
    userMessage,
    sessionId,
    userId
  );

  try {
    const groqResponse = await getGroqReply(userMessage);

    const newMessages = [
      { sender: "user", text: userMessage, timestamp: new Date() },
      { sender: "chatbot", text: groqResponse.reply, tokens: groqResponse.tokens, timestamp: new Date() },
    ]; // Save the chat session with the new messages

    let chat = await Chat.findOne({ sessionId }); // Find existing chat session by sessionId
    if (chat) {
      chat.messages.push(...newMessages); // Append new messages to existing chat
    } else {
      chat = new Chat({
        // Create a new chat session if it doesn't exist
        sessionId,
        userId,
        messages: newMessages,
      });
    }

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error(" Error in handleGrokReply:", error);
    return res.status(500).json({
      message: "Groq Internal server error",
      success: false,
    });
  }
};

const getChatSession = async (req, res) => {
  const { sessionId } = req.params; // Extract sessionId from the request parameters
  console.log("** getChatSession - sessionId **", sessionId);

  try {
    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return res.status(404).json({
        message: "Chat session not found",
        success: false,
      });
    }

    res.status(200).json(chat); // Return the chat session details
  } catch (error) {
    console.error("Error in getChatSession:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  handleMessage,
  getChatSession,
};
