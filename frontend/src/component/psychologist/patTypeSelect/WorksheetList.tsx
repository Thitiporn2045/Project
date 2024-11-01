import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Divider, Form, Input, message, Select, Space } from 'antd';
import type { InputRef } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './PatTypeSelect.css';
import { FaFileLines } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import Cookies from 'js-cookie'; // นำเข้า js-cookie
import { TypeOfPatientInterface } from '../../../interfaces/psychologist/ITypeOfPatient';
import { DiaryInterface } from '../../../interfaces/diary/IDiary';
import { CreateTypeOfPatient, ListTypeOfPatient } from '../../../services/https/psychologist/typeOfPatient';
import { ListPublicDiariesByPatientType } from '../../../services/https/diary';

interface Patient{
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  age: number;
  phone: string;
  email: string;
  symptoms: string;
  type: string;
  profilePicture: string;
  connectionStatus: string;
  isWorksheetPublic: boolean;

}

const patients: Patient[] = [
  {
    "id": 1,
    "firstName": "สมใจ",
    "lastName": "ยิ้มแย้ม",
    "birthdate": "1985-05-12",
    "age": 39,
    "phone": "0812345678",
    "email": "somchai.s@example.com",
    "symptoms": "Depression",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Somchai",
    "connectionStatus": "connected",
    "isWorksheetPublic": true,

  },
  {
    "id": 2,
    "firstName": "สมใจ",
    "lastName": "ชีวเจริญ",
    "birthdate": "1990-03-22",
    "age": 34,
    "phone": "0897654321",
    "email": "somsak.p@example.com",
    "symptoms": "Anxiety",
    "type": "คลินิกวัยรุ่น",
    "profilePicture": "https://via.placeholder.com/150?text=Somsak",
    "connectionStatus": "not_connected",
    "isWorksheetPublic": true,

  },
{
    "id": 3,
    "firstName": "สมใจ",
    "lastName": "ยอดรักยิ่ง",
    "birthdate": "1978-08-15",
    "age": 46,
    "phone": "0876543210",
    "email": "sompong.j@example.com",
    "symptoms": "PTSD",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Sompong",
    "connectionStatus": "pending",
    "isWorksheetPublic": false,

  },
  {
    "id": 4,
    "firstName": "สมพงษ์",
    "lastName": "รักไทย",
    "birthdate": "1995-01-30",
    "age": 29,
    "phone": "0865432109",
    "email": "sureeporn.w@example.com",
    "symptoms": "Bipolar Disorder",
    "type": "คลินิกวัยรุ่น",
    "profilePicture": "https://via.placeholder.com/150?text=Sureeporn",
    "connectionStatus": "pending",
    "isWorksheetPublic": true,

  },
{
    "id": 5,
    "firstName": "ศรราม",
    "lastName": "น้ำใจ",
    "birthdate": "1988-11-05",
    "age": 35,
    "phone": "0854321098",
    "email": "siriwan.k@example.com",
    "symptoms": "OCD",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Siriwan",
    "connectionStatus": "pending",
    "isWorksheetPublic": false,

  },
{
    "id": 6,
    "firstName": "อนุชา",
    "lastName": "งามเจริญ",
    "birthdate": "1983-07-21",
    "age": 41,
    "phone": "0843210987",
    "email": "sakchai.i@example.com",
    "symptoms": "Schizophrenia",
    "type": "",
    "profilePicture": "https://via.placeholder.com/150?text=Sakchai",
    "connectionStatus": "connected",
    "isWorksheetPublic": true,

  },
  {
    "id": 7,
    "firstName": "สุมาลี",
    "lastName": "ทองใส",
    "birthdate": "1992-12-10",
    "age": 31,
    "phone": "0832109876",
    "email": "sumalee.t@example.com",
    "symptoms": "Panic Disorder",
    "type": "",
    "profilePicture": "https://via.placeholder.com/150?text=Sumalee",
    "connectionStatus": "pending",
    "isWorksheetPublic": true,

  }
]


let index = 0;

function WorksheetsList() {
  const [messageApi, contextHolder] = message.useMessage();

  const [items, setItems] = useState<TypeOfPatientInterface[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ทั้งหมด');
  const [diaries,setDiaries] = useState<DiaryInterface[]>([]);

  const [form] = Form.useForm();
  const psyID = localStorage.getItem('psychologistID') 
//=========================================================================

const listDiaries = async () => {
  let res = await ListPublicDiariesByPatientType(Number(psyID));
  if(res){
    setDiaries(res);
  }
}
//=========================================================================
const listTypeOfPatient = async () => {
  let res = await ListTypeOfPatient(Number(psyID));
  if(res){
    setItems(res);
  }
}

useEffect(()=>{
  listDiaries();
  listTypeOfPatient();

},[  console.log('diaries data',diaries)
])
//======================== Select หมวดหมู่ ============
const handleAddType = async(values: TypeOfPatientInterface) => {
  values.PsyID = Number(psyID);
  let res = await CreateTypeOfPatient(values);
  if(res.status){
    messageApi.success("เพิ่มหมวดหมู่สำเร็จ!")
    form.resetFields();
    setTimeout(() => {
      listTypeOfPatient();
    },0)
  }
  else{
    messageApi.error(res.status);
  }
 
}
//=================================================
 //================Listed by Select=================
 const filteredPatients = selectedType === 'ทั้งหมด' 
 ? diaries 
 : selectedType === 'ที่ยังไม่ระบุ'
     ? diaries.filter(diaries => (diaries.Patient?.TypeID === null))
     : diaries.filter(diaries => diaries.Patient?.TypeOfPatient?.Name === selectedType);
//=================================================
 return(
  <ConfigProvider
      locale={thTH}
      theme={{
        components:{},
        token:{
          colorPrimary: '#63C592',
          colorText:'#585858',
          fontFamily:'Noto Sans Thai, sans-serif'
        }
      }}
    >
      {contextHolder}
      <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column'}}>
        <div style={{position:'relative',width:'100%',height:'10%',top:'2%',display:'flex',alignItems:'center'}}>
          <Select
            style={{ width: 300 }}
            placeholder="แสดงตามหมวดหมู่"
            value={selectedType}
            onChange={setSelectedType}
            dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 0 ',}}>
                <Form
                  form={form}
                  onFinish={handleAddType}
                  style={{padding:0,height:40}}
                >
                  <div style={{display:'flex', flexDirection:'row', gap:'0.5rem'}}>
                    <Form.Item
                      name={'Name'}
                    >
                      <Input
                        placeholder="กรุณากรอกหมวดหมู่ใหม่"
                      />
                    </Form.Item>
                    <Form.Item
                    >
                      <Button type="text" htmlType='submit' icon={<PlusOutlined />} style={{color:'#63C592'}}>
                          เพิ่ม {/*เพิ่มหมวดหมู่ลงตาราง */}
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </Space>
            </>
            )}
            options={items.map((item) => ({ label: item.Name, value: item.Name }))}
          />
        </div>

        <div style={{height:'96%',width:'100%',display:'flex' , flexDirection:'column',gap:'0.5rem',marginTop:'1rem',overflow:'auto'}}>
          
        </div>

      </div>



    </ConfigProvider>
 )

}

export default WorksheetsList;
