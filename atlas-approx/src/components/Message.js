import { Col } from "antd";

const Message = (props) => {
    const message = props.message;

    const messageBoxMarginBottom = '1.5em';

    if (props.role === 'user') {
        return (
            <Col span={20} offset={4} style={{marginBottom:messageBoxMarginBottom}}>
                <div className="media">
                    <div className="media-content">
                        <div className="box">
                            {message}
                        </div>
                    </div>
                    <div className="media-right">
                        <figure className="image is-32x32">
                            <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image"/>
                        </figure>
                    </div>
                </div>
            </Col>
        );
    } else {
        return (
            <Col span={20} style={{marginBottom:messageBoxMarginBottom}}>
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-32x32">
                            <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image"/>
                        </figure>
                    </div>
                    <div className="media-content">
                        <div className="box">
                            {message}
                        </div>
                    </div>
                </div>
            </Col>
            
        );
    }
}
    

export default Message