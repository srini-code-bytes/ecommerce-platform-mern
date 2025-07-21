import { getGrokReply } from "@/store/chatbot-slice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FloatingGroqBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();
  const sessionId = "12345";
  const { user } = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendMessage(); // Needs to be implemented
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // messages is your message list

  const sendMessage = async () => {
    if (!chatInput.trim()) return; // To avoid sending empty messages

    const userMessage = {
      sender: "user",
      text: chatInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat
    setChatInput("");
    setLoading(true);

    try {
      const payload = {
        sessionId : sessionId,
        userId: user?.id || "Guest",
        userMessage : chatInput.trim()
      }
      const response = dispatch(
        getGrokReply(payload) // Assuming getGrokReply is an async thunk action
      );

      console.log(" Response from Groq:", response);

      const chatbotMessage = {
        sender: "chatbot",
        text: response.payload.reply || "No reply from Groq API",
        tokens: response.payload.usage?.total || 0, // Assuming usage is part of the response
      };

      setMessages((prevMessages) => [...prevMessages, chatbotMessage]); // Add chatbot reply to chat
      console.log("Chatbot reply:", response.payload.reply);
      console.log("Tokens used:", response.payload.usage?.total || 0);
    } catch (e) {
      console.error("Error chatting with Groq:", e);
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
