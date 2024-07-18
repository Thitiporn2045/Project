import React,{useEffect,useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import type { DatePickerProps } from 'antd';
import { Input, Select, DatePicker, Form, Button, message } from 'antd';
import './login.css';

const userLogin ={
    "email":"test1@gmail.com",
    "password":"12345678Sp"
}
const genders={
    "genders": [
      {
        "id": 1,
        "label": "ชาย"
      },
      {
        "id": 2,
        "label": "หญิง"
      },
      {
        "id":3,
        "label":"LGBTQ+"
      },
      {
        "id": 4,
        "label": "ไม่ระบุ"
      }
    ]
  }

  const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');
  
  
  registerBtn?.addEventListener('click' ,()=>{
      container?.classList.add("active");
  });

  loginBtn?.addEventListener('click',()=>{
      container?.classList.remove("active");
  });


export default function Login(){
    const [gender, setGender] = useState("");
    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const onFinish = (values: any) => {
        console.log('Received values:', values);
    };

    const onLoginFinish = (values: any) =>{
        console.log('login values:', values);
        if(values.email === userLogin.email && values.password === userLogin.password){
            message.success('ยินดีต้อนรับ');
        }
        else{
            message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    }

    return(
        <div className="bg-reg">
        {/* <div className="logo-reg"></div> */}
        <div className="container" id="container">
            
            <div className="form-container register">               
                <div className="header-text-reg"><h1>สร้างบัญชีผู้ใช้</h1></div>
                <Form  wrapperCol={{ span: 24 }}  className="form-register" onFinish={onFinish}>
                    
                    <Form.Item className="firstName-reg" name="firstName" style={{width:'100%'}} rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif",}} id="firstName" type="text" placeholder="ชื่อ"/></Form.Item>
                    <Form.Item className="lastName-reg" name="lastname" style={{width:'100%'}} rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} id="lastName" type="text" placeholder="นามสกุล"/></Form.Item>
                    <Form.Item className="date-reg" name="dob" style={{width:'75%'}} rules={[{ required: true, message: 'กรุณากรอกวันเกิด' }]}><DatePicker style={{width:'100%'}} onChange={onChange} placeholder={"วว/ดด/ปปปป เกิด"}/></Form.Item>
                    <Form.Item className="gender-reg" name="gender" rules={[{ required: true, message: 'กรุณาใส่เพศ' }]} >
                        <Select allowClear placeholder='เพศ'>
                            {genders.genders.map((item) => (
                            <option value={item.id} key={item.id}>{item.label}</option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item className="tel-reg" name="phone" style={{width:'100%'}} rules={[{ required: true, message: 'กรุณาใส่เบอร์โทรศัพท์' },{ pattern: /^0\d{9}$/, message: 'กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง' }]}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="tel" id="phone"  placeholder="เบอร์โทรศัพท์"/></Form.Item>
                    <Form.Item className="email-reg" name="email" style={{width:'100%'}} rules={[{ required: true, message: 'กรุณากรอกอีเมล' },{ type: 'email', message: 'กรุณากรอกอีเมลให้ถูกต้อง' }]}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="email" id="email" placeholder="อีเมล"/></Form.Item>
                    <Form.Item className="password-reg" style={{width:'100%'}}
                         name="password"
                         rules={[
                             { required: true, message: 'กรุณากรอกรหัสผ่าน' },
                             { min: 8, message: 'รหัสผ่านอย่างน้อย 8 ตัวอักษร' },
                             { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: 'รหัสผ่านต้องประกอบด้วย ตัวเลข, ตัวอักษรพิมพ์เล็ก และตัวอักษรพิมพ์ใหญ่' }
                         ]}>
                            <Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="password" id="password" placeholder="รหัสผ่าน"/>
                    </Form.Item>
                    <Form.Item className="confirm-password-reg" style={{width:'100%'}}
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                                },
                            }),
                        ]}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="password" id="password" placeholder="ยืนยันรหัสผ่าน"/>
                     </Form.Item>
                    <Form.Item className="btn-reg"><Button type="primary" htmlType="submit" style={{width:150,height:40}}>สร้างบัญชีผู้ใช้</Button></Form.Item>
                </Form>
            </div>
            <div className="form-container login">
                <Form className="form-login" onFinish={onLoginFinish}>
                    <h1 className="header-text-login">เข้าสู่ระบบ</h1>
                    <Form.Item className="email-login" name="email" style={{width:'80%'}}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="email" id="email" placeholder="อีเมล"/></Form.Item>
                    <Form.Item className="password-login" name="password" style={{width:'80%'}}><Input  style={{fontFamily:"'Noto Sans Thai',sans-serif"}} type="password" id="password" placeholder="ยืนยันรหัสผ่าน"/></Form.Item>
                    <Form.Item className="btn-login"><Button type="primary" htmlType="submit">เข้าสู่ระบบ</Button></Form.Item>
                </Form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>ยินดีต้อนรับเข้าสู่</h1>
                            <h1>CBT Buddies</h1>
                            <p>มีบัญชีผู้ใช้งานแล้ว?</p>
                            <button className="hidden" id="login">เข้าสู่ระบบ</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>ยินดีต้อนรับเข้าสู่</h1>
                            <h1>CBT Buddies</h1>
                            <p>ยังไม่มีบัญชีผู้ใช้งาน?</p>
                            <button className="hidden" id="register">สร้างบัญชีผู้ใช้</button>
                        </div>
                    </div>
                </div>
        </div>
        </div>
    );


}