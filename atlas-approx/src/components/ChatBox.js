import { useState } from "react";
import { GithubOutlined } from '@ant-design/icons';
import Message from "./Message";
import generateSystemResponse from "../utils/generateSystemResponse";

import { Layout, Row, Input, Col } from "antd";
const { Sider } = Layout;

// pass in both the old and new user instructions as props
const ChatBox = (props) => {

    const [currentMessage, setCurrentMessage] = useState(''); // message string that the user is typing

    // Reply message to user
    const sendMessage = (text) => {

        if (text === 'clear') {
            props.setUserInstructions([]);
            setCurrentMessage('');
        } else {
            const systemMessage = generateSystemResponse(text);
            const messagesArray = [...props.userInstructions]; // this will become the new set of instructions
            const today = new Date();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            messagesArray.push({role: 'user', message: text, time: time});
            messagesArray.push({role: 'system', message: systemMessage, time: time});

            props.setUserInstructions(messagesArray); // let parent know that I am updating the set of instructions
            setCurrentMessage('');
        }
    };

    const handleSubmit = (text) => {
        sendMessage(text);
    }

    return (
        <Sider width={"25vw"} style={{padding:"1%", backgroundColor:"#263238"}}>
            <div style={{ width: "inherit", height: "80vh", overflow:"scroll"}}>
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
                    onKeyUp={(e) => {e.key === 'Enter' && handleSubmit(currentMessage)}}
                />
            </Row>
        </Sider>
    );
}

export default ChatBox