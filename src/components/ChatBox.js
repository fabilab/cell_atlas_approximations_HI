import { useState } from "react";
import Message from "./Message";
import triggersPlot from "../utils/chatSideEffects";

// pass in both the old and new user instructions as props
const ChatBox = ({ userInstructions, setUserInstructions }) => {

    // message string that the user is typing
    const [currentMessage, setCurrentMessage] = useState("What is the expression of Ptprc in mouse lung?");
    // NLP context
    const [chatContext, setChatContext] = useState({});

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

                //console.log(text);
                //console.log(response);

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
                        placeholder="help"
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
};

export default ChatBox
