import { Card, Divider } from 'antd';


const QuickPlotGeneratorSelection = (props) => {
    
    return (
        <div>
            <Card span={4} style={{
            width: "8vh",
            height: "8vh",
            margin: "15px",
            borderRadius: "50px",
            overflow: "hidden"
            }}></Card>
            <Divider
            style={{
                color:'grey',
                marginTop: '3px',
                fontSize:'0.9em'
            }}
            >
            {props.name}
            </Divider>
        </div>
    );
}

export default QuickPlotGeneratorSelection