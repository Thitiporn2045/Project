import React, { useEffect, useState } from 'react';
import { TypeOfPatientInterface } from '../../../interfaces/psychologist/ITypeOfPatient';
import { CreateTypeOfPatient, ListTypeOfPatient,ListConnectedPatientByType } from '../../../services/https/psychologist/typeOfPatient';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Divider, Input, Modal, Select, Space,Form, message } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import { LuUserMinus2 } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";
import userEmpty from '../../../assets/userEmty.png';
import './PatTypeSelect.css';
import { PatientInterface } from '../../../interfaces/patient/IPatient';
import { calculateAge } from '../../../page/calculateAge';
import { UpdatePatient } from '../../../services/https/patient';
import AddPat from '../addPatient/AddPat';
import { DisconnectPatient } from '../../../services/https/connectionRequest';


function PatTypeSelect() {
  const [messageApi, contextHolder] = message.useMessage();

  const [items, setItems] = useState<TypeOfPatientInterface[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ทั้งหมด');
  const [pat,setPat] = useState<PatientInterface[]>([]);
  
  const [form] = Form.useForm();


  const [selectedPatient, setSelectedPatient] = useState<PatientInterface>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [originalSymptoms, setOriginalSymptoms] = useState<string | undefined>(''); //Original เอาไว้ทำ disable ปุ่มบันทึก เทียบกับค่า edited
  const [originalType, setOriginalType] = useState<number | undefined>();

  const [editedSymptoms, setEditedSymptoms] = useState<string | undefined>('');
  const [editedType, setEditedType] = useState<number | undefined>(); //เก็บไอดีจากSelect

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  
  const psyID = localStorage.getItem('psychologistID') 
//=========================================================================
const listPatients = async () => {
  let res = await ListConnectedPatientByType(Number(psyID));
  if(res){
    setPat(res);
  }
}
//=========================================================================
  const listTypeOfPatient = async () => {
    let res = await ListTypeOfPatient(Number(psyID));
    if(res){
      setItems(res);
    }
  }
  useEffect(() => {
    listTypeOfPatient();
    listPatients();
    
  }, []);
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
    ? pat 
    : selectedType === 'ที่ยังไม่ระบุ'
        ? pat.filter(pat => (pat.TypeID === null || pat.TypeOfPatient?.Name === null))
        : pat.filter(pat => pat.TypeOfPatient?.Name === selectedType);
  //=================================================

  //======================Modal User Info============
  const filteredItems = items.filter(item => item.Name !== 'ทั้งหมด' && item.Name !== 'ที่ยังไม่ระบุ'); //ไม่เอาไปแสดงใน select ของModal
  const showEditModal = (patients: PatientInterface) => {
    setSelectedPatient(patients);

    setOriginalSymptoms(patients.Symtoms);
    setEditedSymptoms(patients.Symtoms);

    if(patients.TypeOfPatient?.ID === 0){ //ถ้าไม่ทำ if ที่ Select มันจะขึ้นเลข 0 สำหรับคนที่ยังไม่มี Type
      setOriginalType(undefined);
      setEditedType(undefined);
    }
    else{
      setOriginalType(patients.TypeID);
      setEditedType(patients.TypeID);
    }
  
    setIsModalVisible(true);
  };
  
  //บันทึกข้อมูลที่ถูกแก้ไข symtoms and type
  const handleUpdateOk = async(patID: number) => {
    
    const updatePatient = pat.find((pat) => pat.ID === patID)
    const data: PatientInterface = {
      ...updatePatient,
      Symtoms: editedSymptoms,
      TypeID: editedType,

    }

    let res = await UpdatePatient(data);
    if(res.status){
      messageApi.success("แก้ไขข้อมูลสำเร็จ");
      listPatients();
    }
    else{
      messageApi.error(res.message);
    }
    
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };  
  
  // Function เปิดปิดปุ่มบันทึกการแก้ไข
  useEffect(() => {
    const isChanged = editedSymptoms !== originalSymptoms || editedType !== originalType;
    setIsSaveDisabled(!isChanged);
  }, [editedSymptoms, editedType, originalSymptoms, originalType]);
  //=================================================

  //============Modal Delete=========================
  const showDeleteModal = (patient: PatientInterface) => {
    setSelectedPatient(patient);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async (patID: number) => {

   let res = await DisconnectPatient(Number(patID),Number(psyID));
   if (res.status) {
      const updatePatient = pat.find((pat) => pat.ID === patID)
      const data: PatientInterface = {
        ...updatePatient,
        Symtoms: undefined,
        TypeID: undefined,
      }
      await UpdatePatient(data);

      messageApi.success("ลบผู้ป่วยออกจากรายการแล้ว!");
      setIsDeleteModalVisible(false);
      
    } else {
      messageApi.error(res.message);
      setIsDeleteModalVisible(false);
    }
    listPatients();
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };
  //=================================================
  return (
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
            <div><AddPat/></div>
          </div>

          <div style={{
            position:'relative', 
            width:'100%',
            marginTop:'0.5rem',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            gap:'1rem',
            flexGrow:1,
            overflow:'auto',
            flexShrink: 0,
            scrollbarColor:'#c5c5c5 transparent',
            scrollbarWidth:'thin',
            }}
          >              
         {filteredPatients.map(pat =>(
                
                <div style={{
                  position:'relative',
                  height:'15%',
                  maxHeight:'80px',
                  width:'97%',
                  display:'flex',
                  flexDirection:'row', 
                  justifyContent:'space-between',
                  flexShrink:0,
                  flexWrap:'wrap',
                  background:'white',
                  borderRadius:'10px',
                  boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.03)',
                  
                }}
                >
                  <div style={{position:'relative',height:'100%',width:'50%',display:'flex', flexDirection:'row', alignItems:'center',gap:'1rem',marginLeft:'1rem',flexShrink:0,}}>
                  {pat.Picture && (pat.Picture !== "") && (pat.Picture !== undefined)?(
                      <div 
                      style={{
                        position:'relative',
                        display:'flex',
                        flexShrink:0,
                        width:'60px',
                        height:'80%',
                        borderRadius:'50%',
                        backgroundImage:`url(${pat.Picture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                    </div>
                    ) : (
                      <div 
                        style={{
                          position:'relative',
                          display:'flex',
                          flexShrink:0,
                          width:'65px',
                          height:'80%',
                          borderRadius:'50%',
                          backgroundImage:`url(${userEmpty})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                      </div>
                    )}
                    <div style={{display:'flex', flexDirection:'column'}}>
                      <div>{pat.Firstname} {pat.Lastname}</div>
                      <div style={{color:'#868686'}}>อายุ: {calculateAge(String(pat.Dob))}ปี &nbsp; อาการที่รักษา: {(pat.Symtoms === "") || (pat.Symtoms === null)? `ไม่ระบุ`:(pat.Symtoms)}</div>
                    </div>

                  </div>

                  <div style={{position:'relative',display:'flex', flexDirection:'row', alignItems:'center',gap:'1rem',right:'1rem'}}>
                    <Button 
                      icon={<FiEdit3/>} 
                      style={{color:'#2C9F99',fontSize:'24px',width:'40px',height:'40px',alignItems:'center',justifyContent:'center',display:'flex',border:'none'}}
                      onClick={()=>showEditModal(pat)}/>
                    
                    <Button 
                    icon={<LuUserMinus2/>} 
                    style={{color:'#EE5D6A',fontSize:'24px',width:'40px',height:'40px',alignItems:'center',justifyContent:'center',display:'flex',border:'none'}}
                    onClick={()=>showDeleteModal(pat)}/>
                    
                  </div>
                </div>
                
              ))} 
            </div>

            {selectedPatient && (
              <Modal 
              open={isModalVisible} 
              onOk={()=>handleUpdateOk(Number(selectedPatient.ID))} 
              onCancel={handleCancel} 
              okButtonProps={{ disabled: isSaveDisabled }} 
              okText="บันทึก"
              width={700}
              >
                <div style={{display:'flex',flexDirection:'row',gap:'2rem',paddingBottom:'1rem',paddingTop:'1rem'}}>
                
                  <div style={{width:220,height:220,borderRadius:'50%',marginTop:'0.5rem'}}>
                    {selectedPatient.Picture && (selectedPatient.Picture !== "") && (selectedPatient.Picture !== undefined)?(  
                      <img 
                        src={selectedPatient.Picture}
                        style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
                      ) : (
                      <img 
                        src={userEmpty}
                        style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
                    )}
                  </div>

                  <div style={{ width: '60%', display: 'flex', flexDirection: 'column',}}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '20%', borderBottom: 'solid 2px',borderColor:'#63C592' }}>
                      <b style={{ fontSize: '24px' }}>{selectedPatient.Firstname} {selectedPatient.Lastname}</b>
                    </div>
                    <div style={{ display: 'flex',gap:'5.5rem',marginTop:'1rem'}}>
                      <b>เพศ</b> <span style={{color:'#868686'}}>{selectedPatient.Gender?.Gender}</span>
                    </div>
                    <div style={{ display: 'flex',gap:'5.5rem'}}>
                      <b>อายุ</b> <span style={{color:'#868686'}}>{calculateAge(String(selectedPatient.Dob))} ปี</span>
                    </div>
                    <div style={{ display: 'flex',gap:'4.5rem'}}>
                      <b>วันเกิด</b> <span style={{color:'#868686'}}>{selectedPatient.Dob}</span>
                    </div>
                    <div style={{ display: 'flex',gap:'2rem'}}>
                      <b>เบอร์โทรศัพท์</b> <span style={{color:'#868686'}}>{selectedPatient.Tel}</span>
                    </div>
                    <div style={{ display: 'flex',gap:'5rem'}}>
                      <b>อีเมล</b> <span style={{color:'#868686'}}>{selectedPatient.Email}</span>
                    </div>
                    <div style={{ display: 'flex',gap:'2rem',marginTop:'1rem'}}>
                      <b>อาการที่รักษา</b>
                      <Input 
                        value={editedSymptoms} 
                        onChange={(e) => setEditedSymptoms(e.target.value)} 
                        style={{ width: 150 }} 
                      />
                    </div>
                    <div style={{ display: 'flex',gap:'3.6rem',marginTop:'1rem'}}>
                      <b>หมวดหมู่</b>
                      <Select 
                        value={editedType} 
                        onChange={(value) => setEditedType(value)} 
                        style={{ width: 150 }}>
                        {filteredItems.map((item, index) => (
                          <Select.Option key={index} value={item.ID}>
                            {item.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>


                </div>

                
              </Modal>

            )}
            {selectedPatient && (
              <Modal
                title="ยืนยันการลบ"
                open={isDeleteModalVisible}
                onOk={() => handleDeleteOk(Number(selectedPatient?.ID))}
                onCancel={handleDeleteCancel}
                okText="ยืนยัน"
                okType='danger'
                cancelText="ยกเลิก"
              >
                <p>คุณต้องการลบผู้ป่วย <b>{selectedPatient?.Firstname} {selectedPatient?.Lastname}</b> หรือไม่?</p>
              </Modal>
            )}
        </div>
    </ConfigProvider>
  );
}


export default PatTypeSelect;
