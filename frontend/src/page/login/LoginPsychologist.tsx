import React, { useEffect, useState } from 'react';
import './login.css';
import thTH from 'antd/lib/locale/th_TH';
import { LoginPsy } from '../../services/https/login';
import { LoginPayloadInterface } from '../../interfaces/login/ILogin';
import { Button, Form, Input, ConfigProvider,message,} from 'antd';
import { useNavigate } from 'react-router-dom';


function LoginPsychologist() {
  const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmitLogin = async(values: LoginPayloadInterface) => {
        let res = await LoginPsy(values);
        if (res.status){
            messageApi.open({
                type: "success",
                content: "ยินดีต้อนรับ",
                duration: 2
            });

            localStorage.setItem('token', res.message.token);
            localStorage.setItem('psychologistID', res.message.id);

            setTimeout(
                function(){
                    navigate("/PsyHomePage")
                },
                2000
            );
        }else{
            messageApi.open({
                type: "error",
                content: res.message,
                duration: 4
            });
        }
    }

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
                }
            }}
        >
            <div className='loginPsychologist'>
                <div className="login-container">
                    {contextHolder}
                    <div style={{position:'relative',marginTop:0}}><h1>เข้าสู่ระบบ</h1></div>
                    <Form 
                    onFinish={handleSubmitLogin}
                    style={{width:300}}>
                        <div style={{display:'flex',flexDirection:'column',}}>
                            <label>อีเมล</label>
                            <Form.Item
                            name="Email"
                            rules={[{required:true,message:'กรุณากรอกอีเมล!'},
                                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง!' },
                            ]}
                            > 
                                <Input/>
                            </Form.Item>
                            
                            <label>รหัสผ่าน</label>
                            <Form.Item
                            name="Password"
                            rules={[{required:true,message:'กรุณากรอกรหัสผ่าน!'}]}
                            >
                                <div>
                                    <Input type='password'/>
                                </div> 
                           </Form.Item>                            
                            
                            <div style={{display:'flex',justifyContent:'center',marginTop:'1rem',flexDirection:'column',gap:'0.5rem'}}>
                                    <div style={{display:'flex',justifyContent:'center'}}>ยังไม่มีบัญชีผู้ใช้?<a href='/reg/psychologist'><b>ลงทะเบียน</b></a></div>
                                    <Button 
                                        type='primary'
                                        htmlType='submit'
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default LoginPsychologist