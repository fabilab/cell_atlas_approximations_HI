import { 
  GithubOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
const { Header } = Layout;

const Navbar = ({ setShowLanding }) => {

  const ShowLanding = () => {
    setShowLanding(true);
  }

  return (
    <Header style={{ padding: '0px' }}>
      <Menu
        mode="horizontal"
        style={{
          background: "linear-gradient(45deg, #3282B8 10%, #1F3B75 90%)",
          color: "white",
        }}
      >
        <Menu.Item style={{ fontFamily: "inherit" }}>
          <InfoCircleOutlined /> User Menu
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
        <Menu.Item onClick={ShowLanding} style={{ marginLeft: "40%", marginRight: "10%", fontSize: "1.4em", fontWeight: "bold" }}>
          AtlasApprox
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default Navbar;
