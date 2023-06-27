import { useState, useEffect, useRef } from "react";
import TypeWriterEffect from 'react-typewriter-effect';
import Message from "./Message";
import triggersPlot from "../utils/chatSideEffects";
import { Layout, Row, Input } from "antd";
const { Sider } = Layout;

// pass in both the old and new user instructions as props
const ChatBox = ({ userInstructions, setUserInstructions, currentMessage, setCurrentMessage }) => {
    const [chatContext, setChatContext] = useState({});
    const [welcomeMessage, setWelcomeMessage] = useState(false);
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
        setWelcomeMessage(true);
    },[ ]);

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

        return window.ask(text, chatContext)
            .then((response) => { 
                if (response === "")
                    return;

                const today = new Date();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                // If the NLP response has no side-effect for the plot, exit
                response.plot = triggersPlot(response);
                if (response.plot) {
                    console.log("triggering plot update");
                }

                // update state
                setCurrentMessage('');
                setChatContext(chatContext);

                // update parent state
                const instructions = [...userInstructions]; // this will become the new set of instructions
                instructions.push({role: 'user', message: text, time: time});
                instructions.push({role: 'system', message: response.answer, time: time, response: response});
                setUserInstructions(instructions);
            });
    })

    return (
        <Sider width={"25vw"} style={{padding:"1%", backgroundColor:"#263238"}}>
            <div style={{ width: "inherit", height: "80vh", overflow: "scroll" }} ref={chatboxRef}>
                {welcomeMessage && (
                    <Message
                        key="welcome-message"
                        role="system"
                        message={
                        <>
                        <TypeWriterEffect
                            textStyle={{ fontFamily: 'Red Hat Display',fontSize: '1.2em',}}
                            startDelay={100}
                            cursorColor="black"
                            multiText={["Welcome to AtlasApprox!","Type `help` for a list of typical commands."]} 
                            multiTextDelay={1000}
                            typeSpeed={40}
                        />
                        <br />
                        {/* <TypeWriterEffect
                            textStyle={{ fontFamily: 'Red Hat Display', fontSize: '1.2em' }}
                            startDelay={2000}
                            cursorColor="black"
                            text="Type help for info."
                            typeSpeed={40}
                        /> */}
                        </>
                        }
                    />
                )}
                {userInstructions.length !== 0 &&
                userInstructions.map((m) => (
                    <Message key={`${m.role}-${m.time}`} role={m.role} message={m.message} />
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
