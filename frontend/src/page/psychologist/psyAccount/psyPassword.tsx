import { Button, ConfigProvider, Form, Input, message} from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import React, { useEffect, useState } from 'react';
import { PsychologistInterface } from '../../../interfaces/psychologist/IPsychologist';
import { GetPsychologistById,UpdatePsychologist,CheckPassword } from '../../../services/https/psychologist/psy';

function PsyPassword() {
  const [psychologist, setPsychologist] = useState<PsychologistInterface>();
  const psyID = localStorage.getItem('psychologistID') 
  const [form] = Form.useForm();

  const getPsychologist = async () =>{
    let res = await GetPsychologistById(Number(psyID));
    if(res){
      setPsychologist(res);
    }
    console.log(psychologist?.Password)
  }
  useEffect(() => {
    getPsychologist();
  }, []);
  const handleSubmit = async ({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) => {
    const checkValues:PsychologistInterface = {
      ID: Number(psyID),
      Password: oldPassword
    }
    const isPasswordMatch = await CheckPassword(checkValues);
    if(!isPasswordMatch.status){
      message.error(isPasswordMatch.message)
    }
    else{
      const updatedPsychologist: PsychologistInterface = { ...psychologist, Password: newPassword };      
      let res = await UpdatePsychologist(updatedPsychologist);
      if (res.status) {
        message.success("เปลี่ยนรหัสผ่านสำเร็จ");
        setTimeout(() => {
          window.location.reload(); 
        }, 2000);
      } else {
        message.error(res.message || "เกิดข้อผิดพลาด");
      }
    }

  };

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Input: {},
        },
        token: {
          colorPrimary: '#63C592',
          colorText: '#585858',
          fontFamily: 'Noto Sans Thai, sans-serif',
        },
      }}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', marginLeft: '6%' }}>
        <div style={{ width: '40%', height: '70%', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
          <Form form={form} onFinish={handleSubmit}>
            <div
              className="passwordSetting-container"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ตั้งค่ารหัสผ่านใหม่</span>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  รหัสผ่านเดิม
                  <Form.Item
                    name="oldPassword"
                    rules={[
                      { required: true, message: 'กรุณากรอกรหัสผ่านเดิม' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  รหัสผ่านใหม่
                  <Form.Item
                    name="newPassword"
                    rules={[
                      { required: true, message: 'กรุณากรอกรหัสผ่านใหม่' },
                      {
                        min: 8,
                        message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  ยืนยันรหัสผ่านใหม่
                  <Form.Item
                    name="confirmNewPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, 
                        message: 'กรุณายืนยันรหัสผ่านใหม่' 
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('รหัสผ่านใหม่ไม่ตรงกัน'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                      บันทึก
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default PsyPassword;
