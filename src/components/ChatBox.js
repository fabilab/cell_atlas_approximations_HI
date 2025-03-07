import { useState, useEffect, useRef } from "react";
import { useChat } from './ChatContext'
import { SendOutlined } from '@ant-design/icons';
import Message from "./Message";
import { Button, Row, Input } from "antd";
import { updateChat } from "../utils/chatSideEffects";
import { nlp } from "../utils/chatHelpers/nlpResponseGenerator";

const ChatBox = ({ initialMessage, chatHistory, setChatHistory, setCurrentResponse, plotState }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { localMessage, setLocalMessage, queryInputRef,  inputHighlight } = useChat();
  const chatboxRef = useRef(null);

  const scrollToBottom = () => {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const previousMessage = messageHistory[historyIndex - 1].message;
        setLocalMessage(previousMessage);
        setHistoryIndex(historyIndex - 1);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < messageHistory.length - 1) {
        const nextMessage = messageHistory[historyIndex + 1].message;
        setLocalMessage(nextMessage);
        setHistoryIndex(historyIndex + 1);
      } else if (historyIndex === messageHistory.length - 1) {
        setLocalMessage('');
      }
    }
  };

  const handleSubmit = async (text) => {
    const resetEverything = () => {
      setMessageHistory([]);
      setHistoryIndex(0);
      setChatHistory([]);
      return '';
    }

    const newMessage = { message: text, index: messageHistory.length };
    setMessageHistory((messageHistory) => [...messageHistory, newMessage]);
    setHistoryIndex([...messageHistory, newMessage].length);

    if (text === 'clear') {
      return resetEverything();
    } else {
      let response = await nlp.ask(text);
      try {
        const updateObject = await updateChat(response, plotState)

        // Bail if the user is saying goodbye
        if (updateObject.resetEverything === true) {
          return resetEverything();
        }

        response.hasData = updateObject.hasData;
        if (updateObject.hasData) {
          response.data = updateObject.data;
          response.params = updateObject.params;
        }
        // update parent chat state
        setLocalMessage('');
        
        // update parent response state
        setCurrentResponse(response);

        const instructions = chatHistory ? [...chatHistory] : []; // this will become the new set of instructions
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        instructions.push({ role: 'user', message: text, time: time });
        instructions.push({ role: 'system', message: updateObject.message, time: time });
        setChatHistory(instructions);
        
      } catch (error) {
        console.error("Error occurred during updateChat:", error);
      }
    } 
  };

  useEffect(() => {
    const firstSubmit = async () => {
      await handleSubmit(initialMessage);
    }
    if (!chatHistory || chatHistory.length === 0) {
      firstSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHistory]);

  return (
    <div style={{
      width: "100%", 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%'
    }}>
       <div style={{ 
          flexGrow: 1, 
          overflowY: "auto",
          padding: "3vh 0",
        }} ref={chatboxRef}>
          {chatHistory && chatHistory.length !== 0 &&
            chatHistory.map((m) => (
              <Message
                key={`${m.role}-${m.time}`}
                role={m.role}
                message={m.message}
                pause={false}
                help={m.isHelp}
                onTypingComplete={() => scrollToBottom()}
                onTypingUpdate={() => scrollToBottom()}
              />
          ))}
      </div>
      <Row className="chat-input-row" style={{padding:'10px'}}>
        <div className="chat-input-container">
          <Input.TextArea
            id="chat-box-input"
            ref={queryInputRef}
            autoSize={{ minRows: 4, maxRows: 5 }}
            value={localMessage}
            onChange={(e) => setLocalMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
            onKeyDown={handleKeyDown}
            onPressEnter={() => handleSubmit(localMessage)}
            className="chat-input"
            style={{ borderColor: inputHighlight ? '#1890ff' : 'white', borderWidth: inputHighlight ? '4.5px' : '1px'  }}
          />
          <Button 
            type="text"
            icon={<SendOutlined
              style={{ color: localMessage.length > 0 ? '#1890ff' : 'grey' }}
            />} 
            onClick={() => handleSubmit(localMessage)}
            className="send-button"
          />
        </div>
        <p style={{ margin: '3px', color: "#666s", fontSize: "11px" }}>
          Press 'Enter' to send a message.
          <br/>
          Press up arrow '↑' to navigate command history.
        </p>
      </Row>
    </div>
  );
};

export default ChatBox;
