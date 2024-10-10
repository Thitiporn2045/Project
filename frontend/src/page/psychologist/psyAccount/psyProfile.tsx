import { Button, ConfigProvider, Form, Input, message } from 'antd'
import thTH from 'antd/lib/locale/th_TH';
import React, { useEffect, useState } from 'react'
import { PsychologistInterface } from '../../../interfaces/psychologist/IPsychologist';
import { GetPsychologistById, UpdatePsychologist } from '../../../services/https/psychologist/psy';


function PsyProfile() {
  const [messageApi, contextHolder] = message.useMessage();

  const [psychologist, setPsychologist] = useState<PsychologistInterface>();
  const [isChanged, setIsChanged] = useState(false); // สถานะสำหรับปุ่มบันทึก
  const psyID = localStorage.getItem('psychologistID') 
  
  const [form] = Form.useForm();

  const getPsychologist = async () => {
    let res = await GetPsychologistById(Number(psyID));
    if(res){
      setPsychologist(res);

      form.setFieldsValue({
        firstname: res.FirstName,
        lastname: res.LastName,
        tel: res.Tel,
        email: res.Email,
        picture: res.Picture
      });
    }
  }
 




  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const base64String = e.target.result as string;
          setPsychologist({ ...psychologist, Picture: base64String });
          setIsChanged(true); // เปลี่ยนสถานะเมื่อมีการเปลี่ยนแปลงรูป          
        }
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
    }
  };

  useEffect(() => {
    getPsychologist();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setPsychologist({ ...psychologist, [field]: value });
    setIsChanged(true); // เปลี่ยนสถานะเมื่อมีการเปลี่ยนแปลงข้อมูลในอินพุต
  };

  const handleSubmit = async(allValues: PsychologistInterface) => {
    allValues.ID = psychologist?.ID;
    allValues.Picture = psychologist?.Picture;
    allValues.IsApproved = psychologist?.IsApproved;
    allValues.Password = psychologist?.Password;
    allValues.WorkingNumber = psychologist?.WorkingNumber;
    allValues.CertificateFile = psychologist?.CertificateFile;
    let res = await UpdatePsychologist(allValues);
    if (res.status) {
      messageApi.open({
        type: "success",
        content: "แก้ไขข้อมูลสำเร็จ",
      });
      setTimeout(() => {
        window.location.reload(); 
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }

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
      {contextHolder}
      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',marginLeft:'6%'}}>
      
        <div style={{width:'45%',height:'70%',background:'transparent',display:'flex',flexDirection:'column'}}>
          <Form 
            form={form}
            onFinish={handleSubmit}
            validateMessages={validateMessages}
          >
            <div className='profile-pic-container' style={{position:'relative',width:'100%',height:'40%',display:'flex',flexDirection:'column'}}>
              <span style={{fontSize:'20px',fontWeight:'bold'}}>รูปโปรไฟล์</span>
              <Form.Item name={'picture'}>
              <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'1rem',marginTop:'2%'}}>
                <div><img src={psychologist?.Picture} style={{width:'100px',height:'100px',borderRadius:'50%'}}></img></div>
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
                    value={psychologist?.FirstName}
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
                      value={psychologist?.LastName}
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
                      value={psychologist?.Tel}
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
                      value={psychologist?.Email}
                      onChange={(e) => 
                      handleInputChange('email', e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{width:504, display:'flex',justifyContent:'end',}}>
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