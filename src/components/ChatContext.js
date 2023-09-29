import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [localMessage, setLocalMessage] = useState('');

  return (
    <ChatContext.Provider value={{ localMessage, setLocalMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
