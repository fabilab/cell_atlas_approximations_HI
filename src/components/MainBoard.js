import React, { useRef, useState, useEffect } from 'react';

import ChatBox from './ChatBox';
import PlotBox from './PlotBox';

function MainBoard() {

    const chatBox = useRef();
    const plotBox = useRef();
    const [stale, setStale] = useState(false);

    // run this function to update User's 
    useEffect(() => {
        if (!stale)
            return;

        const latestResponse = chatBox.current.getUserInstructions().slice(-1)[0].response;
        plotBox.current.updateFromNLP(latestResponse);
        setStale(false);

    }, [stale])

    return (
        <div className="columns mb-0 pb-0 has-background-light" style={{position:"absolute",height:"100%", width:"100%"}}>
            <div className="column is-4" style={{height:'inherit'}}>
                <ChatBox 
                    ref={ chatBox }
                    setParentStale={() => setStale(true)}
                />
            </div>
            <div className="column is-8" id='canvas'>
                {
                <PlotBox
                    ref={ plotBox }
                />
                }
            </div>
        </div>
    )
}

export default MainBoard;
