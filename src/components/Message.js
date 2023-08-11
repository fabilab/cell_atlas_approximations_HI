import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import userImage from "../asset/user.png";
import bot from "../asset/bot.png";
import Typewriter from "typewriter-effect";

const Message = (props) => {
  const { role, message, pause, help, setCurrentMessage } = props;

  const profileStyle = {
    width: '26px',
    height: '26px',
    margin: '0px',
  }

  const messageBoxStyle = {
    fontFamily: 'PT Serif',
    fontSize: '14px',
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
      <Col span={22}>
        <div style={messageBoxStyle}>
          {help ? (
            <>
              <div>
                Please look at our <Link to="/user-guide" target="_blank">user guide</Link> for help.
              </div>
            </>
          ) : role === 'user' ? (
            message
          ) : (
            <Typewriter
              options={{
                delay: 10,
              }}
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(pause ? 300 : 0)
                  .typeString(message)
                  .start()
              }}
            />
          )}
        </div>
      </Col>
      {role === 'user' && <Col span={2}><img src={userImage} alt="User Icon" style={profileStyle} /></Col>}
    </Row>
  );
}

export default Message;
