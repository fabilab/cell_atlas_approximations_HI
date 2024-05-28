import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Fade } from 'react-awesome-reveal';
import orgMeta from '../../utils/organismMetadata.js'; 
import { useChat } from '../ChatContext'; 
const { Title, Text } = Typography;
const { Meta } = Card;

const TableOrganisms = ({ state }) => {
  let { organisms } = state;
  const { setLocalMessage } = useChat();

  let organismCards = Object.keys(orgMeta).map(org => ({
    src: orgMeta[org].imagePath,
    title: orgMeta[org].bioName,
    commonName: orgMeta[org].commonName,
    id: org,
    category: orgMeta[org].category,
  }));

  // Sort by name
  // Code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  organismCards.sort((a, b) => {
    const nameA = a.id.toLowerCase(); // ignore upper and lowercase
    const nameB = b.id.toLowerCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  // Separate organisms into animal and plant arrays
  const animalCards = organismCards.filter(image => image.category === 'Animal');
  const plantCards = organismCards.filter(image => image.category === 'Plant');

  const renderRows = (images) => {
    const rows = [];
    for (let i = 0; i < images.length; i += 4) {
      rows.push(images.slice(i, i + 4));
    }
    return rows;
  };
  
  const cardOpacity = (imageSrc) => {
    let opacity = "0.2";
    for(let i = 0; i < organismCards.length; i++) {
      let orgDicti = organismCards[i];
      if ((orgDicti.src === imageSrc) && (organisms.includes(orgDicti.id))) {
        opacity = "1.0";
        break;
      }
    }
    return opacity;
  };

  return (
    <div>
      <div style={{ textAlign: 'right', marginTop: '2rem', marginRight: '1rem' }}>
        <Text type="secondary">
          Drawings proudly created by Haolan Zhou (lankelcy@qq.com)
        </Text>
      </div>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>
        Animals
      </Title>
      {renderRows(animalCards).map((row, index) => (
        <Row gutter={[32, 24]} key={index} justify="center">
          {row.map((image, innerIndex) => (
            <Col key={innerIndex} xs={24} sm={12} md={8} lg={6}>
              {/* <Fade> */}
              <Card 
                  style={{ width: '100%', margin: '10px', opacity: cardOpacity(image.src) }}
                  onClick={(e) => {
                    let clickedSpecies = `${image.title.toLowerCase().split(' ')[0][0]}_${image.title.toLowerCase().split(' ')[1]}`;
                    setLocalMessage(`explore ${clickedSpecies}`);
                  }}
                  hoverable
                >
                  <div style={{ height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <img src={image.src} alt="coming soon :)" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  </div>
                  <Meta title={<div style={{ textAlign: 'center' }}>{image.title}<br /><span style={{ fontSize: '0.8em', color: '#4196d5' }}>{image.commonName}</span></div>} />
                </Card>
              {/* </Fade> */}
            </Col>
          ))}
        </Row>
      ))}
      <Title level={3} style={{ textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>
        Plants
      </Title>
      {renderRows(plantCards).map((row, index) => (
        <Row gutter={[32, 24]} key={index} justify="center">
          {row.map((image, innerIndex) => (
            <Col key={innerIndex} xs={24} sm={12} md={8} lg={6}>
              <Fade>
              <Card 
                  style={{ width: '100%', margin: '10px', opacity: cardOpacity(image.src) }}
                  onClick={(e) => {
                    let clickedSpecies = `${image.title.toLowerCase().split(' ')[0][0]}_${image.title.toLowerCase().split(' ')[1]}`;
                    setLocalMessage(`explore ${clickedSpecies}`);
                  }}
                  hoverable
                >
                  <div style={{ height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <img src={image.src} alt="coming soon :)" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  </div>
                  <Meta title={<div style={{ textAlign: 'center' }}>{image.title}<br /><span style={{ fontSize: '0.8em', color: '#4196d5' }}>{image.commonName}</span></div>} />
                </Card>
              </Fade>
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default TableOrganisms;
