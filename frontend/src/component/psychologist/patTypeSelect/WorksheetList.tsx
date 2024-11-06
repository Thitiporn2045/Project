import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Divider, Form, Input, message, Select, Space } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './PatTypeSelect.css';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import Cookies from 'js-cookie'; // นำเข้า js-cookie
import { TypeOfPatientInterface } from '../../../interfaces/psychologist/ITypeOfPatient';
import { DiaryInterface, patientDiaryInterface } from '../../../interfaces/diary/IDiary';
import { CreateTypeOfPatient, ListTypeOfPatient } from '../../../services/https/psychologist/typeOfPatient';
import { ListPublicDiariesByPatientType } from '../../../services/https/diary';
import cover from '../../../assets/book cover/cover3.jpg'


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
//=================================================
const navigate = useNavigate();
const navigateToDiaryPage = (diary:DiaryInterface) => {
  

  let routePath = '';
  switch (diary.WorksheetType) {
    case 'Activity Planning':
      routePath = '/Planning';
      break;
    case 'Activity Diary':
      routePath = '/Activity';
      break;
    case 'Behavioral Experiment':
      routePath = '/Behavioural';
      break;
    case 'Cross Sectional':
      routePath = '/CrossSectional';
      break;
    default:
      console.error('Unknown worksheet type');
      return;
  }

  // Navigate to the desired route with the diary ID as a parameter
  navigate(`${routePath}?id=${diary.ID}`);
};
 return(
  <ConfigProvider
      locale={thTH}
      theme={{
        components:{},
        token:{
          colorPrimary: '#2C9F99',
          colorText:'#585858',
          fontFamily:'Noto Sans Thai, sans-serif'
        }
      }}
    >
      {contextHolder}
      <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',}}>
         <div style={{position:'relative',width:'100%',height:'10%',display:'flex',alignItems:'center',flexShrink:0,justifyContent:'space-between'}}>
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
                      <Button type="text" htmlType='submit' icon={<PlusOutlined />} style={{color:'#2C9F99'}}>
                          เพิ่ม 
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
{/* ============================================================================================================================================= */}
        <div style={{
          position:'relative', 
          width:'100%',
          display:'flex',
          flexDirection:'column',
          gap:'1rem',
          flexGrow:1,
          overflow:'auto',
          flexShrink: 0,
          scrollbarColor:'#c5c5c5 transparent',
          scrollbarWidth:'thin',
          }}
        >
          {filteredPatients.map((item) =>(
            <div className='diary-container' 
              style={{ 
                position:'relative',
                width:'100%',
                height:'55%',
                display:'flex',
                flexDirection:'column',
                gap:'0.5rem',
                flexShrink: 0,
              }}
            >
              <div className='diary-owner-name' 
                style={{
                  position:'relative',
                  width:'98%',height:'10%',
                  display:'flex',
                  flexDirection:'row',
                  alignItems:'center',
                  marginLeft:'1rem', 

                }}
              >
                <b style={{fontSize:20,color:'#585858'}}>{item.patient.FirstName} {item.patient.LastName}</b>
              </div>
              
              <div className='diary-row-container' 
                style={{
                  position:'relative', 
                  width:'98%',
                  height:'90%',
                  display:'flex',
                  flexDirection:'row',
                  alignItems:'center',
                  marginLeft:'1rem', 
                  
                }}
              >
                {item.diaries.map((item2) => (
                  <div className='each-diary' onClick={() => navigateToDiaryPage(item2)} style={{position:'relative',width:'15%',height:'100%',display:'flex',flexDirection:'column',flexShrink:0, marginLeft:'1rem', marginRight:'1rem'}}>
                    <div style={{
                      position:'relative',
                      width:'100%',height:'80%',
                      display:'flex',
                      backgroundImage:`url(${cover})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius:'5px 15px 15px 5px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                      flexShrink:0,
                      }}
                    >
                    </div>
                    <div style={{
                      position:'relative',
                      width:'100%',height:'20%',
                      display:'flex',
                      justifyContent:'center',
                      flexDirection:'column',
                      flexShrink:0
                      }}
                    >
                      <b style={{fontSize:16,color:'#585858'}}>{item2.Name}</b>
                      <span style={{fontSize:14,color:'#c5c5c5'}}>{item2.WorksheetType}</span>
                    </div>
                  </div> 
                ))}

              </div>
              
              
            </div>
            ))
          } 
        </div>

      </div>



    </ConfigProvider>
 )

}

export default WorksheetsList;
