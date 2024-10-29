import { Link } from 'react-router-dom';
import {
    GithubOutlined,
    InfoCircleOutlined,
    CodeOutlined,
    YoutubeOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import logo from '../asset/fabiLogo.png';
import { Layout } from 'antd';
const { Header } = Layout;

const headerStyle = {
  display: 'flex', 
  justifyContent: 'space-between', 
  paddingLeft: '2%', 
  paddingRight: '2%',
  position: 'fixed', 
  top: 0,
  width: '96%',
  zIndex: 999999, // Increase this to ensure it's above the intro.js overlay
  backgroundColor: '#1D2531',
  opacity: '96%',
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  height:'55px',
  boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
}

const navItemStyle = {
  color: 'white',
}

const Navbar = () => {
    return (
      <Header style={headerStyle}>
        <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Bot Logo" style={{ height: '40px', marginRight: '10px' }} />
        </Link>
        <div id="navbar-resources" style={{ 
          display: 'flex',
          padding: '0px 20px', 
          background: '#1D2531', // Match the header background
          borderRadius: '4px',
          position: 'relative',
          zIndex: 999999 
        }}>
          <div style={{ fontFamily: "inherit", marginRight: '20px'}}>
            <InfoCircleOutlined />
            <a href='/#/user-guide' id="user-guide-link" target='_blank' style={navItemStyle} className="tab-link"> User guide</a>
          </div>
          <div style={{ fontFamily: "inherit", marginRight: '20px'}}>
            <YoutubeOutlined />
            <a href='https://www.youtube.com/@fabilab' target='_blank' style={navItemStyle} className="tab-link"> Tutorials</a>
          </div>
          <div style={{ marginRight: '20px' }}>
            <CodeOutlined />
            <a href="//atlasapprox.readthedocs.io/en/latest/index.html" target="_blank" rel="noreferrer" style={navItemStyle} className="tab-link"> API</a>
          </div>
          <div style={{ marginRight: '20px' }}>
            <GithubOutlined />
            <a href="//github.com/fabilab/cell_atlas_approximations" target="_blank"  rel="noreferrer" style={navItemStyle} className="tab-link"> Github Repo
            </a>
          </div>
          <div>
            <CustomerServiceOutlined />
            <a href="//fabilab.org/pages/contact.html" target="_blank" rel="noreferrer" style={navItemStyle} className="tab-link"> Contact us</a>
          </div>
        </div>
      </Header>
    );
}

export default Navbar;

