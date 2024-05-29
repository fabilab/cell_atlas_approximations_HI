import React, { createContext, useState, useContext, useRef } from "react";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [localMessage, setLocalMessage] = useState("");
  const queryInputRef = useRef(null);
  const [inputHighlight, setInputHighlight] = useState(false);

  const inputBorderFlash = () => {
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      setInputHighlight(prev => !prev);
      flashCount++;
      if (flashCount === 8) { // 3 times on and 3 times off
        clearInterval(flashInterval);
        setInputHighlight(false); // Ensure it ends in the 'off' state
      }
    }, 500); // Adjust the interval as needed
  };

  return (
    <ChatContext.Provider
      value={{
        localMessage,
        setLocalMessage,
        queryInputRef,
        inputHighlight,
        inputBorderFlash,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
