import React, { useEffect, useState } from 'react';
import './login.css';
import thTH from 'antd/lib/locale/th_TH';
import { LoginPat } from '../../services/https/login';
import { LoginPayloadInterface } from '../../interfaces/login/ILogin';
import { Button, Form, Input, ConfigProvider,message,} from 'antd';
import { useNavigate } from 'react-router-dom';


function LoginPatient() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmitLogin = async(values: LoginPayloadInterface) => {
        let res = await LoginPat(values);
        if (res.status){
            messageApi.open({
                type: "success",
                content: "ยินดีต้อนรับ",
            });

            localStorage.setItem('token', res.message.token);
            localStorage.setItem('patientID', res.message.id);

            setTimeout(
                function(){
                    navigate("/Pat")
                },
                500
            );
        }else{
            messageApi.open({
                type: "error",
                content: res.message,
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
                    colorPrimary: '#9BA5F6',
                    colorText: '#585858',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                }
            }}
        >
            <div className='loginPatient'>
                <div className="login-container">
                    {contextHolder}
                    <div style={{position:'relative',marginTop:0}}><h1>เข้าสู่ระบบ</h1></div>
                    <Form 
                    onFinish={handleSubmitLogin}
                    style={{width:300}}>
                        <div style={{display:'flex',flexDirection:'column',}}>
                            <Form.Item
                            name="Email"
                            rules={[{required:true,message:'กรุณากรอกอีเมล!'},
                                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง!' },
                            ]}
                            > 
                                    <label>อีเมล</label>
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
                                    <div style={{display:'flex',justifyContent:'center'}}>ยังไม่มีบัญชีผู้ใช้?<a href='/reg/patient'><b>ลงทะเบียน</b></a></div>
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

export default LoginPatient;
