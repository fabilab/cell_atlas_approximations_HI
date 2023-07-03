import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { Layout, Row, Input } from "antd";
import Typewriter from "typewriter-effect";
const { Sider } = Layout;


let debug = true;

// pass in both the old and new user instructions as props
const ChatBox = ({ userInstructions, setUserInstructions, currentMessage, setCurrentMessage }) => {
    const [chatContext, setChatContext] = useState({});
    const [welcomeMessage, setWelcomeMessage] = useState(true);
    const [messageHistory, setMessageHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // auto scroll
    const chatboxRef = useRef(null);
    useEffect(() => {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [{userInstructions, setUserInstructions}]);

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
    // Display a auto bot message when the page load
    useEffect(() => {
        // Display welcome message after a certain delay
        const timer = setTimeout(() => {
          setWelcomeMessage(true);
        }, 1000);
    
        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);
    

    async function callAPI(endpoint, params = {}) {
        // Phrase https request from params (they are all GET for now, so URI encoding suffices)
        let uri = "https://api.atlasapprox.org/v1/" + endpoint
    
        const uriSuffix = new URLSearchParams(params).toString();
        if (uriSuffix !== "")
            uri += "?" + uriSuffix;
    
        if (debug)
            console.log("API URI: " + uri)
    
        let response = await fetch(uri);
    
        // Check response
        let data;
        if (!response.ok) {
            data = {
                error: "API call failed",
            }
        } else {
            // NOTE: response.body is a stream, so it can be processed only ONCE
            data = await response.json();
        }
        return data;
    }
    // Reply message to user
    const handleSubmit = ((text) => {
        const newMessage = { message: text, index: messageHistory.length };
        setMessageHistory((messageHistory) => [...messageHistory, newMessage]);
        setHistoryIndex([...messageHistory, newMessage].length)
        if (text === 'clear') {
            setMessageHistory([])
            setHistoryIndex(0);
            setUserInstructions([]);
            setChatContext({});
            setCurrentMessage('');
            return "";
        }
        else {
            window.ask(text, chatContext)
                .then((response) => {
                    if(response === "")
                        return;
                    
                    let complete = response.complete;
                    let entities = response.entities; 
                    let intent = response.intent;
                    console.log("response is " + response);
                    const today = new Date();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    console.log("current intent is" + intent);
                    if (complete) {
                        const { endpoint, params } = window.buildAPIParams(intent,entities);
                        callAPI(endpoint, params).then((data) => {
                            console.log(data);
                            const answer = window.buildAnswer(intent, data);
                            const responseData = {
                                intent: intent,
                                endpoint: endpoint,
                                params: params,
                                answer: answer,
                            }
                            // update state
                            setCurrentMessage('');
                            setChatContext(chatContext);

                            // update parent state
                            const instructions = [...userInstructions]; // this will become the new set of instructions
                            instructions.push({role: 'user', message: text, time: time});
                            instructions.push({role: 'system', message: answer, time: time,response: responseData});
                            setUserInstructions(instructions);
                        })
                    } else {

                        setCurrentMessage('');
                        setChatContext(chatContext);

                        // forward the followup question to chatbox
                        console.log("follow up question is " + response.followUpQuestion);
                        const instructions = [...userInstructions];
                        instructions.push({role: 'user', message: text, time: time});
                        instructions.push({role: 'system', message: response.followUpQuestion, time: time});
                        setUserInstructions(instructions);
                    }
                });
        }
    })

    return (
        <Sider width={"25vw"} style={{padding:"1%", backgroundColor:"#263238"}}>
            <div style={{ width: "inherit", height: "80vh", overflow: "scroll" }} ref={chatboxRef}>
                {
                    welcomeMessage &&
                    <>
                        <Message key="welcome-message-1" role="system" message="Welcome to AtlasApprox!" pause={false}/>
                        <Message key="welcome-message-2" role="system" message="Please type `help` for a list of typical commands." pause={true} />
                    </>
                }
                {userInstructions.length !== 0 &&
                userInstructions.map((m) => (
                    <Message key={`${m.role}-${m.time}`} role={m.role} message={m.message} pause={false}/>
                ))}
            </div>
            <div style={{height:"5vh"}}></div>
            <Row>
                <Input.TextArea
                    allowClear
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
                    onKeyDown={handleKeyDown}
                    onPressEnter={() => handleSubmit(currentMessage)}
                />
            </Row>
        </Sider>
    );
};

export default ChatBox
