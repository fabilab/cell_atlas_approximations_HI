import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import heatmapSample from '../asset/plots/heatmap.png';
import dotplotSample from '../asset/plots/dotplot.png';
import networkSample from '../asset/plots/network.png';
const { Title } = Typography;

const Landing = ({ currentMessage, setCurrentMessage }) => {

  const sampleQueries = [
    'what species are available?',
    'show tissues for @organism in chromatin accessibility.',
    'Show the marker genes for coronary in human heart.',
    'what cell types are present in each organ of @organism?',
    'what cell type is the highest expressor of TP53 in human?',
    'What is the fraction of IL6,TNF,APOE,CD8A,CD19,TP53 in human lung?',
    'What is the average expression of IL6,TNF,APOE,COL1A1,ALK,TP53 in human lung?',
  ];

  return (
    <div className="landing-page">
      <Title level={2} style={{ textAlign: 'center', marginBottom: "4vh", marginTop: "3vh" }}>Cell Atlas Approximations </Title>
      <Row gutter={48} className="card-row">
        <Col span={1} />
        <Col span={6}>
          <Card className="landing-plot">
            <img src={heatmapSample} alt="Heatmap" />
          </Card>
        </Col>
        <Col span={9}>
          <Card className="landing-plot">
            <img src={dotplotSample} alt="Dot plot" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="landing-plot">
            <img src={networkSample} alt="Network" />
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      <div style={{ textAlign: 'center', margin: '7vh' }}>
        <Title level={4} style={{ marginBottom: "2vh", color: "#1890ff" }}>Example questions:</Title>
        {sampleQueries.map((s, index) => (
          <p
            key={index}
            onClick={() => setCurrentMessage(s)}
            style={{
              margin: "1.5vh",
              color: currentMessage === s ? '#fa8c16' : 'initial',
              cursor: 'pointer',
              ':hover': { color: 'lightblue' }
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
