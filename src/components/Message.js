import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import bot from "../asset/bot.png";
import Typewriter from "typewriter-effect";

const Message = (props) => {
  const { role, message, pause, help, setCurrentMessage } = props;
  let formattedMessage = message;
  formattedMessage = formattedMessage.replace(/,([^ ])/g, ', $1');

  
  const profileStyle = {
    width: '26px',
    height: '26px',
    margin: '0px',
  }

  const messageBoxStyle = {
    fontFamily: 'Sans-Serif',
    fontSize: '13.5px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: role === 'user' ? '#565C5E' : 'white',
    color: role === 'user' ? 'white' : '#565C5E',
    marginLeft: role === 'user' ? '0px' : '10px',
    width: '88%',
  }

  return (
    <Row 
      gutter={[0, 10]} 
      style={{ 
        marginBottom: '1.5em', 
        marginRight: '1em', 
        marginLeft: '1em', 
      }}
    >
      {(role !== 'user') && <Col span={2}><img src={bot} alt="Bot Icon" style={profileStyle} /></Col>}
      {(role === 'user') ? (
        <Col span={21} offset={3}> {/* This will offset user's message to the right */}
          <div style={messageBoxStyle}>
            {formattedMessage}
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

