import { Link } from 'react-router-dom';
import {
    GithubOutlined,
    InfoCircleOutlined,
    CodeOutlined,
    CustomerServiceOutlined,
    HomeOutlined
} from '@ant-design/icons';
import logo from '../asset/bot.png';
import { Layout, Row, Col } from 'antd';
const { Header } = Layout;

const Navbar = () => {
    return (
      <Header style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        paddingLeft: '5%', 
        paddingRight: '5%',
        position: 'fixed', 
        top: 0,
        width: '100%',
        zIndex: 10, // Ensures the header is above other content
        backgroundColor: '#1D2531',
        // backgroundColor: 'lightblue',
        opacity: '95%',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Bot Logo" style={{ height: '47px', marginRight: '10px' }} />
        </div>
        <div style={{ display: 'flex'}}>
          <div style={{ fontFamily: "inherit", marginRight: '20px' }}>
            <InfoCircleOutlined />
            <a href='/user-guide' target='_blank' style={{color:'white'}}> User guide</a>
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
