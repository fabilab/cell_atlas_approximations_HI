import React, { useRef, useState } from 'react';
import { Form, Popconfirm, Input, FloatButton } from 'antd';
import { SmileOutlined, MessageOutlined } from '@ant-design/icons';
import emailjs from '@emailjs/browser';

const { TextArea } = Input;

const FeedbackForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [thanksMessage, setThanksMessage] = useState('');

  const formRef = useRef();
  const onFinishFeedbackForm = (values) => {
    formRef.current.resetFields();
    setShowForm(false);
    
    // Send feedback via email
    emailjs.send(
      'atlasapprox_support',
      'template_atlasapprox',
      { message: values.feedback },
      '2njQiG60IwONYzruJ'
    )
    .then((response) => {
      setThanksMessage('Thank you for your feedback!');
    })
    .catch((error) => {
      setThanksMessage('Error submitting feedback. Please try again.');
    });

    // Clear thanksMessage after a few seconds
    setTimeout(() => {
      setThanksMessage('');
    }, 4000); 
  };

  return (
    <>
      <Popconfirm
        title={
          <div>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Hi there, tell us about your experience</div>
            <Form ref={formRef}>
              <Form.Item name="feedback" rules={[{ required: false }]}>
                <TextArea placeholder="Type your feedback here..." rows={4} />
              </Form.Item>
            </Form>
          </div>
        }
        icon={null} 
        open={showForm}
        onConfirm={() => {
          const values = formRef.current?.getFieldsValue(); // Get form values
          onFinishFeedbackForm(values);
        }}
        onCancel={() => {
          formRef.current?.resetFields(); // Reset form fields
          setShowForm(false);
        }}
        okText="Submit"
        cancelText="Cancel"
        placement="topLeft"
        style={{ marginRight: '40px' }}
      >
        <FloatButton
          icon={<MessageOutlined />}
          type="default"
          onClick={() => setShowForm(true)}  
          style={{
            right: 40,
            position: 'fixed',
            bottom: 30,
          }}
        />
      </Popconfirm>
      {
        thanksMessage && 
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 40,
            background: 'white',
            color: 'black',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
          }}
        >
          <SmileOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          {thanksMessage}
        </div>
      }
    </>
  );
};

export default FeedbackForm;
