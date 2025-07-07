// const axios = require("axios");

// // Function to send the message to Hugging Face's Inference API
// const getAIResponse = async (userMessage) => {
//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/gpt2", // Replace with your desired Hugging Face model
//       {
//         inputs: userMessage,
//       },
//       {
//         headers: {
//           Authorization: `Bearer process.env.HUGGINGFACE_API_KEY`, // Replace with your Hugging Face API key
//         },
//       }
//     );

//     return response.data[0]?.generated_text || "Sorry, I couldn't process your request.";
//   } catch (error) {
//     console.error("Error communicating with Hugging Face API:", error);
//     return "Sorry, I couldn't process your request at the moment.";
//   }
// };

// // Function to send the AI response back to Tawk.to
// const sendResponseToTawk = async (visitorId, responseText) => {
//   try {
//     await axios.post(
//       `https://api.tawk.to/v1/chat/${visitorId}/message`, // Replace with the actual Tawk.to API endpoint
//       {
//         text: responseText,
//       },
//       {
//         headers: {
//           Authorization: `Bearer YOUR_TAWK_API_KEY`, // Replace with your Tawk.to API key
//         },
//       }
//     );
//     console.log("Response sent to Tawk.to:", responseText);
//   } catch (error) {
//     console.error("Error sending response to Tawk.to:", error);
//   }
// };

// module.exports = {
//   getAIResponse,
//   sendResponseToTawk,
// };

// services/groqService.js
const axios = require("axios");

const getGroqReply = async (userMessage) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for customer support.",
          },
          {
            role: "user",
            content: userMessage,
          },
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
    console.error("GroqService Error:", error.message);
    throw new Error("Failed to get AI reply from Groq");
  }
};

module.exports = { getGroqReply };
