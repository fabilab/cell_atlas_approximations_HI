import { Col } from "antd";
import userImage from "../asset/user.jpg";
import bot from "../asset/bot.jpg";
import Typewriter from "typewriter-effect";


const Message = (props) => {
  const { role, message, pause } = props;
  const messageBoxMarginBottom = '1.5em';

  if (role === 'user') {
    return (
      <Col xs={18} md={20} lg={22} xl={22} xxl={22} offset={2} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-content">
            <div className="box">
              {message}
            </div>
          </div>
          <div className="media-right">
            <figure className="image is-32x32">
              <img src={userImage} alt="User"/>
            </figure>
          </div>
        </div>
      </Col>
    );
  } else {
    return (
      <Col xs={18} md={20} lg={22} xl={22} xxl={22} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-left">
            <figure className="image is-32x32">
              <img src={bot} alt="Bot"/>
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

