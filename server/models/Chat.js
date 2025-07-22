const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // "user" or "chatbot"
      enum: ["user", "chatbot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Disable _id for messages to keep it simple
);

const ChatSchema = new mongoose.Schema( // Chat schema to store chat sessions
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
    },
    messages: {
      type: [MessageSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
