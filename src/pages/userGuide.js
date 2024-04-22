import React from 'react';
import Navbar from '../components/Navbar';
import { Row, Col, Tabs, Collapse, Divider } from 'antd';
import imgIllustration from '../demo/illu.png';
import geneExpHeatmap from '../demo/geneExpHeatmap.png';
import orgProfile from '../demo/organismProfile.png';
import fractionExp from '../demo/fractionExp.png';
import markers from '../demo/markers.png';
import cellxOrgan from '../demo/cellxOrgan.png';
import cellxOrganFrog from '../demo/cellxOrganFrog.png';
import highestExpressor from '../demo/highest_expressor.png';
import markersMouse from '../demo/markers_mouse.png';
import highestMouse from '../demo/highest_exp_mouse.png';
import similarGenes from '../demo/similar-genes.png';
import acrossOrgans from '../demo/across-organs.png';
import chromatinAcc from '../demo/chromatin-acc.png';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const UserGuide = () => {

  const markdownStyle = {
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    maxWidth: '90vw',
    margin: '0 auto',
    padding: '20px',
  }

  const imageStyle = {
    width: '85%',
    display: 'block',
    margin: '0 auto',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25), 0px 6px 6px rgba(0, 0, 0, 0.10)', // Shadow effect
  }

  return (
    <>
      <Navbar />
      <div style={{ ...markdownStyle, marginTop: '5%' }}>
        <h1>Welcome to the cell atlas approximations!</h1>
        <div>
          <Row gutter={16}>
            <Col span={14}>
              <h2 style={{ fontWeight: "normal" }}>
                <b>Cell atlas approximations</b> are a <u>quick way to explore cell diversity across organs and organisms</u>. Are you looking for marker genes or chromatin peaks for your favourite cell type and tissue? Or what cell type is the highest expressor of a specific gene across the entire body? Would you like to explore a species like frog top down, diving into each organ and cell type? Or are you just trying to get a dot plot with the expression of a list of genes in an organ?
              </h2>
              <h2 style={{ fontWeight: "normal" }}>
              This web application can help you with these questions and more!
              </h2>
            </Col>
            <Col span={10}>
              <img src={imgIllustration} alt="" style={{ width: '100%' }} />
            </Col>
          </Row>
        </div>

        <h2 style={{ color: "rgb(48, 49, 49)" }}>What kind of cell diversity are you into? <img src='https://images.emojiterra.com/google/noto-emoji/unicode-15/animated/1f984.gif' style={{width:"35px"}} alt=""></img>
</h2>
		<Divider style={{ borderTopWidth: "1px", borderColor: "rgb(48, 49, 49, 0.5)" }}></Divider>
        <Tabs defaultActiveKey="1" centered type='card'>
          <TabPane tab="Beginner: Basic exploration" key="1">
						<p>As a newcomer to the field of cell atlases, I want to understand what atlas approximations are and get an overview of cell diversity across the tree of life.</p>
						<h3>Journey</h3>
						<p>This journey has four steps, zooming in from the tree of life to a specific organism:</p>
						<Collapse ghost destroyInactivePanel>
							<Panel header="1. Discover atlas data" key="1" style={{fontWeight:"bold"}}>
								Start by asking:
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What species are available?"</p>
							</Panel>
							<Panel header="2. Choose an organism" key="2" style={{fontWeight:"bold"}}>
								<h4>Sample Query:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>Explore frog</p>
								<img src={orgProfile} style={imageStyle} alt='organism profile' />
							</Panel>
							<Panel header="3. Dive into organs" key="3" style={{fontWeight:"bold"}}>
								<h4>Sample Query:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>What cell types are present in each organ of frog?</p>
								<img src={cellxOrganFrog} style={imageStyle} alt='cell type x organ (frog)' />
							</Panel>
							<Panel header="4. Experiment with queries" key="4" style={{fontWeight:"bold"}}>
								<h4>Sample Query:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>Show 20 markers of erythrocyte in frog liver.</p>
								<img src={markers} style={imageStyle} alt='markers (frog)' />
							</Panel>
						</Collapse>
          </TabPane>
          <TabPane tab="Intermediate: Zoom in on an organism and tissue" key="2">
						<p>As an expert of a specific tissue, I have some questions related to cell types, gene expression, and markers.</p>
						<h3>Journey</h3>
						<p>This journey has four steps:</p>
						<Collapse ghost destroyInactivePanel>
							<Panel header="1. List the cell types in the organ of interest" key="1" style={{fontWeight:"bold"}}>
								Start by asking:
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell types are present in mouse lung?"</p>
							</Panel>
							<Panel header="2. Dot plot of a list of genes" key="2" style={{fontWeight:"bold"}}>
                To get the plot, you can type:
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What is the fraction of cells expressing Ms4a1,Col1a1,Col2a1,Ptprc,Cd3e,Tgfbi,Cd19,Tp53 in mouse lung?"</p>
								<img src={fractionExp} style={imageStyle} alt='cell fraction example (mouse)' />
							</Panel>
							<Panel header="3. Cell type markers" key="3" style={{fontWeight:"bold"}}>
								<h4>To get a list and plot of marker genes, type the following:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Show the top 10 marker genes of pericyte in mouse lung"</p>
								<img src={markersMouse} style={imageStyle} alt='marker genes (mouse)' />
							</Panel>
							<Panel header="4. Track a gene of interest across organs" key="4" style={{fontWeight:"bold"}}>
								<h4>To check who is expressing that one gene, type:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Who is the highest expressor of Ms4a1 in mouse?"</p>
								<img src={highestMouse} style={imageStyle} alt='highest expressor (mouse)' />
							</Panel>
						</Collapse>
          </TabPane>
          <TabPane tab="Advanced: Chase biological insights" key="3">
						<p>As an advanced user with expertise in single-cell atlases, I'm looking for a robust platform to navigate, compare, and extract detailed insights from published cell atlases efficiently.</p>
						<h3>Journey</h3>
						<p>This journey outlines a series of advanced functionalities and how to harness them for in-depth analysis:</p>
						<Collapse ghost destroyInactivePanel>
							<Panel header="1. Correlated/similar features" key="1" style={{fontWeight:"bold"}}>
								Once you find a gene of interest, you can chase the white rabbit using correlation analysis. Type:
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Show 10 genes similar to Ms4a1 in mouse lung."</p>
                Hey! - our friend Cd19 is there, as expected.
								<img src={similarGenes} style={imageStyle} alt='similar genes' />
							</Panel>
							<Panel header="2. Compare a cell type across multiple organs" key="2" style={{fontWeight:"bold"}}>
                Are lung fibroblasts the same as heart fibroblasts? Well, to know the answer, type:
              <p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Compare expression of APOE, CD19, COL1A1, TGFBI, EPCAM, COL2A1, COL13A1 in fibroblast across organs in human."</p>
              (Hint: They are not... are they?)
			  				<img src={acrossOrgans} style={imageStyle} alt='compare fibroblast across organs' />
							</Panel>
							<Panel header="3. Delve into the mysterious world of gene regulation" key="3" style={{fontWeight:"bold"}}>
								<h4>To explore chromatin accessibility data, type:</h4>
								<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"List highest accessibility of chr1:9955-10355 in human."</p>
								<img src={chromatinAcc} style={imageStyle} alt='chromatin accessibility' />
							</Panel>
							<Panel header="4. Export and beautify" key="4" style={{fontWeight:"bold"}}>
								<h4>For each plot, you can export the data as a CSV, or the plot itself as a vector (SVG) or raster (PNG) figure, using the bar above the plot. Extend your analysis beyond the web application!</h4>
							</Panel>
							<Panel header="5. Automate, automate, automate!" key="5" style={{fontWeight:"bold"}}>
								<h4>Cell atlas approximations can be queried programmatically from Python, R, JavaScript, Bash, and any other programming language using the <a href="http://atlasapprox.readthedocs.io/en/latest/index.html">APIs</a>! Take a dip if you want to scale up your analysis.</h4>
							</Panel>
						</Collapse>
				</TabPane>
        </Tabs>
        <h2 style={{ color: "rgb(48, 49, 49)" }}>Feature list</h2>
        Below is a non-exhaustive list of features available. Please open a <a href="https://github.com/fabilab/cell_atlas_approximations_HI/issues">Github issue</a> if you need a new feature. We are always interested in feedback.
        <Divider style={{ borderTopWidth: "1px", borderColor: "rgb(48, 49, 49, 0.5)" }}></Divider>
        <Collapse destroyInactivePanel>
					<Panel header="Organism Profile" key="1" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Explore frog"</p>
						<img src={orgProfile} style={imageStyle} alt='organism profile'/>
					</Panel>
					<Panel header="Gene Expression Heatmap" key="2" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What is the expression of MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?"</p>
						<img src={geneExpHeatmap} style={imageStyle} alt='gene expression heatmap'/>
					</Panel>
					<Panel header="Cell Fraction Bubble Map" key="3" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What is the fraction of cells expressing MED4, VWF, COL1A1, APOE, COL2A1, COL13A1, COL14A1, TGFBI, PDGFRA, CRH, GZMA in human lung?"</p>
						<img src={fractionExp} style={imageStyle} alt='cell fraction visualisation'/>
					</Panel>
					<Panel header="Marker Genes" key="4" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"Show 12 markers of dendritic in the m_myoxinus pancreas."</p>
						<img src={markers} style={imageStyle} alt='marker genes expression profile'/>
					</Panel>
					<Panel header="Cell Type Distribution" key="5" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell types are present in each organ of fly?"</p>
						<img src={cellxOrgan} style={imageStyle} alt='celltype x organ table'/>
					</Panel>
					<Panel header="Highest expressor" key="6" style={{fontWeight:"bold"}}>
						<h4>Sample Query:</h4>
						<p style={{color: "#3d5afe", fontWeight: 'bold'}}>"What cell type is the highest expressor of PECAM1 in human?"</p>
						<img src={highestExpressor} style={imageStyle} alt='highest expressor'/>
					</Panel>
        </Collapse>
      </div>
    </>
  );
};

export default UserGuide;
