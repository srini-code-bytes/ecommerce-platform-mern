// // filepath: /Users/ramki/Desktop/My Code/e-commerce/server/routes/chatbot.js
// const express = require("express");
// const router = express.Router();
// const chatbotController = require("../../controllers/chatbot/chatbot-controller");

// // Route to handle Tawk.to webhooks
// router.post("/tawk-webhook", chatbotController.handleChatMessage);

// module.exports = router;

// routes/tawkRoutes.js
const express = require("express");
const { handleTawkWebhook } = require("../../controllers/chatbot/tawk-controller");

const router = express.Router();

router.post("/tawk-webhook", handleTawkWebhook);

module.exports = router;
