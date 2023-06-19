import { useState, useEffect, useRef } from "react";
import { GithubOutlined } from '@ant-design/icons';
import Message from "./Message";
import generateSystemResponse from "../utils/generateSystemResponse";

import { Layout, Row, Input, Col } from "antd";
const { Sider } = Layout;

// pass in both the old and new user instructions as props
const ChatBox = (props) => {

    const chatboxRef = useRef(null);
    const [currentMessage, setCurrentMessage] = useState(''); // message string that the user is typing
    const [NLPContext, setNLPContext] = useState({});
    const [userInstructions, setUserInstructions] = useState([]);

    useEffect(() => {
        // Scroll to the bottom when messages change (source: chatgpt)
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, [props]);

    // Reply message to user
    const sendMessage = async (userMessage) => {

        if (userMessage === 'clear') {
            props.setUserInstructions([]);
            setCurrentMessage('');
        } else if (userMessage === 'help') {

        } else {
            // const systemResponse = {answer: 'Processing...'};
            const messagesArray = [...props.userInstructions]; // this will become the new set of instructions
            const today = new Date();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            messagesArray.push({role: 'user', message: userMessage, time: time});

            // Generate system reponse and store ith
            const systemResponse = await generateSystemResponse(userMessage, NLPContext);
            console.log(systemResponse);
            if (!systemResponse) {
                messagesArray.push({role: 'system', message: "Sorry, I don't understand the question....", time:time});
            } else {
                messagesArray.push({role: 'system', message: systemResponse.answer, time: time});
            }
            props.setUserInstructions(messagesArray);
            setCurrentMessage('');
        }
    };

    return (
        <Sider width={"25vw"} style={{padding:"1%", backgroundColor:"#263238"}}>
            <div style={{ width: "inherit", height: "80vh", overflow:"scroll"}} ref={chatboxRef}>
                {
                    (props.userInstructions.length !== 0) && 
                    props.userInstructions.map(m => <Message key={`${m.role}-${m.time}`} role={m.role} message={m.message}/>)
                }
            </div>
            <div style={{height:"5vh"}}></div>
            <Row>
                <Input.TextArea
                    allowClear
                    placeholder="Send a message"
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyUp={(e) => {e.key === 'Enter' && sendMessage(currentMessage)}}
                />
            </Row>
        </Sider>
    );
}

export default ChatBox