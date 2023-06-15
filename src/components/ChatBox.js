import { useState, forwardRef } from "react";
import Message from "./Message";
import triggersPlot from "../utils/generateSystemResponse";

// pass in both the old and new user instructions as props
const ChatBox = forwardRef((props, ref) => {

    const [currentMessage, setCurrentMessage] = useState(''); // message string that the user is typing
    // / history of the chat (both the box and the user's message)
    const [userInstructions, setUserInstructions] = useState([]);
    const [chatContext, setChatContext] = useState({});

    // Reply message to user
    const handleSubmit = ((text) => {
        async function sendMessageAsync(text) {
            if (text === 'clear') {
                setUserInstructions([]);
                setChatContext({});
                setCurrentMessage('');
                return "";
            } else {
                return window.ask(text, chatContext);
            }
        }

        return sendMessageAsync(text)
            .then((response) => { 
                if (response === "")
                    return;

                const messagesArray = [...userInstructions]; // this will become the new set of instructions
                const today = new Date();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                //console.log(text);
                //console.log(response);

                messagesArray.push({role: 'user', message: text, time: time});
                messagesArray.push({role: 'system', message: response.answer, time: time, response: response});

                // update state
                setUserInstructions(messagesArray);
                setChatContext(chatContext);

                // reset current message
                setCurrentMessage('');

                // decide if this answer triggers a plot update

                const latestResponse = userInstructions.slice(-1)[0];
                //console.log(latestResponse);

                console.log("check if plot update is needed");

                // If the NLP response has no side-effect for the plot, exit
                if (triggersPlot(latestResponse)) {
                    console.log("triggering plot update");
                    props.setParentStale();
                }

            });
    })

    return (
        <div className="box" style={{height:'inherit'}}>
            <div className="box has-background-info-light" style={{height:'90%', overflow:'scroll'}}>
                {
                    (userInstructions.length !== 0) && 
                     userInstructions.map(m => <Message key={`${m.role}-${m.time}`} role={m.role} message={m.message}/>)
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
})

export default ChatBox
