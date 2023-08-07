import React, { useState, useEffect, useRef } from "react";
import { SendOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Message from "./Message";
import { Button, Layout, Row, Input } from "antd";
import { updateChat } from "../utils/chatSideEffects";
import { AtlasApproxNlp } from "@fabilab/atlasapprox-nlp";
const { Sider } = Layout;
const { Item } = Menu;

const ChatBox = ({ chatHistory, setChatHistory, currentMessage, setCurrentMessage, setCurrentResponse, plotState }) => {
  const [chatContext, setChatContext] = useState({});
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [messageHistory, setMessageHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const chatboxRef = useRef(null);
  useEffect(() => {
    // Function to scroll the chatbox to the bottom
    const scrollToBottom = () => {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [chatHistory, setChatHistory]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const previousMessage = messageHistory[historyIndex - 1].message;
        setCurrentMessage(previousMessage);
        setHistoryIndex(historyIndex - 1);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < messageHistory.length - 1) {
        const nextMessage = messageHistory[historyIndex + 1].message;
        setCurrentMessage(nextMessage);
        setHistoryIndex(historyIndex + 1);
      } else if (historyIndex === messageHistory.length - 1) {
        setCurrentMessage('');
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
	} else if (text.toLowerCase().replace(/\s/g, '') === 'help') {
		const exampleQueries = [
			"What organisms are available?",
      "where are @celltype detected in @organism?",
			"what cell types are present in each organ of mus musculus?",
			"Show 10 marker genes for coronary in human heart.",
			"What cell types are available in human heart?",
			"what cell type is the highest expressor of COL1A1 in human?",
			"show 10 similar genes to APOE in human lung",
			"show 5 cell types like lung fibroblast in mouse",
      "what is the chromatin accessibility of APOE,COL1A1 in mouse lung?",
		];
  
		setCurrentMessage('');
		const instructions = [...chatHistory]; // this will become the new set of instructions
		const today = new Date();
		const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		instructions.push({ role: 'user', message: text, time: time });
		instructions.push({ role: 'system', message: exampleQueries, time: time, isHelp: true });
		setChatHistory(instructions);

	} else {
    let nlp = new AtlasApproxNlp(chatContext);
    await nlp.initialise();
    let response = await nlp.ask(text);
    setChatContext(nlp.context);
    console.log(response);

    try {
      const updateObject = await updateChat(response,plotState)
      response.hasData = updateObject.hasData;
      console.log("Line 82 in ChatBox.js");
      console.log(response);
      if (updateObject.hasData) {
        response.data = updateObject.data;
        response.params = updateObject.params;
      }

      // update parent response state
      setCurrentResponse(response);

      // update parent chat state
      setCurrentMessage('');
      
      const instructions = [...chatHistory]; // this will become the new set of instructions
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

  return (
    <Sider width={"27vw"} style={{ padding: "0.8%", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "inherit", height: "80vh", overflow: "scroll"}} ref={chatboxRef}>
          {welcomeMessage && (
            <>
              <Message key="welcome-message-1" role="system" message="Welcome to AtlasApprox! <br>Please type `help` for a list of typical commands." pause={true} />
            </>
          )}
          {chatHistory.length !== 0 &&
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
      <div style={{ height: "3vh" }}></div>
      <Row className="chat-input-row">
        <div className="chat-input-container">
          <Input.TextArea
            id="chatBoxInput"
            // allowClear
            autoSize={{ minRows: 4, maxRows: 5 }}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
            onKeyDown={handleKeyDown}
            onPressEnter={() => handleSubmit(currentMessage)}
            className="chat-input"
          />
          <Button 
            type="text"
            icon={<SendOutlined
              style={{ color: currentMessage.length > 0 ? '#1890ff' : 'grey' }}
            />} 
            onClick={() => handleSubmit(currentMessage)}
            className="send-button"
            ghost
          />
        </div>
      </Row>
      <Row>
        <p style={{ margin: 0, color: "#666", fontSize: "11px" }}>
          Press 'Enter' to send a message. Key up to navigate command history.
        </p>
      </Row>
    </Sider>
  );
};

export default ChatBox;
