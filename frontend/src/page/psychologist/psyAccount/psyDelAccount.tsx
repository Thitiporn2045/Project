import { Button, ConfigProvider, Form, Input, message, Select } from 'antd'
import thTH from 'antd/lib/locale/th_TH';
import React, { useEffect, useState } from 'react'
import { PsychologistInterface } from '../../../interfaces/psychologist/IPsychologist';
import { GetPsychologistById, DeletePsychologistByID, CheckPasswordPsychologist } from '../../../services/https/psychologist/psy';
import { useNavigate } from 'react-router-dom';

const reasons = [
  { id: '1', label: 'ต้องการหยุดการให้บริการ' },
  { id: '2', label: 'พบปัญหาทางเทคนิค' },
  { id: '3', label: 'ไม่พอใจในบริการ' },
  { id: '4', label: 'เหตุผลอื่นๆ' }
];

function PsyDelAccount() {
  const [messageApi, contextHolder] = message.useMessage();

  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const psyID = localStorage.getItem('psychologistID') 

  const navigate = useNavigate();
  const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    const checkValues:PsychologistInterface = {
      ID: Number(psyID),
      Password: password
    }
    const isPasswordMatch = await CheckPasswordPsychologist(checkValues);
    
    if(!isPasswordMatch.status){
      messageApi.error(isPasswordMatch.message)
    }
    else{
      let res = await DeletePsychologistByID(Number(psyID));
      if (res.status) {
        messageApi.success("ลบบัญชีผู้ใช้แล้ว");
        setTimeout(() => {
          navigate("/"); 
        }, 3000);
      } 
      else {
        messageApi.error(res.message || "เกิดข้อผิดพลาด");
      }
    }
  }

  
  return (
    <ConfigProvider
      locale={thTH}
        theme={{
          components:{
            Message:{
            }
          },
          token:{
            colorPrimary: '#2C9F99',
            colorText:'#585858',
            fontFamily:'Noto Sans Thai, sans-serif'
          }
        }}>
        {contextHolder}
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',marginLeft:'6%'}}>
        <div style={{width:'40%',height:'70%',background:'transparent',display:'flex',flexDirection:'column'}}>
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