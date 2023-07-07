import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import heatmapSample from '../asset/plots/heatmap.png';
import dotplotSample from '../asset/plots/dotplot.png';
import networkSample from '../asset/plots/network.png';
const { Title } = Typography;

const Landing = ({currentMessage, setCurrentMessage}) => {

    const sampleQueries = [
        'What organisms are available in AtlasApprox?',
        'List cell types in microcebus myoxinus pancreas',
        'What is the average expression of ALK,CD8A,CD19 in human lung?',
        'Show the marker genes for coronary in human heart.',
        'What is the fraction of IL6,TNF,APOE,COL1A1,ALK,CD8A,CD19,TP53 in human lung?',
        'what cell type is the highest expressor of ALK in human?',
        'what cell types are present in each organ of mouse?',
    ];

    return (
        <div className="landing-page">
            <Title level={2} style={{ textAlign:'center', marginBottom:"4vh", marginTop:"3vh"}}>Cell Atlas Approximations </Title>
            <Row gutter={48} className="card-row">
                <Col span={1} />
                <Col span={6}>
                    <Card className="landing-plot">
                        <img src={heatmapSample} alt="Heatmap" />
                    </Card>
                </Col>
                {/* <Col span={1} /> */}
                <Col span={9}>
                    <Card className="landing-plot">
                        <img src={dotplotSample} alt="Dot plot" />
                    </Card>
                </Col>
                {/* <Col span={1} /> */}
                <Col span={6}>
                    <Card className="landing-plot">
                        <img src={networkSample} alt="Network" />
                    </Card>
                </Col>
                <Col span={1} />
        </Row>
            <div style={{ textAlign:'center', margin:'7vh'}}>
                <Title level={4} style={{ marginBottom:"5vh", color:"#1890ff"}}>Example questions:</Title>
                {sampleQueries.map((s,index) => (
                    <p 
                    key={index} 
                    onClick={() => setCurrentMessage(s)}
                    style={{
                        margin:"1vh",
                        color: currentMessage === s ? '#fa8c16' : 'initial',
                        cursor: 'pointer',
                        ':hover':{ color: 'lightblue' }
                    }}
                    >
                        {s}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Landing;
