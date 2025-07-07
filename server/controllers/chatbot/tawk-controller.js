const { getGroqReply } = require("../../services/chatbot/groq-service");

const handleTawkWebhook = async (req, res) => {
  const { message, visitor } = req.body;

  if (!message) return res.sendStatus(200);

  try {
    console.log("Received message:", message);
    const aiReply = await getGroqReply(message);
    console.log("Groq Reply:", aiReply);
    console.log("Visitor ID:", visitor?.id || "unknown");

    res.sendStatus(200);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleTawkWebhook };
