import { Col } from "antd";
import userImage from "../asset/user.jpg";
import bot from "../asset/bot.jpg";
import { useState } from "react";

const Message = (props) => {
    const message = props.message;
    const messageBoxMarginBottom = '1.5em';

    if (props.role === 'user') {
        return (
            <Col xs={16} md={16} lg={18} xl={22} xxl={22} offset={2} style={{marginBottom:messageBoxMarginBottom}}>
                <div className="media">
                    <div className="media-content">
                        <div className="box">
                            {message}
                        </div>
                    </div>
                    <div className="media-right">
                        <figure className="image is-32x32">
                            <img src={userImage} alt="Image"/>
                        </figure>
                    </div>
                </div>
            </Col>
        );
    } else {
        return (
            <Col xs={16} md={16} lg={18} xl={22} xxl={22} style={{marginBottom:messageBoxMarginBottom}}>
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-32x32">
                            <img src={bot} alt="Image"/>
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