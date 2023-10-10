import React, { useState } from 'react';
import orgMeta from '../../utils/organismMetadata.js';
import { Card, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';


const FeatureSequences = ({ organism, features, sequences, type }) => {

  const [copyStatus, setCopyStatus] = useState('not-copied');
  // https://stackoverflow.com/questions/62723863/css-overflow-wrap-does-not-work-in-react-js
  const sequenceStyle = {
    width: '98%',            // Set the width to 98%
    // backgroundColor: 'lightgrey',
    whiteSpace: 'pre-wrap',    
    overflowWrap: 'break-word',
    padding: '10px',         // Add padding for spacing
    margin: '0',             // Remove any margin
  };

  const iconStyle = {
    position: 'absolute',
    top: '5px',     // Adjust as needed
    right: '5px',    // Adjust as needed
    fontSize:'15px'
  };

  const handleCopyText = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('not-copied'), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderTooltipContent = () => {
    if (copyStatus === 'copied') {
      return "✓ copied";
    }
    return null;
  };

  let imagePath = require(`../../asset/organisms/${organism}.jpeg`);
  let bioName = orgMeta[organism]?.bioName || "Unknown";

  return (
    <div style={{ width: "inherit" }}>
      <div style={{ 
        padding: "1% 3%"
      }}>
        {features.map((feature, index) => (
          <Card key={index} style={{ 
            marginBottom: '15px' 
          }}>
            <h3 style={{ color: "#2962ff" }}>{feature}</h3>
            <pre style={sequenceStyle}>{sequences[index]}</pre>
            {copyStatus === 'copied' ? 
              <Tooltip title={renderTooltipContent()}>
                <CopyOutlined style={iconStyle} />
              </Tooltip> 
              :
              <CopyOutlined onClick={() => handleCopyText(sequences[index])} style={iconStyle} />
            }
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureSequences;