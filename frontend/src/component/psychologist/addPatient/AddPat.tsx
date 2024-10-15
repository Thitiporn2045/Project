import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, ConfigProvider, Input, List, message, Modal } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import { CiSearch } from "react-icons/ci";
import './AddPat.css';
import { PatientInterface } from '../../../interfaces/patient/IPatient';
import { ConnectionRequestInterface } from '../../../interfaces/connectionRequest/IConnectionRequest';
import { CancelConnectionRequest, GetConnectionRequestById, SendConnectionRequest } from '../../../services/https/connectionRequest';
import { ListPatients } from '../../../services/https/patient';



function AddPat() {
  const [messageApi, contextHolder] = message.useMessage();

  const [pat,setPat] = useState<PatientInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<PatientInterface[]>(pat);
  const [connection, setConnection] = useState<ConnectionRequestInterface[]>([]); //Psy
  const psyID = localStorage.getItem('psychologistID');

  const listPatients = async () => {
    let res = await ListPatients();
    if(res){
        setPat(res);
    }
}
//=======================================================================

const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {//psy
  const value = event.target.value.toLowerCase();
  setSearchTerm(value);
  const filtered = pat.filter(pat =>
    `${pat.Firstname} ${pat.Lastname}`.toLowerCase().includes(value)
  );
  setFilteredPatients(filtered);
};

//=======================================================================
  const getConnectionrequest = async () =>{//psy
    let res = await GetConnectionRequestById(Number(psyID));
    if(res){
        setConnection(res);
    }
  }
//=======================================================================

  const sendConnectionRequest = async(patID: number) => {
    const conn: ConnectionRequestInterface = {
      PatID: patID,
      PsyID: Number(psyID),
      Status: 'pending'
  }

  const res = await SendConnectionRequest(conn);
  if(res.status){
      messageApi.success("ส่งคำขอแล้ว");
      getConnectionrequest();
      // setConnection(prevConnections => [...prevConnections, conn]);
  }
  else{
      messageApi.error(res.message);
  }
  };
//=======================================================================

  const cancelConnectionRequest = async(conID: number) => {
    const updateConnection = connection.find((con) => con.ID === conID)

    const cancelConnection = {
        ...updateConnection,
        Status: 'not_connect'
    }

    const res = await CancelConnectionRequest(cancelConnection);
    if(res.status){
        messageApi.success("ยกเลิกคำขอแล้ว")
        getConnectionrequest();
        // setConnection(prevConnections => 
        //     prevConnections.map(con => 
        //         con.ID === conID ? cancelConnection : con
        //     )
        // );
    } 
    else{
        messageApi.error(res.message);
    }
   
}
//=======================================================================

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() =>{
    listPatients();
    getConnectionrequest();
},[]);

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Button: {},
          List:{}
        },
        token: {
          colorPrimary: '#63C592',
          colorText: '#585858',
          fontFamily:'Noto Sans Thai, sans-serif'
        },
      }}
    >
      {contextHolder}
      <div className='Add-patient'>
        <Button type="primary" onClick={showModal}>
          <b style={{ fontSize: 20 }}>+</b>เพิ่มผู้ป่วยใหม่
        </Button>
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Input
            placeholder="ค้นหา"
            suffix={<CiSearch style={{ color: '#63C592', fontSize: '20px', fontWeight: 'bolder' }} />}
            value={searchTerm}
            onChange={handleSearch}
            variant="filled"
            style={{ marginBottom: '16px', marginTop: '25px', position: 'relative' }}
          />
          <div style={{ position: 'relative', maxHeight: '400px', overflowY: 'auto',}}>

          <List
                    className='Add-Patient-List'
                    style={{width:'100%',display:'flex',flexDirection:'column',gap:'1rem'}}
                    itemLayout="horizontal"
                    dataSource={searchTerm ? filteredPatients : []} //แสดงข้อมูลตามที่พิมพ์ ไม่โชว์ทั้งหมด
                    locale={{ emptyText: searchTerm ? 'ไม่พบผู้ป่วยที่คุณค้นหา' : 'กรุณาพิมพ์คำค้นหาเพื่อแสดงผลลัพธ์' }} // เปลี่ยนข้อความเมื่อไม่มีข้อมูล
                    renderItem={item =>{
                        const patientConnection = connection.find(conn => conn.PatID === item.ID); // Check connection for this patient
                        return(
                        <div style={{width:'100%',minHeight:'70px',maxHeight:'70px',display:'flex',flexDirection:'row',alignItems:'center',border:'none',justifyContent:'space-between'}}>
                            <List.Item.Meta
                                style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'0.5rem'}}
                                avatar={<Avatar src={item.Picture} style={{ borderRadius: '10px', width: '50px', height: '50px' }} />}
                                title={`${item.Firstname} ${item.Lastname}`}
                            />
                            {patientConnection?.Status === 'pending' ? 
                                (
                                    <Button className='cancel-btn' type="primary" onClick={() =>cancelConnectionRequest(Number(patientConnection.ID))} style={{minWidth: '120px'}}>ยกเลิกคำขอ</Button>
                                ) : patientConnection?.Status === 'connected' ?
                                (
                                    <Button disabled className='connected-btn' type="primary" style={{minWidth: '120px'}}>ผู้ป่วยของคุณ</Button>
                                ) :
                                (
                                    <Button className='send-btn' type="primary" onClick={() =>sendConnectionRequest(Number(item.ID))} style={{minWidth: '120px'}}>+ ส่งคำขอ</Button> 
                                )
                            }
                           
                        </div>
                    )}}    
                    />  

          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default AddPat;
