// const chatbotService = require("../../services/chatbot/chatbot-service");

const { getGroqReply } = require("../../services/chatbot/groq-service");

// // Controller to handle incoming webhook requests from Tawk.to
// const handleChatMessage = async (req, res) => {
//   try {
//     const { event, message, visitor } = req.body;

//     // Ensure the event is a new message
//     if (event === "message:sent") {
//       console.log("New message received from Tawk.to:", message.text);

//       // Call the chatbot service to get an AI-generated response
//       const aiResponse = await chatbotService.getAIResponse(message.text);

//       // Send the AI response back to Tawk.to
//       await chatbotService.sendResponseToTawk(visitor.id, aiResponse);

//       return res.status(200).json({ success: true, message: "Response sent to Tawk.to" });
//     }

//     res.status(400).json({ success: false, message: "Invalid event type" });
//   } catch (error) {
//     console.error("Error handling chat message:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = {
//   handleChatMessage,
// };

// controllers/tawkController.js


const handleTawkWebhook = async (req, res) => {
  const { message, visitor } = req.body;

  if (!message) return res.sendStatus(200);

  try {
    const aiReply = await getGroqReply(message);
    console.log("🤖 Groq Reply:", aiReply);
    console.log("👤 Visitor ID:", visitor?.id || "unknown");

    // Optional: log to DB, send email, or inject to frontend

    res.sendStatus(200);
  } catch (error) {
    console.error("TawkController Error:", error.message);
    res.sendStatus(500);
  }
};

module.exports = { handleTawkWebhook };
