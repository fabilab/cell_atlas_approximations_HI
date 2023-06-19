import { Card, Divider, Avatar, Popover, Image } from 'antd';


const QuickPlotGeneratorSelection = (props) => {
    const imageURL = "../asset/organisms/a_queenslandica.jpeg"
    return (
        <div>
            {/* <Avatar hoverable
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 64, xxl: 64 }}
            style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar> */}
            <Card
                hoverable
                style={{
                    width: "6vh",
                    height: "6vh",
                    margin: "15px",
                    marginLeft: "20px",
                    borderRadius: "50px",
                    overflow: "hidden",
                }}
                // cover={<img src="https://images.marinespecies.org/thumbs/46694_amphimedon-queenslandica.jpg?w=700" alt="Image" style={{ objectFit: 'cover', height: '100%' }} />}
                >
            </Card>
            <Divider
            style={{
                color:'black',
                fontSize:'0.8em'
            }}
            >
            {props.name}
            </Divider>
        </div>
    );
}

export default QuickPlotGeneratorSelection