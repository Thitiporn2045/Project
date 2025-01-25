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
import { CiSearch } from 'react-icons/ci';


interface DataInterface {
  diaries: DiaryInterface[];
  patient: patientDiaryInterface;
}

function WorksheetsList() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);


  const [items, setItems] = useState<TypeOfPatientInterface[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');
  const [diaries,setDiaries] = useState<DataInterface[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<DataInterface[]>([]);


  const [form] = Form.useForm();
  const psyID = localStorage.getItem('psychologistID') 
//=========================================================================

const listDiaries = async () => {
  let res = await ListPublicDiariesByPatientType(Number(psyID));
  if(res){
    setDiaries(res);
    
  }
  setTimeout(() => {
    setLoading(false);
  },1000)

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
//====================Search and filter===================
useEffect(() => {
  // Fetch data and set pat array here, then run the filter
  filterPatients();
}, [searchTerm, selectedType, diaries.filter(pat => pat.patient)]);

  // ฟังก์ชันจัดการคำค้นหา
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  
    // เรียกใช้ filterPatients ทุกครั้งที่คำค้นหามีการเปลี่ยนแปลง
    if (value.trim().length > 1 || value === "") {
      filterPatients();
    }
  };

  // กรองข้อมูลผู้ป่วยตามหมวดหมู่ที่เลือกและคำค้นหา
  const filterPatients = () => {

    let filtered = diaries.filter((diary)=> diary.patient)

    if (selectedType !== 'ทั้งหมด'){
      filtered = filtered.filter(patient =>
        selectedType === 'ที่ยังไม่ระบุ'?
        (patient.patient.TypeID === null || patient.patient.TypeID === undefined || patient.patient.TypeID === 0)
        : patient.patient.TypeOfPatient === selectedType
      );
    }

    if (searchTerm.trim().length > 1) {
      filtered = filtered.filter(patient =>
        `${patient.patient.FirstName} ${patient.patient.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (searchTerm.length === 13 && patient.patient.IdNumber?.includes(searchTerm)));
    }

    setFilteredPatients(filtered);
  };
//==============================================================================
const navigate = useNavigate();
const navigateToDiaryPage = (diary:DiaryInterface) => {
  

  let routePath = '';
  switch (diary.WorksheetType) {
    case 'Activity Planning':
      routePath = '/PsyWorksheet/PsyCommentActivitiesPlanning';
      break;
    case 'Activity Diary':
      routePath = '/PsyWorksheet/PsyCommentActivitiesDiaries';
      break;
    case 'Behavioral Experiment':
      routePath = '/PsyWorksheet/PsyCommentBehavioralExperiment';
      break;
    case 'Cross Sectional':
      routePath = '/PsyWorksheet/PsyCommentCrossSectional';
      break;
    default:
      console.error('Unknown worksheet type');
      return;
  }

  localStorage.setItem('diaryID',String(diary.ID));
  localStorage.setItem('diaryType',diary.WorksheetType);

  navigate(`${routePath}`);
};

//===========================================================================
const [animatedIndexes, setAnimatedIndexes] = useState<number[]>([]);

useEffect(() => {
  diaries.forEach((_, index) => {
    setTimeout(() => {
      setAnimatedIndexes((prev) => [...prev, index]);
    }, (index + 1) * 100); // เพิ่ม delay ให้แสดงทีละรายการ
  });
}, [diaries]);
//===========================================================================
 // สร้าง refs แยกสำหรับแต่ละแถว
 const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

 const scrollLeft = (index: number) => {
   rowRefs.current[index]?.scrollBy({ left: -280, behavior: 'smooth' });
 };

 const scrollRight = (index: number) => {
   rowRefs.current[index]?.scrollBy({ left: 280, behavior: 'smooth' });
 };
//===========================================================================

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
      <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
         <div style={{position:'relative',width:'98%',height:'10%',display:'flex',alignItems:'center',flexShrink:0,justifyContent:'space-between'}}>
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
          {/* ฟิลด์ค้นหา */}
          <Input
            style={{ width: 300,}}
            placeholder="ค้นหาด้วยชื่อหรือเลขบัตรประชาชน"
            suffix={<CiSearch style={{ color: '#63C592', fontSize: '20px', fontWeight: 'bolder' }} />}
            value={searchTerm}
            onChange={handleSearch}
          />
         </div>
{/* ============================================================================================================================================= */}

        {loading? (
            <div style={{ width:'100%',height:'100%', color: '#b9b9b9',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center' }}>
              <div className="Psy-Loading-Data"></div>
              <div>กำลังโหลดข้อมูล...</div>
            </div>
          ):(diaries.length === 0 || filteredPatients.length === 0? (
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',}}>
              <div className="Psy-No-Data"></div>
              <div style={{color:'#b9b9b9'}}>ไม่มีข้อมูล...</div>
            </div>
            ):(<div style={{
            position:'relative', 
            width:'100%',
            display:'flex',
            flexDirection:'column',
            gap:'1rem',
            flexGrow:1,
            overflow:'auto',
            flexShrink: 0,
            scrollbarColor:'#e5e5e5 transparent',
            scrollbarWidth:'thin',
            // background:'green'
            }}
            >
            {filteredPatients.map((item,index) =>(
              <div 
                key={item.patient.ID}
                className={`pat-list-info ${
                  animatedIndexes.includes(index) ? 'animated' : ''
                }`}
                style={{ 
                  position:'relative',
                  width:'100%',
                  height:'55%',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  gap:'0.5rem',
                  flexShrink: 0,
                }}
              >
                <div className='diary-owner-name' 
                  style={{
                    position:'relative',
                    width:'100%',height:'10%',
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                  }}
                >
                  <b style={{fontSize:20,color:'#585858',marginLeft:'1rem'}}>{item.patient.FirstName} {item.patient.LastName} ({item.diaries.length})</b>
                  {item.diaries.length > 3 && (
                    <div className='Scrolling-btn' style={{display: 'flex',marginRight:'1rem',gap:'0.3rem'}}>
                      <Button shape='circle' onClick={() => scrollLeft(index)} style={{background:'transparent'}}>{`<<`}</Button>
                      <Button shape='circle' onClick={() => scrollRight(index)} style={{background:'transparent'}}>{`>>`}</Button>
                    </div>
                  )}
                </div>
                
                <div className='diary-row-container' 
                  ref={(el) => (rowRefs.current[index] = el)}
                  style={{
                    position:'relative', 
                    width:'96%',
                    height:'90%',
                    // paddingLeft:'1rem',
                    display:'flex',
                    flexDirection:'row',
                    alignItems:'center',
                    gap:'1.5rem', 
                    overflowX:'auto',
                    overflowY:'hidden',
                    scrollbarColor:'transparent transparent',
                    scrollbarWidth:'thin',
                    // background:'yellow'                   
                  }}
                >
                  {item.diaries.map((item2) => (
                    <div className='each-diary' onClick={() => navigateToDiaryPage(item2)} style={{position:'relative',width:'15%',minWidth:160,height:'100%',display:'flex',flexDirection:'column',flexShrink:0,cursor:'pointer',margin:'0.5rem'}}>
                      <div style={{
                        position:'relative',
                        width:'100%',height:'80%',minWidth:160,
                        display:'flex',
                        backgroundImage:`url(${item2.Picture})`,
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
                        flexShrink:0,
                        minWidth:160
                        }}
                      >
                        <b style={{fontSize:16,color:'#585858'}}>{item2.Name}</b>
                        <span style={{fontSize:14,color:'#c5c5c5'}}>{item2.WorksheetType}</span>
                      </div>
                    </div>)) 
                  }

                  {/* {item.diaries.length > 3 && (
                    <div style={{ position:'absolute',display: 'flex', justifyContent: 'space-between', width: '99%',zIndex:5 }}>
                      <Button onClick={scrollLeft} style={{ background: '#2C9F99', color: '#fff' }}>เลื่อนซ้าย</Button>
                      <Button onClick={scrollRight} style={{ background: '#2C9F99', color: '#fff' }}>เลื่อนขวา</Button>
                    </div>
                  )} */}
                </div> 
                
            
              </div>))
              
            }</div> 
          )
        )}
        
        

      </div>



    </ConfigProvider>
 )

}

export default WorksheetsList;
