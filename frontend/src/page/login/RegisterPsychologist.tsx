import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import './login.css';
import thTH from 'antd/lib/locale/th_TH';
import { PsychologistInterface } from '../../interfaces/psychologist/IPsychologist';
import { CreatePsychologist,ListPsychologists } from '../../services/https/psychologist/psy';
import { Button, Form, Input, ConfigProvider, Steps, message} from 'antd';



function RegisterPsychologist() {
  const [messageApi, contextHolder] = message.useMessage();

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [psy,setPsy] = useState<PsychologistInterface[]>([]);


  const [form] = Form.useForm();
//===============================================================================
const listPsychologist = async () => {
    let res = await ListPsychologists();
    if(res){
        setPsy(res);
    }
}
//===============================================================================
  const { Step } = Steps;

  const checkEmailExists = (email: string) => {
    //มีตัวไหนเข้าเงื่อนไข ถ้ามี:True
    return psy.some((psychologist) => psychologist.Email === email);
  };
  const next = () => {
      form.validateFields()
          .then(values => {
            if (currentStep === 1) {
                const email = values.Email;

                // ตรวจสอบว่าอีเมลมีอยู่ในระบบแล้วหรือไม่
                if (checkEmailExists(email)) {
                  messageApi.error("ไม่สามารถใช้อีเมลดังกล่าวได้");
                  return; 
                }
              }
              // Save form values from the current step
              setFormValues(prev => ({ ...prev, ...values }));
              setCurrentStep(currentStep + 1);
          })
          .catch(() => {
              messageApi.error("กรุณากรอกข้อมูลให้ครบถ้วน");
          }
      );
  };

  const prev = () => {
      setCurrentStep(currentStep - 1);
  };


  const navigate = useNavigate();
  const backHome = () =>{
    navigate("/");
  }
//===============================================================================
  const [fileUrl, setFileUrl] = useState<string>("");  // สร้าง URL สำหรับดูไฟล์

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];  // ตรวจสอบว่าไฟล์มีอยู่
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') { // ตรวจสอบว่า result เป็น string
          const base64String = reader.result.split(',')[1]; // เอาเฉพาะส่วน Base64
          // สร้าง URL สำหรับดูไฟล์ PDF
          setFileUrl(reader.result);        }
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
    }
  };
//===============================================================================
const handleSubmitReg = async (values: any) => {
    const allValues = { ...formValues, ...values };

    const psychologistData: PsychologistInterface ={
        FirstName: allValues.FirstName,
        LastName: allValues.LastName,
        Tel: allValues.Tel,
        Email: allValues.Email,
        Password: allValues.Password,
        WorkingNumber: allValues.WorkingNumber,
        CertificateFile: fileUrl,
        IsApproved: false,
        WorkPlace: allValues.WorkPlace,
    }

    const res = await CreatePsychologist(psychologistData);
    if (res.status) {
        messageApi.success("ลงทะเบียนสำเร็จ!");
        setTimeout(() => {
            next(); 
        }, 3000); // Move to the success screen
    } else {
        messageApi.error(res.message || "การลงทะเบียนล้มเหลว");
    }

}
//===============================================================================
useEffect(() =>{
    listPsychologist();
},[]);
//===============================================================================


