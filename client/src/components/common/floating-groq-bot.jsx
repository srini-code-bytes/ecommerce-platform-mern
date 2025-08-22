import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import MinimizedBot from "./minimized-bot";
import MaximizedBot from "./maximized-bot";
import { useSnackbar } from "@/context/SnackbarContext";
import { getChatSession, getGrokReply } from "@/store/chatbot-slice";

const IDLE_SECONDS = 100;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "touchstart", "click"];

const FloatingGroqBot = () => {
  const [open, setOpen] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [countdown, setCountdown] = useState(IDLE_SECONDS);
  const [sessionTimeOut, setSessionTimeOut] = useState(false);

  const countdownRef = useRef(null); // holds the setInterval id for the countdown
  const chatEndRef = useRef(null); // ref to scroll to bottom

  // Refs to avoid stale closures
  const sessionIdRef = useRef(""); // session ID
  const countdownActiveRef = useRef(false); // whether the countdown is active
  const listenersAttachedRef = useRef(false); // Are event listeners attached
  const debounceIdRef = useRef(null); // Debounce timer ID

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();

  const formatTime = (isoTime) => {
    return new Date(isoTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ---- Typing effect helper ----
  const typeReply = (fullText, onUpdate, onComplete, speed = 20) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        onUpdate(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
  };

  // ---- Debounce and interval helpers ----
  /*
  Clear the debounce timer if it exists
  */
  // This is used to prevent multiple calls to resetTimer() in quick succession
  // when the user is active (e.g., typing, moving the mouse)
  const clearDebounce = () => {
    if (debounceIdRef.current) {
      clearTimeout(debounceIdRef.current);
      debounceIdRef.current = null;
    }
  };

  /*
  Clear the interval if it exists
  */
  // This is used to stop the countdown when the session times out or when the user becomes active again
  // to prevent multiple intervals running at the same time
  const clearIntervalSafe = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const resetCountdownNumber = () => {
    setCountdown(IDLE_SECONDS);
  };

  // ---- Stop idle timer ----
  /*
  Shut down the countdown and event listeners
  */
  const stopIdleTimer = () => {
    countdownActiveRef.current = false;

    if (listenersAttachedRef.current) {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      listenersAttachedRef.current = false;
    }

    clearDebounce();
    clearIntervalSafe();
  };

  /* ---- Start idle timer ----
   1. Stop any existing timer 
   2. If there is no session id or if the session has timed out then return
   3. Set countdownActiveRef to true
   4. If event listeners are not attached, attach them and set the flag
   5. Reset the timer
   */
  const startIdleTimer = () => {
    stopIdleTimer(); //
    if (!sessionIdRef.current || sessionTimeOut) return;

    countdownActiveRef.current = true;

    if (!listenersAttachedRef.current) {
      ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity));
      listenersAttachedRef.current = true;
    }

    resetTimer();
  };

  // ---- Handle session timeout ----
  /*
  1. Stop the idle timer 
  2. Remove the session ID from localStorage
  3. Flip sessionTimeOut = true, zero the countdown, clear messages/input
  4. Show a persistent snackbar instructing to start a new chat
  */
  const handleSessionTimeout = () => {
    stopIdleTimer();

    localStorage.removeItem("chatSessionId");
    setSessionTimeOut(true);
    setCountdown(0);
    setMessages([]);
    setChatInput("");
  };

  /* ---- Activity handler ----
  1. If countdown is active, debounce a call to resetTimer() by 200 ms
  */
  const onActivity = () => {
    if (!countdownActiveRef.current) return;
    clearDebounce();
    debounceIdRef.current = setTimeout(resetTimer, 200);
  };

  /* ---- Reset timer ----
  1. If countdown is not active, or if session has timed out, or if there is no session id then return
  2. Reset the countdown number -> setCountdown(IDLE_SECONDS)
  3. Clear any existing interval clearIntervalSafe()
  4. Start a new interval that decrements the countdown by 1 second and when it hits 0, then call
  handleSessionTimeout()
  */
  const resetTimer = () => {
    if (
      !countdownActiveRef.current ||
      sessionTimeOut ||
      !sessionIdRef.current
    ) {
      return;
    }

    resetCountdownNumber();
    clearIntervalSafe();

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log("*** My countdown ***", prev);
        if (!countdownActiveRef.current) return prev;
        if (prev <= 1) {
          clearIntervalSafe();
          handleSessionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (sessionTimeOut) {
      if (
        window.confirm(
          "Your session has timed out. Do you want to start a new chat?"
        )
      ) {
        handleNewSession();
      }
    }
  }, [sessionTimeOut]);

  // ---- Init session ----
  useEffect(() => {
    const initSession = async () => {
      let existingSessionId = null;
      try {
        existingSessionId = JSON.parse(
          localStorage.getItem("chatSessionId") || "null"
        );
      } catch {
        existingSessionId = null;
      }

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
          setMessages(data?.messages || []);
          setSessionTimeOut(false);

          setCountdown(IDLE_SECONDS);
        }
      } catch (e) {
        console.error("Error fetching the chat session:", e);
        setMessages([]);
      }

      setSessionId(existingSessionId);
      sessionIdRef.current = existingSessionId;

      startIdleTimer();
    };

    initSession();
    return () => {
      stopIdleTimer();
    };
  }, [dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    if (!user) {
      setOpen(false);
      stopIdleTimer();
      return;
    }

    if (!sessionId || sessionTimeOut) {
      stopIdleTimer();
    } else {
      startIdleTimer();
    }
  }, [user, sessionId, sessionTimeOut]);

  // ---- Send message handler ----
  /*
  1. Ignore blank input; call resetTimer() to keep session alive
  2. Push user message to messages
  3. Push a bot placeholder: { sender:"chatbot", text:"Groq is typing...", typing:true }
  4. Clear input + set loading=true
  5. Build payload { sessionId: sessionIdRef.current, userId, userMessage }
  6. dispatch(getGrokReply(payload)).unwrap()
  7. Take the last message from response as the bot reply (or fallback text)
  8. Use typeReply() to gradually replace the placeholder with streamed chunks:
     - onUpdate(chunk): replace the last bot message (or add one) with the current partial text; add tokens/timestamp if provided
     - onComplete: scroll into view
  9. catch: remove .typing message and show an error message
  10. finally: loading=false, scroll again
  */
  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    resetTimer();

    const userMessage = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMessage]);

    setMessages((prev) => [
      ...prev,
      { sender: "chatbot", text: "Groq is typing...", typing: true },
    ]);

    setChatInput("");
    setLoading(true);

    try {
      const payload = {
        sessionId: sessionIdRef.current,
        userId: user?.id || "Guest",
        userMessage: userMessage.text,
      };

      const response = await dispatch(getGrokReply(payload)).unwrap();

      const reply = response?.messages?.[response?.messages?.length - 1] || {
        text: "Sorry, I couldn't process your message at the moment.",
      };

      typeReply(
        reply.text,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (updated[lastIndex]?.sender === "chatbot") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                text: chunk,
                tokens: reply?.tokens,
                timestamp: reply?.timestamp,
                typing: false,
              };
            } else {
              updated.push({
                sender: "chatbot",
                text: chunk,
                tokens: reply?.tokens,
                timestamp: reply?.timestamp,
                typing: false,
              });
            }
            return updated;
          });
        },
        () => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      );
    } catch (e) {
      console.error("Error chatting with Groq:", e);
      setMessages((prev) => prev.filter((m) => !m.typing));
      setMessages((prev) => [
        ...prev,
        {
          sender: "chatbot",
          text: "Sorry, I couldn't process your message at the moment.",
        },
      ]);
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendMessage();
  };

  /* 
  1. Kill timers/listeners
  2. Generate a new uuid, save it to localStorage
  3. Update sessionId + sessionIdRef
  4. Clear timeout flag, messages, input, and reset countdown
  5. Reopen the widget and restart the idle timer
  6. Show success snackbar
  */
  const handleNewSession = () => {
    stopIdleTimer();
    const newChatSessionId = uuidv4();
    localStorage.setItem("chatSessionId", JSON.stringify(newChatSessionId));

    setSessionId(newChatSessionId);
    sessionIdRef.current = newChatSessionId;

    setSessionTimeOut(false);

    setMessages([]);
    setChatInput("");
    setCountdown(IDLE_SECONDS);
    setOpen(true);

    startIdleTimer();

    showSnackbar({
      message: "New Chat started!",
      severity: "success",
    });
  };

  return (
    <>
      {!open && (
        <MinimizedBot
          onOpen={() => {
            setOpen(true);
            resetTimer();
          }}
        />
      )}

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
          sessionTimeOut={sessionTimeOut}
          countdown={countdown}
          formatCountdown={formatCountdown}
        />
      )}
    </>
  );
};

export default FloatingGroqBot;
