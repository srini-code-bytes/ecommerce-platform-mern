import { getChatSession, getGrokReply } from "@/store/chatbot-slice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import MinimizedBot from "./minimized-bot";
import MaximizedBot from "./maximized-bot";

const FloatingGroqBot = () => {
  const [open, setOpen] = useState(false); // State to control the visibility of the chatbot
  const [fullScreen, setFullScreen] = useState(false); // State to toggle full screen mode
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
  const typeReply = (fullText, onUpdate, onComplete, speed = 20) => {
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

  const handleNewSession = () => {
    const newChatSessionId = uuidv4();
    localStorage.removeItem("chatSessionId");
    localStorage.setItem("chatSessionId", JSON.stringify(newChatSessionId));
    setSesssionId(newChatSessionId)
    setMessages([])
    setChatInput("")
    setOpen(true)
  }

  return (
    <>
      {!open && <MinimizedBot onOpen={() => setOpen(true)} />}
      {open && (
        <MaximizedBot
          handleNewSession={handleNewSession}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSubmit={handleSubmit}
          loading={loading}
          formatTime={formatTime}
          chatEndRef={chatEndRef}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
  
};

export default FloatingGroqBot;
