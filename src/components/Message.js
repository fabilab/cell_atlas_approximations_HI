import { Col } from "antd";
import userImage from "../asset/user.jpg";
import bot from "../asset/bot.jpg";
import Typewriter from "typewriter-effect";


const Message = (props) => {
  const { role, message, pause, help, setCurrentMessage } = props;
  const messageBoxMarginBottom = '1.5em';
  if (role === 'user') {
    return (
      <Col xs={18} md={20} lg={22} xl={23} xxl={24} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-left">
            {/* <figure className="image is-32x32">
              <img src={userImage} alt="User"/>
            </figure> */}
          </div>
          <div className="media-content">
            <div className="box" style={{backgroundColor:"#307ca5", color:"white"}}>
              {message}
            </div>
          </div>
        </div>
      </Col>
    );
  } else if (help) {
    return (
      <Col xs={18} md={20} lg={22} xl={23} xxl={24} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-left">
            {/* <figure className="image is-32x32">
              <img src={bot} alt="Bot"/>
            </figure> */}
          </div>
          <div className="media-content">
            <div className="box" style={{ width: 'inherit' }}>
            {
              message.map((m, i) => (
                <a 
                  key={i}
                  onClick={() => setCurrentMessage(m)}
                >
                  {m}
                  <br></br>
                </a>
              ))
            }
            </div>
          </div>
        </div>
      </Col>
    );
  } else {
    return (
      <Col xs={18} md={20} lg={22} xl={23} xxl={24} style={{marginBottom: messageBoxMarginBottom}}>
        <div className="media">
          <div className="media-left">
            {/* <figure className="image is-32x32">
              <img src={bot} alt="Bot"/>
            </figure> */}
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

