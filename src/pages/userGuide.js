import React,{ useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import orgMeta from '../utils/organismMetadata'
import { Row, Col, Tabs, Collapse, Divider } from 'antd';
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
  // color: '#4a4a4a',
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
      {/* <h3>What is AtlasApprox?</h3> */}
      <div>
        <Row gutter={16}>
          <Col span={14}>
            <h2 style={{fontWeight:"normal"}}>
            <b>AtlasApprox</b> is an online resource to explore cell diversity across the tree of life. We provide access to cell types, gene expression, and chromatin accessibility across organs and organisms, from humans to plants via fish, insects, sponges, and more.
            
            </h2>
          </Col>
          <Col span={10}>
            <img src={imgIllustration} alt="Description of Image" style={{ width: '100%' }} />
          </Col>
        </Row>
      </div>
      <Divider orientation="left">Examples</Divider>
      <Tabs defaultActiveKey="1" centered type='card'>
        <TabPane tab="Example 1: Explore the tree of life" key="1">
          <p>As a newcomer to the field of cell atlases, I want to understand the basic functionality and explore atlases across the tree of life.</p>
          <h3>Journey</h3>
          <p>This journey has four steps, zooming in from the tree of life to a specific organism:</p>

          <Collapse ghost destroyInactivePanel>
        <Panel header="1. Discover atlas data" key="1" style={{fontWeight:"bold"}}>
          Start by asking:
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What species are available in AtlasApprox?"</p>
          <img src={orgProfile} style={imageStyle} />
        </Panel>
        <Panel header="2. Choose an organism" key="2" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={geneExpHeatmap} style={imageStyle}/>
        </Panel>
        <Panel header="3. Dive into organs" key="3" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={geneExpHeatmap} style={imageStyle}/>
        </Panel>
        <Panel header="4. Experiment with queries" key="4" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={geneExpHeatmap} style={imageStyle}/>
        </Panel>

      </Collapse>
        </TabPane>
        <TabPane tab="Example 2: Focus on one organism and tissue" key="3">
          <h3>User Story</h3>
          <p>As a biologist or researcher, I'm interested in specific organisms, genes, and cell types. I need tools that can help me discover and analyze these features.</p>
          <h3>Journey:</h3>
          <p><b>Specify Research Interest:</b>Initiate your exploration with a targeted question such as "what cell types are present in each organ of the mouse?".</p>
          <p><b>Data Visulatisation:</b>Utilize AtlasApprox's diverse visualization tools, such as heatmaps and bubble charts, to better understand gene expressions and cell fractions.</p>
          <p><i>Example:</i>"What are the top 10 marker genes of Fibroblast in the mouse lung?"</p>
        </TabPane>
        <TabPane tab="Example 3: Advanced usage" key="2">
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
      <Divider orientation="left">List of queries</Divider>
      <Collapse destroyInactivePanel>
        <Panel header="Organism Profile" key="1" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Explore frog"</p>
          <img src={orgProfile} style={imageStyle} />
        </Panel>
        <Panel header="Gene Expression Heatmap" key="2" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={geneExpHeatmap} style={imageStyle}/>
        </Panel>
        <Panel header="Cell Fraction Bubble Map" key="3" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>What is the fraction of cells expressing MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?</p>
          <img src={fractionExp} style={imageStyle}/>
        </Panel>
        <Panel header="Marker Genes" key="4" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Show 12 markers of dendritic in the m_myoxinus pancreas."</p>
          <img src={markers} style={imageStyle}/>
        </Panel>
        <Panel header="Cell Type Distribution" key="5" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell types are present in each organ of fly?"</p>
          <img src={cellxOrgan} style={imageStyle}/>
        </Panel>
        <Panel header="Highest expressor" key="6" style={{fontWeight:"bold"}}>
          <h4>Sample Query:</h4>
          <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell type is the highest expressor of PECAM1 in human?"</p>
          <img src={highestExpressor} style={imageStyle}/>
        </Panel>
      </Collapse>
    </div>
  </>
);
};

export default UserGuide;
