import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import a_queenslandica from '../../asset/organisms/a_queenslandica.jpeg';
import h_sapiens from '../../asset/organisms/h_sapiens.png';
import m_leidyi from '../../asset/organisms/m_leidyi.jpeg';
import s_lacustris from '../../asset/organisms/s_lacustris.jpeg';
import c_elegans from '../../asset/organisms/c_elegans.jpeg';
import m_musculus from '../../asset/organisms/m_musculus.jpeg';
import t_adhaerens from '../../asset/organisms/t_adhaerens.jpeg';
import d_rerio from '../../asset/organisms/d_rerio.jpeg';
import m_myoxinus from '../../asset/organisms/m_myoxinus.jpeg';
import { Fade } from "react-awesome-reveal";
const { Title } = Typography;

const { Meta } = Card;

const TableOrganisms = () => {
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    setShowImages(true);
  }, []);

  const organismImages = [
    {
      src: a_queenslandica,
      title: 'Amphimedon queenslandica',
    },
    {
      src: c_elegans,
      title: 'Caenorhabditis elegans',
    },
    {
      src: d_rerio,
      title: 'Danio rerio (zebrafish)',
    },
    {
      src: h_sapiens,
      title: 'Homo sapiens (human)',
    },
    {
      src: m_leidyi,
      title: 'Mnemiopsis leidyi (warty comb jelly)',
    },
    {
      src: m_musculus,
      title: 'Mus musculus (house mouse)',
    },
    {
      src: m_myoxinus,
      title: 'Microcebus myoxinus (pygmy mouse lemur)',
    },
    {
      src: s_lacustris,
      title: 'Spongilla lacustris',
    },
    {
      src: t_adhaerens,
      title: 'Trichoplax adhaerens',
    },
  ];

  const rows = [];
  for (let i = 0; i < organismImages.length; i += 3) {
    rows.push(organismImages.slice(i, i + 3));
  }

  return (
    <div>
      <Title level={2} style={{ textAlign:'center', marginBottom:"4vh", marginTop:"3vh"}}>Available Organisms</Title>

      {rows.map((row, index) => (
        <Row gutter={[16, 16]} key={index} justify="center">
          {row.map((image, innerIndex) => (
            <Col key={innerIndex} xs={24} sm={12} md={8} lg={6}>
            <Fade>
              <Card style={{ width: '100%' , margin: "10px"}}>
                <div
                  style={{
                    height: 140,
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
