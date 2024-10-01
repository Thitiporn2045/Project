import { Button, ConfigProvider, Form, Input, message, Select } from 'antd'
import thTH from 'antd/lib/locale/th_TH';
import React, { useState } from 'react'

const initialPsychologist = {
  firstname:'ศุภชลิตา',
  lastname:'พลนงค์',
  tel:'0812345678',
  email:'note.psy@gmail.com',
  password:'note1234',
  profilepic:'https://via.placeholder.com/150?text=Psy'
}
const reasons = [
  { id: '1', label: 'ต้องการหยุดการให้บริการ' },
  { id: '2', label: 'พบปัญหาทางเทคนิค' },
  { id: '3', label: 'ไม่พอใจในบริการ' },
  { id: '4', label: 'เหตุผลอื่นๆ' }
];

function PsyDelAccount() {
  const [psychologist, setPsychologist] = useState(initialPsychologist);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');


  const handleDeleteAccount = (event: React.FormEvent<HTMLFormElement>) => {

    // Validate password and perform account deletion
    if (password === psychologist.password) {
      // Handle account deletion here (e.g., call API)
      message.success('บัญชีผู้ใช้ถูกลบเรียบร้อยแล้ว');
    } else {
      message.error('รหัสผ่านไม่ถูกต้อง');
    }
  };
  return (
    <ConfigProvider
      locale={thTH}
        theme={{
          components:{
            Input:{
            }
          },
          token:{
            colorPrimary: '#63C592',
            colorText:'#585858',
            fontFamily:'Noto Sans Thai, sans-serif'
          }
        }}>
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',marginLeft:'6%'}}>
        <div style={{width:'30%',height:'70%',background:'transparent',display:'flex',flexDirection:'column'}}>
        <Form onFinish={handleDeleteAccount}>
            <div
              className="delAccount-container"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                ลบบัญชีผู้ใช้
              </span>
                <div style={{display:'flex',flexDirection:'column',}}>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    โปรดแจ้งเหตุผลให้เราทราบเพื่อการปรับปรุงที่ดีขึ้น
                    <Form.Item
                      name="reason"
                      rules={[{ required: true, message: 'กรุณาเลือกเหตุผล' }]}
                    >
                    <Select
                      id="reason" 
                      onChange={(value) => setReason(value)} 
                      placeholder="เลือกเหตุผล"
                    >
                      {reasons.map((reason) => (
                        <Select.Option key={reason.id} value={reason.id}>
                          {reason.label}
                        </Select.Option>
                      ))}
                    </Select>
                    </Form.Item>
                  </div>
                  <div>
                    รหัสผ่าน
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
                    >
                    <Input.Password
                      id="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      />
                      </Form.Item>
                  </div>
                  <div style={{display:'flex',justifyContent:'end'}}>
                    <Form.Item>
                    <Button 
                      type="primary" 
                      danger 
                      htmlType="submit">
                        ลบบัญชีผู้ใช้
                    </Button>
                    </Form.Item>
                  </div>
                </div>              
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default PsyDelAccount