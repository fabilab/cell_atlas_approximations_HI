import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import triggersPlot from "../utils/chatSideEffects";
import { Layout, Row, Input } from "antd";
const { Sider } = Layout;

// pass in both the old and new user instructions as props
const ChatBox = ({ userInstructions, setUserInstructions }) => {

    // auto scroll
    const chatboxRef = useRef(null);
    useEffect(() => {
        // Scroll to the bottom when messages change (source: chatgpt)
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [{ userInstructions, setUserInstructions }]);
    // message string that the user is typing
    const [currentMessage, setCurrentMessage] = useState('');
    // NLP context
    const [chatContext, setChatContext] = useState({});
    const [welcomeMessage, setWelcomeMessage] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Display a auto bot message when the page load
    useEffect(() => {
        setWelcomeMessage(true);
    },[ ]);

    const handleKey = (e) => {
        if (e.key === 'Enter') {
          handleSubmit(currentMessage);
        } else if (e.key === 'ArrowUp') {
          if (historyIndex === -1) {
            // Save the current message to the history
            setMessageHistory([...messageHistory, currentMessage]);
            setHistoryIndex(messageHistory.length);
          } else if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentMessage(messageHistory[newIndex]);
          }
        } else if (e.key === 'ArrowDown') {
          if (historyIndex >= 0 && historyIndex < messageHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentMessage(messageHistory[newIndex]);
          } else if (historyIndex === messageHistory.length - 1) {
            setHistoryIndex(-1);
            setCurrentMessage('');
          }
        }
      };
      

    // Reply message to user
    const handleSubmit = ((text) => {
        if (text === 'clear') {

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

                // decide if this answer triggers a plot update
                console.log("check if plot update is needed");
                console.log(response);

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
                            Welcome to AtlasApprox! Click 
                            {" "}
                            <a href="https://github.com/fabilab/cell_atlas_approximations">
                            Help
                            </a>{" "}
                            for the user menu.
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
                    onKeyUp={handleKey}
                    // onKeyDown={(e) => {e.key === 'Enter' && handleSubmit(currentMessage)}}
                />
            </Row>
        </Sider>
    );
};

export default ChatBox
