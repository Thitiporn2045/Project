import { Button, ConfigProvider, Form, Input, message, Modal, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import thTH from 'antd/lib/locale/th_TH'; 
import React, { useState } from 'react'
import { QuickRepliesInterface } from '../../../interfaces/psychologist/IComment';
import { CreateQuickReplies } from '../../../services/https/psychologist/comment';

function PsyQuickReplies() {
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const psyID = localStorage.getItem('psychologistID');

  const [form] = Form.useForm();

  const handleSubmit = async(values:QuickRepliesInterface) =>{
    
    const data:QuickRepliesInterface ={
      ...values,
      PsyID: Number(psyID),
    }

    let res = await CreateQuickReplies(data);
    if(res.status) {
      messageApi.success("สำเร็จ !");
      form.resetFields();
      setTimeout(() =>{
        // listComments();
    },1000);
      
    } 
    else{
      messageApi.error(res.message || "เกิดข้อผิดพลาด");
    }
    setIsModalVisible(false);

  }

  const showModal = () =>{
    setIsModalVisible(true);
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Input: {},
          Modal: {
            titleFontSize:20,
            
          },
        },
        token: {
          colorPrimary: '#2C9F99',
          colorText:'#585858',
          fontFamily: 'Noto Sans Thai, sans-serif',
        },
      }}
    >     
    {contextHolder}  
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', marginLeft: '6%',}}>
        <div style={{ width: '95%', height: '70%', background: 'transparent', display: 'flex', flexDirection: 'column',}}>
          <div style={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>ตั้งค่าข้อความตอบกลับ</div>
            <Button type='primary' onClick={showModal}>+ สร้างใหม่</Button>
            <Modal
              title='สร้างข้อความตอบกลับ (Quick Replies)'
              open={isModalVisible}
              onCancel={handleCancel}
              okText={'บันทึก'}
              onOk={()=>form.submit()}
              style={{fontSize:32}}
            >
              <Form 
                form={form}
                onFinish={handleSubmit}
              >
              <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{fontSize:16}}>ชื่อ</div>
                <Form.Item
                  name={'Name'}
                  rules={[{ required: true, message: 'กรุณากรอกชื่อ !' }]}
                >
                  <Input 
                    showCount 
                    maxLength={25} 
                    placeholder="ตัวอย่าง: ชื่นชมความก้าวหน้า" 
                  />
                </Form.Item>
              </div>

              <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{fontSize:16}}>ข้อความ</div>
                <Form.Item
                  name={'Message'}
                  rules={[{ required: true, message: 'กรุณากรอกข้อความ !' }]}
                >
                  <TextArea
                    placeholder='ตัวอย่าง: ดีมากค่ะ/ครับ! คุณกำลังก้าวหน้าในการเรียนรู้และปรับเปลี่ยนความคิด การฝึกฝนแบบนี้จะช่วยให้คุณมั่นใจยิ่งขึ้นค่ะ/ครับ'></TextArea>
                </Form.Item>
              </div>

                
              </Form>

            </Modal>
          </div>
            <div
              className="quickRpliesSetting-container"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border:'solid'
              }}
            >
          
              
            </div>

        </div>
      </div>

    
    </ConfigProvider> 
  )
}

export default PsyQuickReplies