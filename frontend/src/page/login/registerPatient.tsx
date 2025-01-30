import React, { useEffect, useState } from 'react';
import './login.css';
import thTH from 'antd/lib/locale/th_TH';
import { PatientInterface } from '../../interfaces/patient/IPatient';
import { GenderInterface } from '../../interfaces/patient/IGender';
import { CreatePatient,ListGender, ListPatients } from '../../services/https/patient';
import { Button, Form, Input, ConfigProvider, Steps, message, DatePicker, Select, Radio } from 'antd';
import TestCompo from '../../component/psychologist/testCompo';

function RegisterPatient() {
    const [messageApi, contextHolder] = message.useMessage();

    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState({});
    const [gender,setGender] = useState<GenderInterface[]>([]);
    const [pat,setPat] = useState<PatientInterface[]>([]);
    
    const [form] = Form.useForm();
//=========================================================================
const listPatients = async () => {
    let res = await ListPatients();
    if(res){
        setPat(res);
    }
}
//=========================================================================

    const [sliderValue, setSliderValue] = useState<number>();
    const handleSliderChange = (value: number) => {//รับค่าจากcomponent <TestCompo/> เพื่อเอาไปใช้ต่อ
        setSliderValue(value);
    };

//=========================================================================
    
    const { Step } = Steps;

    const checkEmailExists = (email: string) => {
        //มีตัวไหนเข้าเงื่อนไข ถ้ามี:True
        return pat.some((patient) => patient.Email === email);
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
//=========================================================================

    const listGender = async () =>{
        let res = await ListGender();
        if (res){
            setGender(res);
        }
    }
//=========================================================================

    const handleSubmitReg = async (values: any) => {
       // Combine the current step values with the accumulated form values
        const allValues = { ...formValues, ...values };

        const patientData: PatientInterface = {
            Firstname: allValues.FirstName,
            Lastname: allValues.LastName,
            Dob: allValues.Dob.format('DD-MM-YYYY'),
            GenderID: allValues.GenderID,
            Tel: allValues.Tel,
            Email: allValues.Email,
            Password: allValues.Password,
            IsTakeMedicine: allValues.IsTakeMedicine,
        };

        const res = await CreatePatient(patientData);
        if (res.status) {
            messageApi.success("ลงทะเบียนสำเร็จ!");
            setTimeout(() => {
                next(); 
            }, 3000); // Move to the success screen
        } else {
            messageApi.error(res.message || "การลงทะเบียนล้มเหลว");
        }

       console.log("Registration Values: ", allValues);
    };
//=========================================================================
    function isValidThaiIdCard(id: string) { //Thai ID Check
        if (id.length !== 13) return false;
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(id.charAt(i)) * (13 - i);
        }
        const checkDigit = (11 - (sum % 11)) % 10;
        return checkDigit === parseInt(id.charAt(12));
    }
//=========================================================================

    useEffect(() =>{
        listGender();
        listPatients();
    },[]);
//=========================================================================

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
            {contextHolder}
        <div className="registerPatient">
            <div className="register-container">
                <div style={{position:'relative',}}><h1 style={{marginTop:'0%'}}>ลงทะเบียน</h1></div>
                <div style={{position:'relative',width:'100%'}}> 
                    <Steps current={currentStep}>
                        <Step title="ข้อมูลส่วนตัว" />
                        <Step title="ข้อมูลการรับยา" />
                        <Step title="เบอร์โทรศัพท์และอีเมล"/>
                        <Step title="รหัสผ่าน" />
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
                                name="IdNumber"
                                label="เลขบัตรประชาชน"
                                rules={[
                                    { required: true, message: 'กรุณากรอกเลขบัตรประชาชน!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value || isValidThaiIdCard(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('เลขบัตรประชาชนไม่ถูกต้อง!'));
                                        }}
                                    ]}    
                            >
                                <Input maxLength={13}/>
                            </Form.Item>
                            <Form.Item
                                name="FirstName"
                                label="ชื่อ"
                                rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}
                            >
                                <Input/>
                                {/* <TestCompo onChange={handleSliderChange}/> */}
                            </Form.Item>
                            <Form.Item
                                name="LastName"
                                label="นามสกุล"
                                rules={[{ required: true, message: 'กรุณากรอกนามสกุล!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <div style={{display:'flex',flexDirection:'row',gap:'1rem'}}>
                                <Form.Item
                                    name="Dob"
                                    label="วัน/เดือน/ปี เกิด"
                                    rules={[{ required: true, message: 'กรุณาเลือกวัน/เดือน/ปี เกิด!' }]}
                                >
                                    <DatePicker style={{width:184}}/>
                                </Form.Item>
                                <Form.Item name="GenderID" label="เพศ" rules={[{required: true,message: "กรุณาระบุเพศ !"}]}>
                                    <Select placeholder='เพศ' style={{width:100}} allowClear>
                                        {gender.map((item) => (<option value={item.ID} key={item.Gender}>{item.Gender}</option>))} 
                                    </Select>
                                </Form.Item>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>มีบัญชีผู้ใช้แล้ว?<a href='/login/patient'><b>เข้าสู่ระบบ</b></a></div>   
                        </div>
                        
                    )}
                     {currentStep == 1 &&(
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <Form.Item
                                name="IsTakeMedicine"
                                label="คุณอยู่ในระหว่างรับยารักษาจากจิตแพทย์หรือไม่?"
                                rules={[{ required: true, message: 'กรุณาเลือกข้อมูล' }]}
                            >
                                <Radio.Group>
                                    <Radio value="อยู่ในระหว่างรับยา">อยู่ในระหว่างรับยา</Radio>
                                    <Radio value="ไม่ได้รับยา">ไม่ได้รับยา</Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            <Form.Item>
                                <div style={{ background: '#f6f6f6', padding: '10px', borderRadius: '8px', color: '#c0c0c0' }}>
                                    <b>ทำไมเราถึงถามข้อมูลนี้?</b><br/>
                                    ข้อมูลเกี่ยวกับการรับยาจะช่วยให้นักจิตวิทยาเข้าใจแนวทางการรักษาของคุณได้ดียิ่งขึ้น  
                                    เพื่อให้สามารถแนะนำแนวทางการบำบัดที่เหมาะสม ควบคู่ไปกับการใช้ยาได้อย่างมีประสิทธิภาพ
                                </div>
                            </Form.Item>
                        </div> //รับยา
                    )}
                    {currentStep === 2 && (
                        <div>
                            <Form.Item
                                name="Email"
                                label="อีเมล"
                                rules={[{ required: true, message: 'กรุณากรอกอีเมล!', type: 'email' }]}
                            >
                                <Input  />
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
                        
                        </div>
                    )}

                    {currentStep == 3 &&(
                        <div>
                            <Form.Item
                                name="Password"
                                label="รหัสผ่าน"
                                rules={[
                                    { required: true, message: 'กรุณากรอกรหัสผ่าน!' },
                                    {
                                        min: 8,
                                        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
                                    },
                                ]}
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
                  
                    {currentStep == 4 &&(
                        <div style={{width:'100%',display:'flex',justifyContent:'center'}}><h2>ลงทะเบียนสำเร็จแล้ว!<b/><a href='/login/patient'>เข้าสู่ระบบ</a></h2></div>
                    )}
                    
                    <div className="steps-action" style={{display:'flex',flexDirection:'row',justifyContent:'center',gap:'2rem',marginTop:'1rem'}}>
                    
                        {currentStep > 0 && currentStep != 4 && (
                            <Button onClick={prev}>
                                ย้อนกลับ
                            </Button>
                        )} {currentStep < 3 && (
                            <div>
                            <Button type="primary" onClick={next}>
                                ถัดไป
                            </Button>
                            </div>
                        )}
                        {currentStep === 3 && (
                            
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

export default RegisterPatient;