import { Link } from 'react-router-dom';
import { 
  GithubOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
const { Header } = Layout;

const Navbar = ({ }) => {

  return (
    <Header style={{ padding: '0px' }}>
        <Menu
          className="customMenu"
          mode="horizontal"
          style={{
            display: 'flex', // Add this
            justifyContent: 'space-between', // Add this
            background: "linear-gradient(45deg, #3282B8 10%, #1F3B75 90%)",
            color: "white",
            opacity:"0.95",
          }}
        >
          <div style={{ display: 'flex', flexGrow: 1, marginLeft:"5%" }}> 
            <Menu.Item style={{ fontFamily: "inherit" }}>
              <InfoCircleOutlined />
              <a href='/user-guide' target='_blank' rel='noopener noreferrer'> User guide</a>
            </Menu.Item>
            <Menu.Item>
              <CodeOutlined />
              <a href="https://atlasapprox.readthedocs.io/en/latest/index.html" target="_blank"> API</a>
            </Menu.Item>
            <Menu.Item>
              <GithubOutlined />
              <a href="https://github.com/fabilab/cell_atlas_approximations" target="_blank"> Github Repo</a>
            </Menu.Item>
            <Menu.Item>
              <CustomerServiceOutlined />
              <a href="https://fabilab.org/pages/contact.html" target="_blank"> Contact us</a>
            </Menu.Item>
          </div>
          <Menu.Item style={{ fontSize: "1.4em", fontWeight: "bold", marginRight: '5%'}}>
            <HomeOutlined className="navbar-icon" />
            <a href='http://localhost:3000/'>AtlasApprox</a>
          </Menu.Item>
        </Menu>
    </Header>
  );
}

export default Navbar;
