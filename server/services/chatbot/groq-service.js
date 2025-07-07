const axios = require("axios");

const getGroqReply = async (userMessage) => {
  try {
    console.log("Sending message to Groq:", userMessage);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You are a helpful AI support assistant." },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("GroqService Error:", error.response?.data || error.message);
    throw new Error("Groq API failed");
  }
};

module.exports = { getGroqReply };
