import { Button, ConfigProvider, Form, Input } from 'antd'
import thTH from 'antd/lib/locale/th_TH';
import React, { useEffect, useState } from 'react'

const initialPsychologist = {
  firstname:'ศุภชลิตา',
  lastname:'พลนงค์',
  tel:'0812345678',
  email:'note.psy@gmail.com',
  password:'note1234',
  profilepic:'https://via.placeholder.com/150?text=Psy'
}

function PsyProfile() {
  const [psychologist, setPsychologist] = useState(initialPsychologist);
  const [isChanged, setIsChanged] = useState(false); // สถานะสำหรับปุ่มบันทึก

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      firstname: psychologist.firstname,
      lastname: psychologist.lastname,
      tel: psychologist.tel,
      email: psychologist.email,
    });
  }, [psychologist, form]);



  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const base64String = e.target.result as string;
          setPsychologist({ ...psychologist, profilepic: base64String });
          setIsChanged(true); // เปลี่ยนสถานะเมื่อมีการเปลี่ยนแปลงรูป          
          console.log('Base64:', base64String); // ทำการ console.log ที่นี่หลังจากแปลงเป็น Base64
        }
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
    }
  };

  useEffect(() => {
    // ตรวจสอบเมื่อ profilepic ถูกอัปเดต
    console.log('Updated profilepic:', psychologist.profilepic);
  }, [psychologist.profilepic]);

  const handleInputChange = (field: string, value: string) => {
    setPsychologist({ ...psychologist, [field]: value });
    setIsChanged(true); // เปลี่ยนสถานะเมื่อมีการเปลี่ยนแปลงข้อมูลในอินพุต
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อส่งฟอร์ม
    console.log('Form values:', psychologist);
    // ดำเนินการส่งข้อมูลหรืออื่น ๆ ตามต้องการ
  };

  const validateMessages = {
    types: {
      email: '${label} is not a valid email!',
    },
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
      }}
    >
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',marginLeft:'6%'}}>
        <div style={{width:'45%',height:'70%',background:'transparent',display:'flex',flexDirection:'column'}}>
          <Form 
            form={form}
            onFinish={handleSubmit}
            validateMessages={validateMessages}
          >
            <div className='profile-pic-container' style={{position:'relative',width:'100%',height:'40%',display:'flex',flexDirection:'column'}}>
              <span style={{fontSize:'20px',fontWeight:'bold'}}>รูปโปรไฟล์</span>
              <Form.Item>
              <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'1rem',marginTop:'2%'}}>
                <div><img src={psychologist.profilepic} alt='อิอิ' style={{width:'100px',height:'100px',borderRadius:'50%'}}></img></div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profilePicInput"
                  onChange={handleProfilePicChange}
                />
                
                <Button type='primary' onClick={() => document.getElementById('profilePicInput')?.click()}>เปลี่ยนรูปโปรไฟล์</Button>
                <Button danger>ลบรูปโปรไฟล์</Button>
              </div>
              </Form.Item>
            </div>
            <div className="personal-info-container" style={{position:'relative',width:'100%',height:'40%',display:'flex',flexDirection:'column',marginTop:'1rem'}}>
              <span style={{fontSize:'20px',fontWeight:'bold'}}>ข้อมูลส่วนตัว</span>
              <div style={{display:'flex',flexDirection:'row',gap:'1.5rem'}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                  ชื่อ
                  <Form.Item
                    name={'firstname'}
                    rules={[{ required: true, message: 'กรุณากรอกชื่อ !' }]}
                  >
                  <Input 
                    style={{width:240}}
                    onChange={(e) =>
                    handleInputChange('firstname', e.target.value)}
                  />
                  </Form.Item>
                </div> 

                <div style={{display:'flex',flexDirection:'column'}}>
                  นามสกุล
                  <Form.Item 
                    name={'lastname'}
                    rules={[{ required: true, message: 'กรุณากรอกนามสกุล !'}]}
                  >
                    <Input 
                      style={{width:240}}
                      value={psychologist.lastname}
                      onChange={(e) =>
                      handleInputChange('lastname', e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'row',gap:'1.5rem'}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                  เบอร์โทรศัพท์
                  <Form.Item 
                    name={'tel'}
                    rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์ !'}]}
                  >
                    <Input 
                      style={{width:240}}
                      value={psychologist.tel}
                      onChange={(e) => 
                      handleInputChange('tel', e.target.value)}
                    />
                  </Form.Item>
                </div> 

                <div style={{display:'flex',flexDirection:'column'}}>
                  อีเมล
                  <Form.Item 
                    name={'email'}
                    rules={[
                      {
                        type: "email",
                        message: "รูปแบบอีเมลไม่ถูกต้อง !",
                      },
                      {
                        required: true,
                        message: "กรุณากรอกอีเมล !",
                      },
                    ]}
                  >
                    <Input 
                      style={{width:240}}
                      value={psychologist.email}
                      onChange={(e) => 
                      handleInputChange('email', e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'end'}}>
                <Form.Item>
                  <Button 
                    type='primary' 
                    disabled={!isChanged}
                    htmlType='submit'
                  >
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                </Form.Item>
              </div>

            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default PsyProfile