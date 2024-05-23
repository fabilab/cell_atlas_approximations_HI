import React, { createContext, useRef, useContext } from 'react';

const AutoSubmitContext = createContext();

export const useAutoSubmit = () => {
  return useContext(AutoSubmitContext);
};

export const AutoSubmitProvider = ({ children }) => {
  const autoSubmitButtonRef = useRef(null)

  return (
    <AutoSubmitContext.Provider value={{ autoSubmitButtonRef }}>
      {children}
    </AutoSubmitContext.Provider>
  );
};
