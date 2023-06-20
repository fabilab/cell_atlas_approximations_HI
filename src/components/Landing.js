import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import heatmapSample from '../asset/plots/heatmap.png';
import dotplotSample from '../asset/plots/dotplot.png';
import networkSample from '../asset/plots/network.png';
import { Content } from 'react-bulma-components';

const { Title } = Typography;

const LandingPage = () => {
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
            <p>What is the expression of a specific gene in human lung?</p>
            <p>What are the marker genes of a specific cell type in mouse pancreas?</p>
            <p>What fraction of cells (of a specific type) express a gene of interest?</p>
        </Content>
    </div>
  );
};

export default LandingPage;
