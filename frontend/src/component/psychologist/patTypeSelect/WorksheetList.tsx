import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Divider, Input, Select, Space } from 'antd';
import type { InputRef } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './PatTypeSelect.css';
import { FaFileLines } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import Cookies from 'js-cookie'; // นำเข้า js-cookie

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
  const [items, setItems] = useState(['ทั้งหมด', 'รพ.มทส', 'คลินิกวัยรุ่น','ไม่ระบุ']);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ทั้งหมด');
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const inputRef = useRef<InputRef>(null);
  const navigate = useNavigate();


  //======================== Select============
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `หมวดหมู่ ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  //=================================================

  //================Listed by Select=================
  const filteredPatients = selectedType === 'ทั้งหมด'
  ? patients.filter(patient => patient.isWorksheetPublic) // Show all patients with public worksheets
  : selectedType === 'ไม่ระบุ'
      ? patients.filter(patient => (patient.type === null || patient.type === '') && patient.isWorksheetPublic)
      : patients.filter(patient => patient.type === selectedType && patient.isWorksheetPublic);
  //=================================================

   // ฟังก์ชันที่ใช้เมื่อคลิกที่ปุ่ม FaFileLines
   const handleWorksheetClick = (patient: Patient) => {
    // ตั้งค่า cookie ด้วย id ของผู้ป่วย
    Cookies.set('patientId', patient.id.toString());
    // นำทางไปยังหน้าที่ต้องการ
    navigate('/PsyWorksheet/ShowWoeksheet'); // เปลี่ยนเส้นทางไปยังหน้าใหม่
  };

 
  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components:{},
        token:{
          colorPrimary: '#63C592',
          colorText:'#585858'
        }
      }}
    >
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
                    <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                        placeholder="กรุณาใส่หมวดหมู่ใหม่"
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        เพิ่มหมวดหมู่ {/*เขียนฟังก์ชันนี้ให้เพิ่มหมวดหมู่ลงตาราง หมวดหมู่ */}
                    </Button> 
                    </Space>
                </>
                )}
                options={items.map((item) => ({ label: item, value: item }))}
            />
          </div>
          <div style={{position:'relative',width:'100%',height:'88%',top:'2%',display:'flex',flexDirection:'column',gap:'5.5rem',overflowY:'auto'}}>
                {filteredPatients.map(patient => (
                    <li style={{listStyle:'none'}}>
                      <div className="PatientList-containner" key={patient.id} style={{position:'absolute',display:'flex',flexDirection:'row',alignItems:'center',width:'99%',height:'80px',background:'#ffffff',borderRadius:'15px'}}>
                        <img src={patient.profilePicture} alt={`${patient.firstName} ${patient.lastName}`} style={{ borderRadius: '10px', width: '50px', height: '50px', marginRight: '10px',marginLeft:'1%' }} />
                        <div>
                            <strong>{patient.firstName} {patient.lastName}</strong><br/>
                            <span style={{color:'#b0b0b0'}}>อายุ: {patient.age}&nbsp;&nbsp;&nbsp;อาการที่รักษา: {patient.symptoms}</span>
                        </div>
                        <Button 
                          icon={<FaFileLines/>} 
                          style={{color:'#63C592',fontSize:'24px',position:'absolute',left:'95%',width:'40px',height:'40px',alignItems:'center',justifyContent:'center',display:'flex',border:'none'}}
                          onClick={() => handleWorksheetClick(patient)}
                        />
                      </div>
                    </li>
                ))}
          </div>
        </div>
    </ConfigProvider>
  );
}

export default WorksheetsList;
