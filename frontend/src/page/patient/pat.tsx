import React, { useEffect, useState } from 'react'
import NavbarPat from '../../component/navbarPat/navbarPat'
import NotePat from '../../component/notePat/notePat';
import './stylePat.css'
import thTH from 'antd/lib/locale/th_TH';
import { FaBell } from "react-icons/fa";
import { GetPatientById } from '../../services/https/patient';
import { PatientInterface } from '../../interfaces/patient/IPatient';
import { ConnectionRequestInterface } from '../../interfaces/connectionRequest/IConnectionRequest';
import { AcceptConnectionRequest, GetConnectionPatientById, ListConnectionPatientById, RejectConnectionRequest } from '../../services/https/connectionRequest';
import { Avatar, Badge, Button, ConfigProvider, List, message } from 'antd';
import { CreateNotePat, GetNotesByPatientID } from '../../services/https/notePat/notePat';
import BookPat from '../../component/bookPat/bookPat';

function Pat() {
    const [messageApi, contextHolder] = message.useMessage();
    const patID = localStorage.getItem('patientID') 
    const numericPatID = patID ? Number(patID) : undefined; // แปลงเป็น number หรือ undefined ถ้าไม่มีค่า
    const [patient, setPatient] = useState<PatientInterface>();
    const [connectedPsy, setConnectedPsy] = useState<ConnectionRequestInterface>();
    const [patConnection, setPatConnection] = useState<ConnectionRequestInterface[]>([]); //Pat
    const [countNoti, setCountNoti] = useState(0); //pat

const getPatientById = async () => {
    let res = await GetPatientById(Number(patID));
    if(res){
        setPatient(res);
    }
}

useEffect(() => {
    getPatientById();
    getConnectionRequest();
    listPatientConnection();//pat
}, [
    // console.log(connectedPsy)
]);

//==================================================================
const formatDateString = (dateString: string) => {
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const [day, month, year] = dateString.split('-');
    return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
};
//==================================================================
const getConnectionRequest = async () => {
    let res = await GetConnectionPatientById(Number(patID));
        if (res) {
            setConnectedPsy(res);
    }
};
//==================================================================
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
        listPatientConnection();
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
        listPatientConnection();
        setCountNoti(countNoti-1);
    } 
    else{
        messageApi.error(res.message);
    }

}

//=======================================================================
const [noteTitle, setNoteTitle] = useState('');
const [noteContent, setNoteContent] = useState('');

//Note
function addNotePat() {
    const blur = document.getElementById('blur') as HTMLElement;
    blur.classList.toggle('active');

    const popup = document.getElementById('popupNote') as HTMLElement;
    popup.classList.toggle('active');
}
//==================================================================
const handleSaveNote = async () => {
    const existingNotes = await GetNotesByPatientID(Number(patID));
    if (existingNotes.length >= 4) {
        message.error("ไม่สามารถเพิ่มโน้ตได้เกิน 4 รายการ");
        return; // Exit if there are already four notes
    }
    const noteData = {
        Title: noteTitle,
        Content: noteContent,
        PatID: Number(patID),  // assuming patientID is stored in localStorage
    };
    const res = await CreateNotePat(noteData);
    if (res.status) {
        message.success("โน้ตถูกสร้างแล้ว");
        window.location.reload();
        setNoteTitle('');  
        setNoteContent('');  
        addNotePat(); 
    } else {
        message.error("เกิดข้อผิดพลาดในการสร้างโน้ต");
    }
};
//==================================================================
const handleClose = () => {
    addNotePat();
};
//==================================================================

