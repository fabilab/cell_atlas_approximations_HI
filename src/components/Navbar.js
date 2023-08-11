import { Link } from 'react-router-dom';
import {
    GithubOutlined,
    InfoCircleOutlined,
    CodeOutlined,
    CustomerServiceOutlined,
    HomeOutlined
} from '@ant-design/icons';
import logo from '../asset/fabiLogo.png';
import { Layout, Row, Col } from 'antd';
const { Header } = Layout;

const Navbar = () => {
    return (
      <Header style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        paddingLeft: '2%', 
        paddingRight: '2%',
        position: 'fixed', 
        top: 0,
        width: '100%',
        zIndex: 100, // Ensures the header is above other content
        backgroundColor: '#1D2531',
        // backgroundColor: 'lightblue',
        opacity: '96%',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        height:'57px'

      }}>
        <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Bot Logo" style={{ height: '40px', marginRight: '10px' }} />
        </Link>
        <div style={{ display: 'flex'}}>
          <div style={{ fontFamily: "inherit", marginRight: '20px' }}>
            <InfoCircleOutlined />
            <a href='/user-guide' target='_blank' style={{ color: 'white'}}> User guide</a>
          </div>
          <div style={{ marginRight: '20px' }}>
            <CodeOutlined />
            <a href="//atlasapprox.readthedocs.io/en/latest/index.html" target="_blank" style={{color:'white'}}> API</a>
          </div>
          <div style={{ marginRight: '20px' }}>
            <GithubOutlined />
            <a href="//github.com/fabilab/cell_atlas_approximations" target="_blank" style={{color:'white'}}> Github Repo</a>
          </div>
          <div>
            <CustomerServiceOutlined />
            <a href="//fabilab.org/pages/contact.html" target="_blank" style={{color:'white'}}> Contact us</a>
          </div>
        </div>
      </Header>
    );
}

export default Navbar;
