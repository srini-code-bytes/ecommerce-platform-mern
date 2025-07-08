const axios = require("axios");

const getGroqReply = async (userMessage) => {
  try {
    console.log("Sending message to Groq:", userMessage);

    console.log("Checking for GROQ_MERN_API_KEY in environment variables...");
    // Check if the Groq API key is present in environment variables

    console.log("**GROQ_MERN_API_KEY**", process.env.GROQ_MERN_API_KEY);

    if (!process.env.GROQ_MERN_API_KEY) {
      throw new Error("GROQ_MERN_API_KEY is missing in environment variables.");
    }
    // Validate userMessage to ensure it's a non-empty string
    if (typeof userMessage !== "string" || userMessage.trim() === "") {
      throw new Error("Invalid user message. It must be a non-empty string.");
    }
    // Call the Groq API to get the AI response

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_MERN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("GroqService Error:", error.response?.data || error);
    throw new Error("Groq API failed");
  }
};

module.exports = { getGroqReply };
