import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';


const FeatureSequences = ({ state }) => {
  let { features, sequences } = state;

  const [copyStatus, setCopyStatus] = useState('not-copied');
  // https://stackoverflow.com/questions/62723863/css-overflow-wrap-does-not-work-in-react-js
  const sequenceStyle = {
    width: '98%',
    whiteSpace: 'pre-wrap',    
    overflowWrap: 'break-word',
    padding: '10px',
    margin: '0',       
  };

  const iconStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
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
