import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { Layout, Row, Input } from "antd";
// import Typewriter from "typewriter-effect";
import { updateChat } from "../utils/chatSideEffects";
const { Sider } = Layout;


let debug = true;

// pass in both the old and new user instructions as props
const ChatBox = ({ chatHistory, setChatHistory, currentMessage, setCurrentMessage, setCurrentResponse, plotState }) => {
    const [chatContext, setChatContext] = useState({});
    const [welcomeMessage, setWelcomeMessage] = useState(true);
    const [messageHistory, setMessageHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // auto scroll
    const chatboxRef = useRef(null);
    useEffect(() => {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }, [chatHistory, setChatHistory]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                const previousMessage = messageHistory[historyIndex-1].message;
                setCurrentMessage(previousMessage);
                setHistoryIndex(historyIndex - 1);
            } 
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < messageHistory.length-1) {
                const nextMessage = messageHistory[historyIndex+1].message;
                setCurrentMessage(nextMessage);
                setHistoryIndex(historyIndex + 1);
            } else if (historyIndex === messageHistory.length-1) {
                setCurrentMessage('');
            }
        }
      };
    
    // Reply message to user
    const handleSubmit = ((text) => {
        const newMessage = { message: text, index: messageHistory.length };
        setMessageHistory((messageHistory) => [...messageHistory, newMessage]);
        setHistoryIndex([...messageHistory, newMessage].length)
        if (text === 'clear') {
            setMessageHistory([])
            setHistoryIndex(0);
            setChatHistory([]);
            setChatContext({});
            setCurrentMessage('');
            return "";
        } else if (text.toLowerCase().replace(/\s/g, '') === 'help') {
            // let helpMessage = "<a href=\"index.html\">Restart navigation</a><br><a href=\"userguide.html\">User guide</a>";
            // let helpMessage = "<br>Example queries:";
      
            const exampleQueries = [
                "What organisms are available?",
                "what cell types are present in each organ of mus musculus?",
                "Show 10 marker genes for coronary in human heart.",
                "What cell types are available in human heart?",
                "what cell type is the highest expressor of COL1A1 in human?",
                "show 10 similar genes to TP53 in human lung",
                "What is the expression level of gene ABC in all cell types?"
            ];
            
            setCurrentMessage("");
            const instructions = [...chatHistory]; // this will become the new set of instructions
            const today = new Date();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            instructions.push({ role: 'user', message: text, time: time });
            instructions.push({ role: 'system', message: exampleQueries, time: time, isHelp:true});
            setChatHistory(instructions);

          } else {
            window.ask(text, chatContext)
              .then((response) => {
                updateChat(response)
                  .then((updateObject) => {
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
                    setChatContext(chatContext);
                    const instructions = [...chatHistory]; // this will become the new set of instructions
                    const today = new Date();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    instructions.push({ role: 'user', message: text, time: time });
                    instructions.push({ role: 'system', message: updateObject.message, time: time});
                    setChatHistory(instructions);
                  })
              });
          }          
    })

    return (
        <Sider width={"26vw"} style={{padding:"1%", backgroundColor:"#f5f5f5"}}>
        {/* <Sider width={"26vw"} style={{padding:"1%", backgroundImage: `url(${chatBackground})`}}> */}
            <div style={{ width: "inherit", height: "80vh", overflow: "scroll" }} ref={chatboxRef}>
                {
                    welcomeMessage &&
                    <>
                        <Message key="welcome-message-1" role="system" message="Welcome to AtlasApprox!" pause={false}/>
                        <Message key="welcome-message-2" role="system" message="Please type `help` for a list of typical commands." pause={true} />
                    </>
                }
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
            <div style={{height:"3vh"}}></div>
            <Row>
                <Input.TextArea
                    id="chatBoxInput"
                    allowClear
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
                    onKeyDown={handleKeyDown}
                    onPressEnter={() => handleSubmit(currentMessage)}
                />
            </Row>
            <Row>
                <p style={{ margin: 0, color: "#999", fontSize: "11px" }}>
                    Press 'Enter' to send message. Key up to navigate command history.
                </p>
            </Row>
        </Sider>
    );
};

export default ChatBox
