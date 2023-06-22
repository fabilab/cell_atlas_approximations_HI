// import { useState } from "react";
// import { NavLink, Link } from "react-router-dom";
import { 
  GithubOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  CustomerServiceOutlined
 } from '@ant-design/icons';
 import { Menu, Layout } from 'antd';
 const { Header } = Layout;


const Navbar = () => {

  return (
    <Header style={{padding:'0px'}}>
      <Menu mode="horizontal">
        <Menu.Item>
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
          <a href="https://fabilab.org/" target="_blank"> Contact us</a>
        </Menu.Item>
        <Menu.Item style={{color: "#263238",marginLeft:"48%", fontSize:"1.4em", fontWeight:"bold"}}>
          AtlasApprox
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default Navbar;
