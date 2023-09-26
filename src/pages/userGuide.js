import React,{ useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import orgMeta from '../utils/organismMetadata'
import { Row, Col, Tabs, Collapse } from 'antd';
import imgIllustration from '../demo/temp_diagram.png';
import geneExpHeatmap from '../demo/geneExpHeatmap.png';
import orgProfile from '../demo/organismProfile.png';
import fractionExp from '../demo/fractionExp.png';
import markers from '../demo/markers.png';
import cellxOrgan from '../demo/cellxOrgan.png';
import highestExpressor from '../demo/highest_expressor.png';
import {
  InfoCircleOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const UserGuide = () => {
  
  const [userGuideMd, setuserGuideMd] = useState('');

  /* CSS in JS */
const markdownStyle = {
  fontFamily: 'Arial, sans-serif',
  color: '#4a4a4a',
  lineHeight: '1.6',
  maxWidth: '70vw',
  margin: '0 auto',
  padding: '20px',
}

const imageStyle = {
  width: '100%',
  display: 'block',
  margin: '0 auto',
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25), 0px 6px 6px rgba(0, 0, 0, 0.10)', // Shadow effect
}

return (
  <>
    <Navbar />
    <div style={{...markdownStyle, marginTop: '5%'}}>
      <h1>Welcome to the AtlasApprox Documentation!</h1>
      <h3>What is AtlasApprox?</h3>
      <div>
        <Row gutter={16}>
          <Col span={14}>
            <h4>
            An intuitive Graphical User Interface (GUI) that allows users to effortlessly navigate through cell types and gene expressions of different organs across various organisms all from a simple web browser.
            </h4>
          </Col>
          <Col span={10}>
            <img src={imgIllustration} alt="Description of Image" style={{ width: '100%' }} />
          </Col>
        </Row>
      </div>
      <Tabs defaultActiveKey="1" centered type='card'>
        <TabPane tab="New Users" key="1">
          <h3>User Story</h3>
          <p>As a newcomer to the field of cell atlas, I want to understand what AtlasApprox offers and explore the basic functionalities.</p>
          <h3>Journey</h3>
          <p><b>Discover Atlas Data:</b> Start by asking, "What species are available in AtlasApprox?"</p>
          <p><b>Choose an Organism:</b> Send a query to the chatbot like, "Explore Mouse."</p>
          <p><b>Deep Dive into the Organism:</b> View the organism profile and interact with the visual interface. Hover over organs on the display map.</p>
          <p><b>Experiment with Queries:</b> Use suggested queries as a starting point and begin your exploration.</p>
        </TabPane>
        <TabPane tab="Biologists / Researchers" key="3">
          <h3>User Story</h3>
          <p>As a biologist or researcher, I'm interested in specific organisms, genes, and cell types. I need tools that can help me discover and analyze these features.</p>
          <h3>Journey:</h3>
          <p><b>Specify Research Interest:</b>Initiate your exploration with a targeted question such as "what cell types are present in each organ of the mouse?".</p>
          <p><b>Data Visulatisation:</b>Utilize AtlasApprox's diverse visualization tools, such as heatmaps and bubble charts, to better understand gene expressions and cell fractions.</p>
          <p><i>Example:</i>"What are the top 10 marker genes of Fibroblast in the mouse lung?"</p>
        </TabPane>
        <TabPane tab="Single Cell Expert" key="2">
          <h3>User Story</h3>
          <p>Equipped with knowledge in single-cell atlases. I have the ability to process data but would like to have access to an advanced platform to quickly surf cell atlases that are already published. </p>
          <h3>Journey:</h3>
          <p><b>Complex Data Queries:</b>Delve deep with queries like, "What is the average expression of gene A, gene B, gene C in a particular mouse organ?"</p>
          <p><b>Comparative Analysis:</b>Use the platform's tools including bubble charts to compare gene expressions or cell distributions across various organisms or organs.</p>
          <p><b>Interactive Data Manipulation: </b>Take advantage of features like zoom, pan, and interactive legends to focus on specific data points within visualizations.</p>
          <p><b>Collaborate and Discuss: </b>Use integrated collaboration tools or forums (if available) to discuss findings with peers or seek expert opinions.</p>
          <p><b>Export for External Analysis: </b>Download intricate data sets as SVG or CSV for analysis in external tools or software to further your research.</p>
        </TabPane>
      </Tabs>
      {/* <h3>Why use AtlasApprox?</h3>
      <div style={{marginBottom:"5vh"}}>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InfoCircleOutlined style={{ fontSize: '40px' }} />
                </div>
              </Col>
              <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3>Simplified Data Exploration</h3>
                <p>With AtlasApprox, there's no steep learning curve. No coding, no setups, just direct access to a treasure trove of single-cell data. Dive right in and start exploring. Whether you're a researcher comparing gene expressions or an enthusiast eager to learn more about specific cell types, AtlasApprox offers a curated and user-friendly environment for all your data exploration needs.</p>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={6} >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InfoCircleOutlined style={{ fontSize: '40px' }} />
                </div>
              </Col>
              <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3>AI-Driven Chatbot Support</h3>
                <p>Got questions? Our intelligent chatbot is here to help. Integrated seamlessly into the platform, it deciphers your queries and provides relevant answers, ensuring a smooth and enriching exploration journey.</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InfoCircleOutlined style={{ fontSize: '40px' }} />
                </div>
              </Col>
              <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3>Comprehensive Organism Data</h3>
                <p>From the intricate cellular workings of Drosophila melanogaster to the complex biology of Homo sapiens, our platform covers an extensive range of organisms. Dive into a rich tapestry of cell types and their gene expressions across diverse species.</p>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InfoCircleOutlined style={{ fontSize: '40px' }} />
                </div>
              </Col>
              <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3>Interactive Visualizations</h3>
                <p>Discover and engage with cellular data using our dynamic visualizations. Through the integration of Plotly.js, AtlasApprox offers a tactile experience, allowing users to dive deeper into the data. Hover over elements, zoom in on areas of interest, and experience a rich, interactive exploration journey.</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div> */}
      <h3>Feature Showcase</h3>
      <Collapse defaultActiveKey={['1']} destroyInactivePanel>
        <Panel header="Organism Profile" key="1">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Explore frog"</p>
          <img src={orgProfile} style={imageStyle} />
        </Panel>
        <Panel header="Gene Expression Heatmap" key="2">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={geneExpHeatmap} style={imageStyle}/>
        </Panel>
        <Panel header="Cell Fraction Bubble Map" key="3">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the fraction of cells expressing MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={fractionExp} style={imageStyle}/>
        </Panel>
        <Panel header="Marker Genes" key="4">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Show 12 markers of dendritic in the m_myoxinus pancreas."</p>
          <img src={markers} style={imageStyle}/>
        </Panel>
        <Panel header="Cell Type Distribution" key="5">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell types are present in each organ of fly?"</p>
          <img src={cellxOrgan} style={imageStyle}/>
        </Panel>
        <Panel header="Highest expressor" key="6">
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell type is the highest expressor of PECAM1 in human?"</p>
          <img src={highestExpressor} style={imageStyle}/>
        </Panel>
      </Collapse>
      {/* <h3>Data Source</h3>
      <p>Our platform integrates data from various reputable sources. Below are the species and their corresponding data references:</p>
      <p>pending ...........</p> */}
      {/* <div>
        {Object.values(orgMeta).map((organism, index) => (
          <div key={index}>
            <p>{organism.bioName} Source: {organism.dataSource}</p>
          </div>
        ))}
      </div> */}
    </div>
  </>
);
};

export default UserGuide;
