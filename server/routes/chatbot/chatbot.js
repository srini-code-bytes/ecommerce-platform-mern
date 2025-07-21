const express = require("express");
const { getGroqReply } = require("../../services/chatbot/groq-service");
const { handleMessage, getChatSession } = require("../../controllers/chatbot/chatbot-controller");
const router = express.Router();

// Route to handle frontend Groq requests
router.post("/groq", async (req, res) => {
  try {
    const { message } = req.body;

    const { reply, tokens } = await getGroqReply(message);

    console.log("Groq tokens used:", tokens);

    res.json({ reply, tokens });
  } catch (error) {
    console.error("Groq Chatbot Route Error:", error.message);
    res.status(500).json({ error: "Failed to get Groq response" });
  }
});

router.post("/chat/handleGroqReply", handleMessage);
router.get("/chat/:sessionId", getChatSession);



module.exports = router;
