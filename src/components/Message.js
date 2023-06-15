const Message = (props) => {
    const message = props.message;
    if (props.role === 'user') {
        return (
            <div className="column is-7 is-offset-5">
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
            </div>
        );
    } else {
        return (
            <div className="column is-7">
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
            </div>
        );
    }
}
    

export default Message