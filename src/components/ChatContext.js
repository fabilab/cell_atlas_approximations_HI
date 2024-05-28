import React, { createContext, useState, useContext, useRef } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [localMessage, setLocalMessage] = useState('');
  const queryInputRef = useRef(null);

  return (
    <ChatContext.Provider value={{ localMessage, setLocalMessage, queryInputRef }}>
      {children}
    </ChatContext.Provider>
  );
};
