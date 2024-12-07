import React, { useEffect, useState } from 'react'
import { PatientInterface } from '../interfaces/patient/IPatient';
import { ListPatients } from '../services/https/patient';
import { Avatar, Badge, Button, Input, List, message } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { AcceptConnectionRequest, CancelConnectionRequest, GetConnectionRequestById, ListConnectionPatientById, RejectConnectionRequest, SendConnectionRequest } from '../services/https/connectionRequest';
import { ConnectionRequestInterface } from '../interfaces/connectionRequest/IConnectionRequest';
import { BellOutlined } from '@ant-design/icons';


function Connection() {
    const [messageApi, contextHolder] = message.useMessage();

    const [pat,setPat] = useState<PatientInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState(''); //Psy
    const [filteredPatients, setFilteredPatients] = useState<PatientInterface[]>(pat); //Psy
    const [connection, setConnection] = useState<ConnectionRequestInterface[]>([]); //Psy
    const [patConnection, setPatConnection] = useState<ConnectionRequestInterface[]>([]); //Pat
    const [countNoti, setCountNoti] = useState(0); //pat
    const psyID = 1;
    const patID = 1;
    const listPatients = async () => {//psy
        let res = await ListPatients();
        if(res){
            setPat(res);
        }
    }
//=======================================================================
    const getConnectionrequest = async () =>{//psy
        let res = await GetConnectionRequestById(Number(psyID));
        if(res){
            setConnection(res);
        }
    }

    const sendConnectionRequest = async(patID: number) => {//psy
        const conn: ConnectionRequestInterface = {
            PatID: patID,
            PsyID: Number(psyID),
            Status: 'pending'
        }

        const res = await SendConnectionRequest(conn);
        if(res.status){
            messageApi.success("ส่งคำขอแล้ว");
            getConnectionrequest();
            listPatientConnection();
            // setConnection(prevConnections => [...prevConnections, conn]);
        }
        else{
            messageApi.error(res.message);
        }
    }

    const cancelConnectionRequest = async (conID: number) => {//psy
        const updateConnection = connection.find((con) => con.ID === conID)

        const cancelConnection = {
            ...updateConnection,
            Status: 'not_connect'
        }

        const res = await CancelConnectionRequest(cancelConnection);
        if(res.status){
            messageApi.success("ยกเลิกคำขอแล้ว")
            getConnectionrequest();
            listPatientConnection();
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


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {//psy
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = pat.filter(pat =>
          `${pat.Firstname} ${pat.Lastname}`.toLowerCase().includes(value)
        );
        setFilteredPatients(filtered);
      };
//=======================================================================
const listPatientConnection = async () =>{ //pat
    let res = await ListConnectionPatientById(Number(patID));
    if(res){
        setPatConnection(res);
        
    }
    setCountNoti(res.length);
}

const acceptConnectionRequest = async (conID: number) =>{ //pat
    const updateConnection = patConnection.find((con) => con.ID === conID)
    const acceptConnection = {
        ...updateConnection,
        Status: 'connected'
    }

    const res = await AcceptConnectionRequest(acceptConnection);
    if(res.status){
        messageApi.success("ยอมรับคำขอแล้ว")
        // setTimeout(()=> {         <==========================เส้นผมบังภูเขาไอควายเอ้ย เล่นท่ายากเพื่อ!!!
        //     setPatConnection(prevConnections => 
        //         prevConnections.map(con => 
        //             con.ID === conID ? acceptConnection : con
        //         )
        //     );
            
        // },1500)
        listPatientConnection();
        getConnectionrequest();
        setCountNoti(countNoti-1);    
    } 
    else{
        messageApi.error(res.message);
    }

}

const rejectConnectionRequest = async (conID: number) =>{ //pat
    const updateConnection = patConnection.find((con) => con.ID === conID)
    const rejectConnection = {
        ...updateConnection,
        Status: 'not_connect'
    }

    const res = await RejectConnectionRequest(rejectConnection);
    if(res.status){
        messageApi.success("ปฏิเสธคำขอแล้ว")
        // setTimeout(()=> {
        //     setPatConnection(prevConnections => 
        //         prevConnections.map(con => 
        //             con.ID === conID ? rejectConnection : con
        //         )
        //     );
            
        // },1500)
        listPatientConnection();
        getConnectionrequest();
        setCountNoti(countNoti-1);
    } 
    else{
        messageApi.error(res.message);
    }

}

//=======================================================================
    useEffect(() =>{
        listPatients();//psy
        getConnectionrequest();//psy
        listPatientConnection();//pat
    },[]);

  return (
    
    <div className='connection-container' style={{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'row'}}>
        {contextHolder}
        {/*Pat================================= */}
        <div className="connection-patient" style={{position:'relative',width:'50%',height:'99.5%',border:'solid 0.1px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'2rem'}}>
                <h1>Patient</h1>
                <Badge count={countNoti} overflowCount={99} style={{ backgroundColor: '#f5222d' }}>
                    <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                </Badge>
            </div>
            
            <div className='request-list' style={{position:'relative',width:'50%',height:'70%',border:'solid'}}> {/*แสดงลิสต์คำขอจากนักจิตวิทยา */}
                <div style={{ position: 'relative', maxHeight: '400px', overflowY: 'auto',}}>

                    <List
                    className='Add-Patient-List'
                    style={{width:'100%',display:'flex',flexDirection:'column',gap:'1rem'}}
                    itemLayout="horizontal"
                    dataSource={patConnection} 
                    locale={{ emptyText: patConnection ? 'ยังไม่มีแจ้งเตือน':null}} 
                    renderItem={item => ( 
                        item.Status === 'pending' ? (
                            <div style={{ width: '100%', minHeight: '70px', maxHeight: '70px', display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'none', justifyContent: 'space-between' }}>
                                <List.Item.Meta
                                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}
                                    avatar={<Avatar src={item.Psychologist?.Picture} style={{ borderRadius: '10px', width: '50px', height: '50px' }} />}
                                    title={`${item.Psychologist?.FirstName} ${item.Psychologist?.LastName}`}
                                />
                                <div>
                                    <Button onClick={() => acceptConnectionRequest(Number(item.ID))}>ยอมรับ</Button> 
                                    <Button onClick={() => rejectConnectionRequest(Number(item.ID))}>ปฎิเสธ</Button>
                                </div>
                            </div>
                        ) : null
                    )}
                    />  
                </div>
            </div>

        </div>

        {/*===================================================================================================================================================================== */}
         {/*Psy================================= */}
        <div className="connection-psychologist" style={{position:'relative',width:'50%',height:'99.5%',border:'solid 0.01px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h1>Psychologist</h1>
            <div className='send-request' style={{position:'relative',width:'50%',height:'70%',border:'solid'}}>
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
            </div>
          
        </div>  
    </div>
  )
}

export default Connection