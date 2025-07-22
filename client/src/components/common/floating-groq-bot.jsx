import { getGrokReply } from "@/store/chatbot-slice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FloatingGroqBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null); // Reference to scroll to the bottom of the chat
  const dispatch = useDispatch();
  const sessionId = "12345"; // Would be fetched from local storage later
  const { user } = useSelector((state) => state.auth);
  console.log("User data: ", user)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom when messages change
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return; // To avoid sending empty messages

    const userMessage = {
      // Create user message object
      sender: "user",
      text: chatInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat
    setChatInput("");
    setLoading(true);

    // // Adds a fake typing message from the chatbot
    // setMessages((prev) => [
    //   ...prev,
    //   { sender: "chatbot", text: "Groq is typing...", typing: true },
    // ]);

    try {
      const payload = {
        // Prepare payload for Groq API
        sessionId: sessionId,
        userId: user?.id || "Guest",
        userMessage: chatInput.trim(),
      };

      const response = await dispatch(getGrokReply(payload)).unwrap();

      console.log(" Response from Groq:", response);

      // Removes the fake message once API response is received
      // setMessages((prev) => prev.filter((msg) => !msg.typing));

      // const chatbotMessage = {
      //   sender: "chatbot",
      //   text: response.payload.reply || "No reply from Groq API",
      //   tokens: response.payload.usage?.total || 0, // Assuming usage is part of the response
      //   timestamp: response.payload.timestamp
      // };

      // setMessages((prevMessages) => [...prevMessages, chatbotMessage]); // Add chatbot reply to chat
      setMessages(response.messages);
      // console.log("Tokens used:", response.payload.usage?.total || 0);
    } catch (e) {
      console.error("Error chatting with Groq:", e);

      setMessages((prev) => prev.filter((msg)=> !msg.typing));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "chatbot",
          text: "Sorry, I couldn't process your message at the moment.",
        },
      ]);
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom after sending a message
    }
  };

  return (
    <>
      {/* Toggle button */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-red-800 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors z-[1000]"
      >
        💬
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-16 right-4 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-[1000]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg relative">
            <h3 className="text-lg font-semibold text-gray-800">
              Groq Assistant
            </h3>
            <button
              onClick={() => {
                console.log("Close button clicked:");
                setOpen(false);
              }}
              className="absolute top-2 right-2 text-black px-2 py-1 rounded z-[1000]"
            >
              X
            </button>
          </div>

          {/* Chat messages area */}
          <div className="p-4 h-64 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-blue-800 self-end"
                    : "bg-gray-100 text-gray-800 self-start"
                }`}
              > 
              {msg.sender === "chatbot" && (
                <div className="text-xl text-gray-500 mb-1">
                  🤖
                </div>
              )}
              {msg.sender === "user" && (
                <div className="text-xl text-blue-500 mb-1">
                  👤 
                </div>
              )}
                {msg.text}
                {msg.tokens && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tokens: {msg.tokens}
                  </div>
                )}
              </div>
            ))}
            {/* Scroll to bottom */}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2 flex gap-2 border-t">
            <input
              type="text"
              className="flex-1 border rounded p-1 text-sm"
              placeholder="Ask something..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingGroqBot;
