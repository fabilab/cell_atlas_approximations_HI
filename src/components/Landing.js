import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import heatmapSample from '../asset/plots/heatmap.png';
import dotplotSample from '../asset/plots/dotplot.png';
import networkSample from '../asset/plots/network.png';
import { Content } from 'react-bulma-components';
const { Title } = Typography;

const Landing = ({currentMessage, setCurrentMessage}) => {

    const sampleQueries = [
        'What organisms are available in AtlasApprox?',
        'List cell types in microcebus myoxinus pancreas',
        'What is the average expression of ALK,CD8A,CD19 in human lung?',
        'What are the marker genes of a specific cell type in mouse pancreas?',
        'What is the fraction of IL6,TNF,APOE,COL1A1,ALK,CD8A,CD19,TP53 in human lung?',
    ];

    return (
        <div className="landing-page">
            <Title level={3} style={{ textAlign:'center', marginBottom:"5vh", marginTop:"5vh"}}>Zero-backend Single Cell Atlas Exploration</Title>
            <Row gutter={48} className="card-row">
                <Col span={2} />
                <Col span={5}>
                    <Card className="landing-plot">
                        <img src={heatmapSample} alt="Heatmap" />
                    </Card>
                </Col>
                <Col span={1} />
                <Col span={8}>
                    <Card className="landing-plot">
                        <img src={dotplotSample} alt="Dot plot" />
                    </Card>
                </Col>
                <Col span={1} />
                <Col span={5}>
                    <Card className="landing-plot">
                        <img src={networkSample} alt="Network" />
                    </Card>
                </Col>
                <Col span={2} />
        </Row>
            <Content style={{ textAlign:'center', margin:'10vh'}}>
                <Title level={4} style={{ marginBottom:"5vh", color:"#1890ff"}}>AtlasApprox enables biologists,doctors and data scientist to quickly find answers for questions such as:</Title>
                {sampleQueries.map((s,index) => (
                    <p 
                    key={index} 
                    onClick={() => setCurrentMessage(s)}
                    style={{
                        color: currentMessage === s ? '#fa541c' : 'initial',
                        cursor: 'pointer',
                    }}>
                        {s}
                    </p>
                ))}
            </Content>
        </div>
    );
};

export default Landing;
