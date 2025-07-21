const axios = require("axios");

const getGroqReply = async (userMessage) => {
  try {
    if (!process.env.GROQ_MERN_API_KEY) {
      throw new Error("GROQ_MERN_API_KEY is missing.");
    }

    if (typeof userMessage !== "string" || userMessage.trim() === "") {
      throw new Error("Invalid user message.");
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_MERN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content || "No reply from Groq API";
    // const usage = response.data.usage; // Usage data for tokens

    // return {
    //   reply,
    //   // tokens: {
    //   //   prompt: usage?.prompt_tokens || 0,
    //   //   completion: usage?.completion_tokens || 0,
    //   //   total: usage?.total_tokens || 0,
    //   // },
    // };
  } catch (error) {
    console.error("GroqService Error:", error.response?.data || error);
    throw new Error("Groq API failed");
  }
};

module.exports = { getGroqReply };
