import React,{ useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const UserGuide = () => {
  
  const [userGuideMd, setuserGuideMd] = useState('');

  // fetch markdown content from the server (or local file) when component mounts
  useEffect(() => {
    fetch('userGuide.md')
      .then(response => response.text())
      .then(text => setuserGuideMd(text));
  }, []);

  const components = {
    img({node, ...props}) {
      return <img {...props} alt="images" style={{ width: '100%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
    }
  }
  
  /* CSS in JS */
const markdownStyle = {
  fontFamily: 'Arial, sans-serif',
  color: '#4a4a4a',
  lineHeight: '1.6',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px'
}

return (
  <>
    <Navbar />
    <div style={{...markdownStyle, marginTop: '5%'}}>
      <ReactMarkdown 
        remarkPlugins={[gfm]}
        components={components}
        children={userGuideMd}
      />
    </div>
  </>
);
};

export default UserGuide;
