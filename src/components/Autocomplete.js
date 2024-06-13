import React, { useState, useRef, useEffect } from 'react';
import { Input, Typography, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';


const availableSuggestions = [
  'Explore @organism',
  'Show 10 markers for @celltype in @organism @organ',
];


const Autocomplete = ({ searchMessage, setSearchMessage, sendFirstSearch, focus }) => {
  const [suggestions, setSuggestions] = useState([]);

  // textInput must be declared here so the ref can refer to it
  const queryInput = useRef(null);

  useEffect(() => {
      queryInput.current.focus();
  }, [focus]);


  const handleInputChange = (event) => {
    const value = event.target.value.replace(/(\r\n|\n|\r)/gm, "")
    setSearchMessage(value);
    if (value.length > 0) {
      const filteredSuggestions = availableSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setSearchMessage(value);
    setSuggestions([]);
  };

  return <div style={{ 
           position: 'relative',
           display: 'flex', 
           justifyContent: 'center', 
           alignItems: 'center', 
           marginTop: '8vh' 
         }}>
           <Input
             value={searchMessage}
             style={{
               maxWidth: '50vw', 
               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',  // Shadow effect
               height: '50px',  // Increased height
               borderRadius: '25px',
             }}
             placeholder="Ask me a question OR click on one below..."
             prefix={<RobotOutlined style={{ paddingRight: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }}/> }
             suffix={<SendOutlined style={{paddingLeft: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }} onClick={() => sendFirstSearch(searchMessage)}/>}
             onChange={handleInputChange}
             onPressEnter={() => sendFirstSearch(searchMessage)}
             ref={queryInput}
           />
           {suggestions.length > 0 && (
           <ul className="suggestions-list"
               style={{
                 position: 'absolute',
                 top: '100%',
                 left: '30%',
                 right: 0,
                 border: '1px solid #ccc',
                 background: 'white',
                 list_style: 'none',
                 padding: 0,
                 margin: 0
              }}
           >
             {suggestions.map((suggestion, index) => (
             <li
               key={index}
               onClick={() => handleSuggestionClick(suggestion)}
               // Additional props
               style={{
                   padding: '8px',
                   cursor: 'pointer'
               }}
               >
               {suggestion}
             </li>
             ))}
           </ul>
           )}
         </div>
}

export default Autocomplete;
