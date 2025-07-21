const Chat = require("../../models/Chat");
const { getGroqReply } = require("../../services/chatbot/groq-service");

const handleMessage = async (req, res) => {
  const { userMessage, sessionId, userId } = req.body;
  console.log(
    "** handleGrokReply - userMessage **",
    userMessage,
    sessionId,
    userId
  );

  // if (
  //   !userMessage ||
  //   typeof userMessage !== "string" ||
  //   userMessage.trim() === ""
  // ) {
  //   return res.status(400).json({
  //     message: "Invalid user message",
  //     success: false,
  //   });
  // }

  try {
    const groqResponse = await getGroqReply(userMessage);

    const newMessages = [
      { sender: "user", text: userMessage, timestamp: new Date() },
      { sender: "chatbot", text: groqResponse, timestamp: new Date() },
    ];

    // Here you would typically save the chat to the database
    let chat = await Chat.findOne({ sessionId });
    if (chat) {
      chat.messages.push(...newMessages);
    } else {
      chat = new Chat({
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
  const { sessionId } = req.params;
  console.log("** getChatSession - sessionId **", sessionId);

  try {
    const chat = await Chat.findOne({ sessionId });
  if (!chat) {
    return res.status(404).json({
      message: "Chat session not found",
      success: false,
    });
  }

  res.status(200).json(chat);

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
}

