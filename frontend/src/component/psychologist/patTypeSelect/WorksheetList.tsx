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
import { DiaryInterface, patientDiaryInterface } from '../../../interfaces/diary/IDiary';
import { CreateTypeOfPatient, ListTypeOfPatient } from '../../../services/https/psychologist/typeOfPatient';
import { ListPublicDiariesByPatientType } from '../../../services/https/diary';
import { PatientInterface } from '../../../interfaces/patient/IPatient';


interface DataInterface {
  diaries: DiaryInterface[];
  patient: patientDiaryInterface;
}

function WorksheetsList() {
  const [messageApi, contextHolder] = message.useMessage();

  const [items, setItems] = useState<TypeOfPatientInterface[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ทั้งหมด');
  const [diaries,setDiaries] = useState<DataInterface[]>([]);

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

},[])
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
     ? diaries.filter(diaries => (diaries.patient.TypeOfPatient === null))
     : diaries.filter(diaries => diaries.patient.TypeOfPatient === selectedType);
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
          {filteredPatients.map((item) =>(
            <div>
              <li>
                <p>{item.patient.FirstName}</p>
                {item.diaries.map((item2) => (
                  <div>{item2.Name}</div> 
                ))}
              </li>
            </div>
          ))}
        </div>

      </div>



    </ConfigProvider>
 )

}

export default WorksheetsList;
