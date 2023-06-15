import { useState } from "react";
import Message from "./Message";
import generateSystemResponse from "../utils/generateSystemResponse";

// pass in both the old and new user instructions as props
const ChatBox = (props) => {

    const [currentMessage, setCurrentMessage] = useState(''); // message string that the user is typing

    // Reply message to user
    const sendMessage = (text) => {

        let context = props.context;

        if (text === 'clear') {
            context = props.context = {};
            props.setUserInstructions([]);
            setCurrentMessage('');
        } else {
            const systemMessage = generateSystemResponse(text, context);
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
        <div className="box" style={{height:'inherit'}}>
            <div className="box has-background-info-light" style={{height:'90%', overflow:'scroll'}}>
                {
                    (props.userInstructions.length !== 0) && 
                    props.userInstructions.map(m => <Message key={`${m.role}-${m.time}`} role={m.role} message={m.message}/>)
                }
            </div>
            <div className="block">
                <div className="control has-icons-right">
                    <input 
                        className="input" 
                        type="text" 
                        placeholder="What organisms are available?"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyUp={(e) => {e.key === 'Enter' && handleSubmit(currentMessage)}}
                        />
                    <span className="icon is-right">
                        <i className="far fa-paper-plane"></i>
                    </span>
                </div>      
            </div>
        </div>
    );
}

export default ChatBox
