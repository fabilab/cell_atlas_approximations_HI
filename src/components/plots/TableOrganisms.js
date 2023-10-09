import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Fade } from 'react-awesome-reveal';
import orgMeta from '../../utils/organismMetadata.js'; 

const { Title } = Typography;
const { Meta } = Card;

const TableOrganisms = ({ organisms}) => {

  const organismImages = Object.keys(orgMeta).map(org => ({
    src: orgMeta[org].imagePath,
    title: orgMeta[org].bioName
  }));

  const rows = [];
  for (let i = 0; i < organismImages.length; i += 4) {
    rows.push(organismImages.slice(i, i + 4));
  }

  const cardBackgroundColor = (imageSrc) => {
    if (!organisms) {
      return 'white';
    }
    return organisms.some(org => imageSrc.includes(org)) ? '#e4eff7' : 'white';
  };
  
  const cardOpacity = (imageSrc) => {
    if (!organisms || organisms.some(org => imageSrc.includes(org))) {
      return '1';
    }
    return '0.3';
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '5vh', marginTop: '5vh' }}>
        Available Organisms
      </Title>

      {rows.map((row, index) => (
        <Row gutter={[32, 24]} key={index} justify="center">
          {row.map((image, innerIndex) => (
            <Col key={innerIndex} xs={24} sm={12} md={8} lg={6}>
              <Fade>
                <Card style={{ 
                  width: '100%', 
                  margin: '10px', 
                  backgroundColor: cardBackgroundColor(image.src),
                  opacity: cardOpacity(image.src)
                  }}>
                  <div
                    style={{
                      height: 80,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={image.src}
                      alt="organisms"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                  <Meta title={<div style={{ textAlign: 'center' }}>{image.title}</div>} />
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