return(
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
{contextHolder}
<div className="registerPsychologist">
  <div className="register-container">
      <div style={{position:'relative',}}><h1 style={{marginTop:'0%'}}>ลงทะเบียน</h1></div>
      <div style={{position:'relative',width:'100%'}}> 
          <Steps current={currentStep}>
              <Step title="ข้อมูลส่วนตัว" />
              <Step title="อีเมลและรหัสผ่าน"/>
              <Step title="ยืนยันตัวตน" />
              <Step title="สำเร็จ"/>
          </Steps>
      </div>
      <Form
          form={form}
          onFinish={handleSubmitReg}
          layout="vertical"
          style={{width:300,marginTop:'3%'}}
      >
          {currentStep === 0 && (
              <div>
                  <Form.Item
                      name="FirstName"
                      label="ชื่อ"
                      rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}
                  >
                      <Input/>
                  </Form.Item>
                  <Form.Item
                      name="LastName"
                      label="นามสกุล"
                      rules={[{ required: true, message: 'กรุณากรอกนามสกุล!' }]}
                  >
                      <Input />
                  </Form.Item>
                  <Form.Item 
                      name="Tel"
                      label="เบอร์โทรศัพท์"
                      rules=
                      {[{required: true, message:'กรุณากรอกเบอร์โทรศัพท์!'},
                      {min: 10,max: 10, message:'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'}]}
                  >
                      <Input/>
                  </Form.Item>

                  <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>มีบัญชีผู้ใช้แล้ว?<a href='/login/psychologist'><b>เข้าสู่ระบบ</b></a></div>   
              </div>
              
          )}
          {currentStep === 1 && (
              <div>
                  <Form.Item
                      name="Email"
                      label="อีเมล"
                      rules={[{ required: true, message: 'กรุณากรอกอีเมล!', type: 'email' }]}
                  >
                      <Input  />
                  </Form.Item>
                  <Form.Item
                      name="Password"
                      label="รหัสผ่าน"
                      rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                  >
                      <Input.Password />
                  </Form.Item>
                  <Form.Item
                      name="confirmPassword"
                      label="ยืนยันรหัสผ่าน"
                      dependencies={['Password']}
                      rules={[
                          { required: true, message: 'กรุณายืนยันรหัสผ่าน!' },
                          ({ getFieldValue }) => ({
                              validator(_, value) {
                                  if (!value || getFieldValue('Password') === value) {
                                      return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                              },
                          }),
                      ]}
                  >
                      <Input.Password />
                  </Form.Item>
              
              </div>
          )}

          {currentStep == 2 &&(
              <div style={{display:'flex',gap:'2rem',flexDirection:'column'}}>
                <div style={{position:'relative',width:'130%',right:'55px',padding:'10px',textAlign:'center',color:'#BEBEBE',background:'#F5F5F5',borderRadius:'5px'}}>
                    คุณต้องเป็นจิตแพทย์หรือนักจิตวิทยาที่มีใบอนุญาตหรือได้รับการรับรอง และยินยอมให้ทางเราตรวจสอบประวัติของคุณ
                </div>
                <div>
                <Form.Item
                  name="WorkPlace"
                  label="สถานที่ทำงาน"
                  rules={[{ required: true, message: 'กรุณากรอกสถานที่ทำงาน!' }]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="WorkingNumber"
                  label="เลขที่ใบรับรองการทำงาน"
                  rules={[{ required: true, message: 'กรุณากรอกเลขที่ใบรับรองการทำงาน!' }]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="Certificate"
                  label="อัปโหลดใบรับรอง (ไฟล์ pdf, png, jpeg)"
                  rules={[{ required: true, message: 'กรุณาอัปโหลดใบรับรอง!' }]}
                  >
                  <input type="file" accept="application/pdf, image/*" onChange={handleFileChange} />
                </Form.Item>
                </div>
              </div>
          )}

          {currentStep == 3 &&(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{position:'relative',width:'200%',display:'flex',justifyContent:'center',textAlign:'center'}}>
                    <h2>
                        ขณะนี้ทางเราได้รับข้อมูลของคุณแล้ว<br/>กรุณารอการตรวจสอบข้อมูลและอนุมัติภายใน 2-3 วันทำการ<b/>
                    </h2>
                    
                </div>
                    <div><Button type='primary' onClick={backHome} style={{position:'relative',width:150,top:20}}>กลับสู่หน้าแรก</Button></div>
            </div>
          )}
          
          <div className="steps-action" style={{display:'flex',flexDirection:'row',justifyContent:'center',gap:'2rem',marginTop:'1rem'}}>
          
              {currentStep > 0 && currentStep != 3 && (
                  <Button onClick={prev}>
                      ย้อนกลับ
                  </Button>
              )} {currentStep < 2 && (
                  <div>
                  <Button type="primary" onClick={next}>
                      ถัดไป
                  </Button>
                  </div>
              )}
              {currentStep === 2 && (
                  
                  <Button type="primary" htmlType="submit">
                      ลงทะเบียน
                  </Button>
                  
              )}
          </div>
      </Form>                   
  </div>
</div>  
</ConfigProvider>
)

}

export default RegisterPsychologist