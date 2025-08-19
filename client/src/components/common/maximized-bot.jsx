import { useThemeContext } from "@/context/ThemeContext";
import { FilePlus, Fullscreen } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const MaximizedBot = ({
  messages,
  chatInput,
  handleSubmit,
  loading,
  formatTime,
  onClose,
  setChatInput,
  chatEndRef,
  fullScreen,
  setFullScreen,
  handleNewSession,
  sessionTimeOut,
  countdown,
  formatCountdown,
}) => {
  const { mode, toggleMode } = useThemeContext();

  return (
    <div
      className={`fixed bottom-16 right-4  shadow-xl rounded-2xl border
       border-gray-200 transition-all duration-300 ease-in-out z-[1000] ${
         fullScreen ? "top-0 left-0 w-full h-[100vh]" : "w-[500px] right-4"
       }
        ${mode === "light" ? "bg-white text-black" : "bg-black text-white"}
       `}
    >
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl relative transition-all duration-300 ease-in-out">
        <div className="flex">
          <h3 className="text-lg font-semibold text-gray-800">
            Groq Assistant
          </h3>

          <button
            onClick={toggleMode}
            title="Toggle Light/Dark mode"
            className="ml-1 text-xl"
          >
            {mode === "light" ? "☀️" : "🌙"}
          </button>

          {!sessionTimeOut && (
            <span
              className={`text-sm text-red-600 mt-[4px] transition-all duration-300 ease-in-out ${
                fullScreen ? "ml-[1210px]" : "ml-[18px]"
              }`}
            >
              ⏳ {formatCountdown(countdown)}
            </span>
          )}
        </div>
        <button
          onClick={handleNewSession}
          title="Start new chat"
          className={`absolute top-3 right-16 inline-flex items-center gap-2 px-2 py-1 border rounded-full text-sm font-medium shadow-sm transition-all mt-[3px] ${
            loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-blue-700 border-blue-500 hover:bg-blue-0"
          }`}
        >
          <FilePlus size={12} />
          New Chat
        </button>

        <button
          onClick={() => setFullScreen(!fullScreen)}
          className="absolute top-2 right-2 text-black px-2 py-1 rounded z-[1000] mr-6 text-lg mt-[3px]"
        >
          {fullScreen ? "⇲" : "⛶"}
        </button>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black px-2 py-1 rounded z-[1000] text-md mt-[5px]"
        >
          X
        </button>
      </div>

      {/* Chat messages area */}
      <div
        className={`p-4 overflow-y-auto space-y-4 transition-all duration-300 ease-in-out  ${
          fullScreen ? "w-auto h-[95vh] pb-[70px]" : "h-[500px] pb-[48px]"
        }`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-2xl shadow-sm ${
              fullScreen ? "max-w-[90vw]" : "sm:max-w-md"
            }
                ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-blue-900 self-end"
                    : "bg-gray-100 text-gray-800 self-start"
                }`}
          >
            {msg.sender === "chatbot" ? (
              <div className="flex items-start justify-between gap-2">
                <div className="text-base font-mono">🤖 {msg.text}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            ) : (
              <div className="text-base font-mono">🧑 {msg.text}</div>
            )}

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

      <form
        onSubmit={handleSubmit}
        className="p-2 flex gap-2 border-t bottom-0 w-[100%] absolute bg-white"
      >
        <input
          type="text"
          className="flex-1 border rounded p-1 text-sm text-black"
          placeholder="Ask something..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={sessionTimeOut}
        />
        <button
          type="submit"
          disabled={sessionTimeOut || loading || chatInput.trim().length === 0}
          className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${
                loading || chatInput.trim().length === 0
                  ? "bg-blue-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer"
              } 
              text-white`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default MaximizedBot;
