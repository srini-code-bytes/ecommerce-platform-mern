import { FilePlus, Fullscreen } from "lucide-react";
import React from "react";

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
}) => (
  <div
    className={`fixed bottom-16 right-4 bg-white shadow-xl rounded-2xl border
       border-gray-200 transition-all duration-300 ease-in-out z-[1000] ${
         fullScreen ? "top-0 left-0 w-full h-[100vh]" : "w-[400px] right-4"
       }`}
  >
    <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl relative">
      <h3 className="text-lg font-semibold text-gray-800">Groq Assistant</h3>
      <button
        onClick={handleNewSession}
        disabled={loading}
        title="Start new chat"
        className={`absolute top-3 right-16 inline-flex items-center gap-2 px-2 py-1 border rounded-full text-sm font-medium shadow-sm transition-all ${
          loading
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-blue-700 border-blue-500 hover:bg-blue-0"
        }`}
      >
        <FilePlus size={16} />
        New Chat
      </button>

      <button
        onClick={() => setFullScreen(!fullScreen)}
        className="absolute top-2 right-2 text-black px-2 py-1 rounded z-[1000] mr-6 text-lg"
      >
        {fullScreen ? "⇲" : "⛶"}
      </button>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black px-2 py-1 rounded z-[1000] text-md mt-0.5"
      >
        X
      </button>
    </div>

    {/* Chat messages area */}
    <div
      className={`p-4 overflow-y-auto space-y-4 transition-all duration-300 ease-in-out ${
        fullScreen ? "w-auto h-[90vh]" : "h-[500px]"
      }`}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded-2xl shadow-sm max-w-xs ${
            fullScreen ? "max-w-[100rem]" : "sm:max-w-md"
          } w-auto text-sm 
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
        className="flex-1 border rounded p-1 text-sm"
        placeholder="Ask something..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading || chatInput.trim().length === 0}
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

export default MaximizedBot;
