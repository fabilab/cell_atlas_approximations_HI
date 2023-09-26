import { useState, useEffect, useRef } from "react";
import { SendOutlined } from '@ant-design/icons';
import Message from "./Message";
import { Button, Layout, Row, Input } from "antd";
import { updateChat } from "../utils/chatSideEffects";
import { AtlasApproxNlp } from "@fabilab/atlasapprox-nlp";

const ChatBox = ({ initialMessage, chatHistory, setChatHistory, setCurrentResponse, plotState }) => {
  const [currentMessage, setCurrentMessage] = useState(initialMessage || '');
  const [chatContext, setChatContext] = useState({});
  const [messageHistory, setMessageHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [localMessage, setLocalMessage] = useState(initialMessage || '');

  const chatboxRef = useRef(null);
  useEffect(() => {
    // Function to scroll the chatbox to the bottom
    const scrollToBottom = () => {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    };
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

    const newMessage = { message: text, index: messageHistory.length };
    setMessageHistory((messageHistory) => [...messageHistory, newMessage]);
    setHistoryIndex([...messageHistory, newMessage].length);

    if (text === 'clear') {
      setMessageHistory([]);
      setHistoryIndex(0);
      setChatHistory([]);
      setChatContext({});
      setCurrentMessage('');
      return '';
    } else {
      setCurrentMessage(localMessage); 
      let nlp;
      if (chatHistory) {
        nlp = new AtlasApproxNlp(chatContext);
      } else {
        nlp = new AtlasApproxNlp({});
      }
      await nlp.initialise();
      let response = await nlp.ask(text);
      setChatContext(nlp.context);

      try {
        const updateObject = await updateChat(response,plotState)
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
    } // else
  }; //handleSubmit

  useEffect(() => {
    if (!chatHistory || chatHistory.length === 0) {
      handleSubmit(localMessage);
    }
  }, [chatHistory]);

  return (
    <div style={{ 
        width: "26%",
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        height: "inherit",
        backgroundColor: "#e4eff7",
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}>
      <div style={{ width: "100%", overflow: "scroll", height:`${window.innerHeight*0.75}px`, paddingTop:"3vh"}} ref={chatboxRef}>
          {chatHistory && chatHistory.length !== 0 &&
            chatHistory.map((m) => (
              <Message
                key={`${m.role}-${m.time}`}
                role={m.role}
                message={m.message}
                pause={false}
                help={m.isHelp}
                setCurrentMessage={(m) => setCurrentMessage(m)}
              />
          ))}
      </div>
      <Row className="chat-input-row" style={{padding:'10px'}}>
        <div className="chat-input-container">
          <Input.TextArea
            id="chatBoxInput"
            // allowClear
              autoSize={{ minRows: 4, maxRows: 5 }}
              value={localMessage}
              onChange={(e) => setLocalMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
              onKeyDown={handleKeyDown}
              onPressEnter={() => handleSubmit(localMessage)}
              className="chat-input"
          />
          <Button 
            type="text"
            icon={<SendOutlined
              style={{ color: currentMessage.length > 0 ? '#1890ff' : 'grey' }}
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
