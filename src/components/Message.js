import { Col } from "antd";
import userImage from "../asset/user.jpg";
import bot from "../asset/bot.jpg";
import Typewriter from "typewriter-effect";

const Message = (props) => {
  const { role, message, pause, help, setCurrentMessage } = props;
  const messageBoxMarginBottom = '1.5em';

  if (role === 'user') {
    return (
      <Col xs={18} md={20} lg={24} xl={24} xxl={24} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-left" style={{paddingTop:"9px"}}>
            <figure className="image is-24x24">
              <img style={{borderRadius:"15px", verticalAlign:"middle"}} src={userImage} alt="User"/>
            </figure>
          </div>
          <div className="media-content">
            <div className="box" style={{backgroundColor:"#e8f5e9", color:"black"}}>
              {message}
            </div>
          </div>
        </div>
      </Col>
    );
  } else if (help) {
    return (
      <Col xs={18} md={20} lg={24} xl={24} xxl={24} style={{ marginBottom: messageBoxMarginBottom }}>
        <div className="media">
          <div className="media-left" style={{paddingTop:"9px"}}>
            <figure className="image is-24x24">
              <img style={{borderRadius:"15px"}} src={bot} alt="Bot"/>
            </figure>
          </div>
          <div className="media-content">
            <div className="box" style={{ width: 'inherit' }}>
              {message.map((m, i) => (
                <a
                  key={i}
                  onClick={() => setCurrentMessage(m)}
                >
                  {m}
                  <br />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Col>
    );
  } else {
    return (
      <Col xs={18} md={20} lg={24} xl={24} xxl={24} style={{ marginBottom: messageBoxMarginBottom }}>
        <div className="media">
          <div className="media-left" style={{paddingTop:"9px"}}>
            <figure className="image is-24x24">
              <img style={{borderRadius:"15px"}} src={bot} alt="Bot"/>
            </figure>
          </div>
          <div className="media-content">
            <div className="box" style={{ width: 'fit-content' }}>
              <Typewriter
                options={{
                  delay: 30, // Change the delay between each character (default: 70)
                }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(pause ? 1500 : 0)
                    .typeString(message)
                    .start()
                }}
              />
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

export default Message;