//popup
function toggle() {
    const blur = document.getElementById('blur') as HTMLElement;
    blur.classList.toggle('active');

    const popup = document.getElementById('popup') as HTMLElement;
    popup.classList.toggle('active');
}
//==================================================================


    return (
    <ConfigProvider
    locale={thTH}
    theme={{
        token: {
        colorPrimary: '#9BA5F6', // Example of primary color customization
        fontFamily:'Noto Sans Thai, sans-serif'
        },
    }}
    >
        <div className='Pat'>
            {contextHolder}
            <div id='blur'>
                <div className="befor-main">
                    <div className='main-body'>
                        <div className='sidebar'>
                            <NavbarPat></NavbarPat>
                        </div>
                        <div className="main-background">
                            <header>
                                <h1>Hello, {patient?.Firstname} {patient?.Lastname} 👋</h1>
                                <div className='search-bar'>
                                <div className="labelSearch">
                                <p className="scrolling-text">สวัสดี​คุณ {patient?.Firstname} {patient?.Lastname} 👋 <span className="wide-space"></span> วันนี้อย่าลืมบันทึกไดอารี่นะ!!!!</p>
                                </div>
                                    <div className='warm'>
                                        <div className="bg-warm content">
                                        <Badge count={countNoti} overflowCount={99}>
                                            <i><FaBell /></i>
                                        </Badge>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div className="main-content">
                                <div className='content1'>
                                    <div className='header'>
                                    </div>
                                </div>
                                <div className='content2'>
                                    <div className='header'>
                                        <h2>กำหนดการ</h2>
                                        <button 
                                            className="btn-add-co2" 
                                            onClick={addNotePat}>เพิ่มโน้ต</button>
                                    </div>
                                    <div className='note-board'>
                                        <div className="content">
                                            <NotePat></NotePat>
                                        </div>
                                    </div>
                                </div>
                                <div className='content3'>
                                    <div className='header'>
                                        <h2>ไดอารี่ของฉัน</h2>
                                        <a 
                                            className="btn-add-co3" href='/MainSheet'>เพิ่มเติม</a>
                                    </div>
                                    <div className='book-board'>
                                        <div className="content">
                                            <BookPat limit={5} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-bg-right">
                            <div className="main-content">
                                <div className='content1'>
                                        <div className="box">
                                            <div className="profile">
                                                <div className="header">
                                                    <div className="img-profile">
                                                        <img src={patient?.Picture} alt="imge" className="avatar" />
                                                    </div>
                                                    <h2 className="name">{patient?.Firstname} {patient?.Lastname}</h2>
                                                    <div className='border'></div>
                                                </div>
                                                <div className="info">
                                                    <p><strong>วันเกิด:</strong> {patient?.Dob ? formatDateString(patient.Dob) : ""}</p>
                                                    <p><strong>เบอร์โทรศัพท์:</strong> {patient?.Tel}</p>
                                                    <p><strong>อีเมล:</strong> {patient?.Email}</p>
                                                    <p><strong>นักจิตของคุณ:</strong> {connectedPsy?.Psychologist?.FirstName} {connectedPsy?.Psychologist?.LastName}</p>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div className='content2'>
                                    <div className='box'>
                                    </div>
                                </div>
                                <div className='content3'>
                                    <div className='box'>
                                    <div className="notification-count">การแจ้งเตือนทั้งหมด: {countNoti}</div>
                                    {countNoti > 0 ? (
                                        <div className="notification-item">
                                            <List
                                            className="Add-Patient-List"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                            }}
                                            itemLayout="horizontal"
                                            dataSource={patConnection}
                                            renderItem={(item) =>
                                                item.Status === 'pending' ? (
                                                <div
                                                    style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    }}
                                                >
                                                    <Avatar
                                                    src={item.Psychologist?.Picture}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '15%',
                                                        marginBottom: '0.5rem',
                                                    }}
                                                    />
                                                    <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem',
                                                        textAlign: 'center',
                                                    }}
                                                    >
                                                    {`${item.Psychologist?.FirstName} ${item.Psychologist?.LastName}`}
                                                    </span>
                                                    <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        gap: '10px',
                                                        marginTop: '0.5rem',
                                                    }}
                                                    >
                                                    <Button
                                                        style={{
                                                        backgroundColor: '#f0f0f0',
                                                        color: '#595959',
                                                        borderRadius: '4px',
                                                        padding: '0 22px',
                                                        fontSize: '1rem',
                                                        border: 'none',
                                                        }}
                                                        onClick={() => rejectConnectionRequest(Number(item.ID))}
                                                    >
                                                        ปฎิเสธ
                                                    </Button>
                                                    <Button
                                                        style={{
                                                        backgroundColor: '#BABDF6',
                                                        color: '#fff',
                                                        borderRadius: '4px',
                                                        padding: '0 22px',
                                                        fontSize: '1rem',
                                                        border: 'none',
                                                        }}
                                                        onClick={() => acceptConnectionRequest(Number(item.ID))}
                                                    >
                                                        ยอมรับ
                                                    </Button>
                                                    </div>
                                                </div>
                                                ) : null
                                            }
                                            />
                                        </div>
                                        ) : (
                                            <>
                                            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                                                <div className="Loading-Data"></div>
                                                <div className='text'>ไม่มีการแจ้งเตือนใหม่...</div>
                                            </div>
                                            </>
                                        )}
                                    
                                    {/* <NotificationPat numDays={5} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id='popupNote'>
                <div className="head">
                    <h2>New Note</h2>
                </div>
                <div className='noteBoard'>
                    <div className="head">
                    <input
                        className='titleNote'
                        placeholder="หัวข้อ"
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                        <div className='border'></div>
                    </div>
                    <div className="content">
                        <textarea
                            className='contentNote'
                            placeholder="เนื้อหา..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn-cancel" onClick={addNotePat}>ยกเลิก</button>
                    <button className="btn-create" onClick={handleSaveNote}>สร้างโน้ต</button>
                </div>
            </div>
        </div>
        </ConfigProvider>
    )
}

export default Pat