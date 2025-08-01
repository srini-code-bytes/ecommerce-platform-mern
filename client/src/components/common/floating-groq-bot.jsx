import { getChatSession, getGrokReply } from "@/store/chatbot-slice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const FloatingGroqBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null); // Reference to scroll to the bottom of the chat
  const dispatch = useDispatch();
  const [sessionId, setSesssionId] = useState("");
  const { user } = useSelector((state) => state.auth);
  console.log("User data: ", user);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    sendMessage();
  };

  const formatTime = (isoTime) => {
    return new Date(isoTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to simulate typing effect for chatbot replies at 50 ms
  const typeReply = (fullText, onUpdate, onComplete, speed = 50) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        onUpdate(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval); // Stop the timer once we have revealed the whole response
        if (onComplete) {
          onComplete();
        }
      }
    }, speed); // 20 ms per character
  };

  useEffect(() => {
    const initSession = async () => {
      let existingSessionId = JSON.parse(localStorage.getItem("chatSessionId"));
      console.log("existingSessionId", existingSessionId);

      if (!existingSessionId) {
        existingSessionId = uuidv4();
        localStorage.setItem(
          "chatSessionId",
          JSON.stringify(existingSessionId)
        );
      }

      try {
        if (existingSessionId) {
          const data = await dispatch(
            getChatSession(existingSessionId)
          ).unwrap();
          console.log("Chat data: ", data);
          setMessages(data.messages || []);
        }
      } catch (e) {
        console.error("Error fetching the chat session:", e);
        throw new Error("Failed to fetch chat session");
      }
      setSesssionId(existingSessionId);
    };
    initSession();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom when messages change
  }, [messages, open]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return; // To avoid sending empty messages

    const userMessage = {
      // Create user message object
      sender: "user",
      text: chatInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat

    // Show Grow is typing...
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "chatbot", text: "Groq is typing...", typing: true },
    ]);

    setChatInput("");
    setLoading(true); // Set loading state to true always prior to API call

    try {
      const payload = {
        // Prepare payload for Groq API
        sessionId: sessionId,
        userId: user?.id || "Guest",
        userMessage: chatInput.trim(),
      };

      const response = await dispatch(getGrokReply(payload)).unwrap();

      console.log(" Response from Groq:", response);

      const chatbotReply = response?.messages?.[
        response?.messages?.length - 1
      ] || { text: "Sorry, I couldn't process your message at the moment." };

      if (chatbotReply) {
        let chunkText = "";
        typeReply(chatbotReply.text, (chunk) => {
          chunkText = chunk;
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (updated[lastIndex]?.sender === "chatbot") {
              updated[lastIndex].text = chunkText;
              updated[lastIndex].tokens = response?.messages[lastIndex]?.tokens;
              updated[lastIndex].timestamp =
                response?.messages[lastIndex]?.timestamp;
            } else {
              updated.push({
                sender: "chatbot",
                text: chunkText,
                tokens: response?.messages[(messages, length - 1)]?.tokens,
                timestamp: response?.messages[messages.length - 1]?.timestamp,
              });
            }
            return updated;
          });
        });
      }
    } catch (e) {
      console.error("Error chatting with Groq:", e);
      setMessages((prev) => prev.filter((msg) => !msg.typing));
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
        onClick={() => {
          setOpen(!open);
        }}
        className="fixed bottom-4 right-4 bg-red-800 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors z-[1000]"
      >
        💬
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-16 h-[600px] right-4 bg-white shadow-xl rounded-2xl border border-gray-200 z-[1000]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl relative">
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
          <div className="p-4 overflow-y-auto space-y-4 h-[500px]">
            {messages.map((msg, index) => (
              // <div
              //   key={index}
              //   className={`relative px-4 py-2 rounded-2xl text-sm shadow-md max-w-[95%] whitespace-pre-wrap break-words ${
              //     msg.sender === "user"
              //       ? "bg-green-100 text-black self-end"
              //       : "bg-white text-black self-start border border-gray-200"
              //   }`}
              // >
              <div
                key={index}
                className={`p-2 rounded-2xl shadow-sm max-w-xs sm:max-w-md text-sm 
                ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-blue-900 self-end"
                    : "bg-gray-100 text-gray-800 self-start"
                }`}
              >
                {msg.sender === "chatbot" && (
                  <div className="text-base font-mono">🤖 {msg.text}</div>
                )}
                {msg.sender === "user" && (
                  <div className="text-base font-mono">🧑 {msg.text}</div>
                )}
                {/* <div className="p-2">{msg.text}</div> */}
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {msg.timestamp && <div>{formatTime(msg.timestamp)}</div>}
                  {msg.sender === "chatbot" && msg.tokens && (
                    <div>🧠 Tokens: {msg.tokens.total}</div>
                  )}
                </div>
              </div>
            ))}
            {/* Scroll to bottom */}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2 flex gap-2 border-t bottom-0 w-[100%] absolute bg-white">
            <input
              type="text"
              className="flex-1 border rounded p-1 text-sm"
              placeholder="Ask something..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer"
              } 
              text-white`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingGroqBot;
