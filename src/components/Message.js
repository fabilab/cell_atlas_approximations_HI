import { Row, Col, Tooltip } from "antd";
import { Link } from "react-router-dom";
import bot from "../asset/bot.png";
import Typewriter from "typewriter-effect";
import { CopyOutlined } from '@ant-design/icons';
import { useState } from "react";

const Message = (props) => {
  const { role, message, pause, help } = props;
  const [copyStatus, setCopyStatus] = useState('not-copied');
  let formattedMessage = message;
  formattedMessage = formattedMessage.replace(/,([^ ])/g, ', $1');

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

  const profileStyle = {
    width: '23px',
    height: '23px',
    margin: '0px',
  }

  const messageBoxStyle = {
    fontSize: '13px',
    backgroundColor: role === 'user' ? '#565C5E' : 'white',
    color: role === 'user' ? 'white' : '#565C5E',
    marginLeft: role === 'user' ? '0px' : '10px',
    position: 'relative',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '6px',
    marginLeft: role === 'user' ? '15px' : '0px',
    marginRight: role === 'user' ? '0px' : '15px',
  }

  const iconStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize:'12px'
  };

  return (
    <Row 
      gutter={[0, 10]} 
      style={{ 
        marginBottom: '1.5em', 
        marginRight: '0.8em', 
        marginLeft: '0.8em', 
      }}
    >
      {(role !== 'user') && <Col span={2}><img src={bot} alt="Bot Icon" style={profileStyle} /></Col>}
      {(role === 'user') ? (
      <Col span={21} offset={3}> {/* This will offset user's message to the right */}
          <div style={messageBoxStyle}>
            {formattedMessage}
            {copyStatus === 'copied' ? 
              <Tooltip title={renderTooltipContent()}>
                <CopyOutlined style={iconStyle} />
              </Tooltip> 
              :
              <CopyOutlined onClick={() => handleCopyText(formattedMessage)} style={iconStyle} />
            }
          </div>
      </Col>
      ) : (
        <Col span={22}>
          <div style={messageBoxStyle}>
            {help ? (
              <div>
                Please look at our <Link to="/user-guide" target="_blank">user guide</Link> for help.
              </div>
            ) : (
              <Typewriter
                options={{
                  delay: 10,
                  cursor: ""
                }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(pause ? 5 : 0)
                    .typeString(formattedMessage)
                    .start()
                }}
              />
            )}
          </div>
        </Col>
      )}
    </Row>
  );
}

export default Message;

