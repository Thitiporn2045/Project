import React, { useEffect, useState } from 'react'
import NavbarPat from '../../component/navbarPat/navbarPat'
import SearchPat from '../../component/searchPat/searchPat'
import NotePat from '../../component/notePat/notePat';
import BookPat from '../../component/bookPat/bookPat';
import NotificationPat from '../../component/notificationPat/notificationPat';
import './stylePat.css'

import { ImSearch } from "react-icons/im";
import { FaBell } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import { GetPatientById } from '../../services/https/patient';
import { PatientInterface } from '../../interfaces/patient/IPatient';
import { Form } from 'react-router-dom';
import { ConnectionRequestInterface } from '../../interfaces/connectionRequest/IConnectionRequest';
import { GetConnectionPatientById } from '../../services/https/connectionRequest';

const userLogin = {
    imge: 'https://i.pinimg.com/474x/0f/44/6f/0f446fc154c16b2dd85413d50bc9c170.jpg',
    name: "สมใจ ยิ้มแย้ม",
    birthDate: "20 สิงหาคม 2003",
    phone: "0801234567",
    email: "somjai2003@gmail.com",
    therapist: "ญาดา โภคาริตนกุล",
}

function Pat() {
    const patID = localStorage.getItem('patientID') 
    const [patient, setPatient] = useState<PatientInterface>();
    const [connectedPsy, setConnectedPsy] = useState<ConnectionRequestInterface>();
    // const [initialPatient, setInitialPatient] = useState<PatientInterface>(); // เก็บข้อมูลเริ่มต้น

const getPatientById = async () => {
    let res = await GetPatientById(Number(patID));
    if(res){
        setPatient(res);
        // setInitialPatient(res);

    //   form.setFieldsValue({
    //     firstname: res.FirstName,
    //     lastname: res.LastName,
    //     tel: res.Tel,
    //     email: res.Email,
    //     picture: res.Picture
    //   });
    }
}

useEffect(() => {
    getPatientById();
    getConnectionRequest();
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

//Note
function addNotePat() {
    const blur = document.getElementById('blur') as HTMLElement;
    blur.classList.toggle('active');

    const popup = document.getElementById('popupNote') as HTMLElement;
    popup.classList.toggle('active');
}
//==================================================================
const handleSave = (text: string) => {
    console.log('Note saved:', text);
    addNotePat();
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
        <div className='Pat'>
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
                                        <input
                                            className='searchBook'
                                            type="text"
                                            placeholder="ค้นหาหนังสือของคุณ"
                                            onClick={toggle}
                                        />
                                        <i className="searchIcon"><ImSearch /></i>
                                    </div>
                                    <div className='warm'>
                                        <div className="bg-warm content">
                                            <i><FaBell /></i>
                                            <div className="num content">3</div>
                                            {/* <div className="box">
                                                <div className="heading content">
                                                    <p><i><FaBell /></i>3</p>
                                                </div>
                                                <div className="content-box">
                                                    <div className='text'>
                                                        <p>วันนี้วันที่ 30/07/2024</p>
                                                        <p>อย่าลืมเขียนบันทึกน้าา~~</p>
                                                    </div>
                                                    <div className='bg-icon'>
                                                        <i><LuAlarmClock/></i>
                                                    </div>
                                                </div>
                                            </div> */}
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
                                        <h2>Note Board</h2>
                                        <button 
                                            className="btn-add-co2" 
                                            onClick={addNotePat}>Add</button>
                                    </div>
                                    <div className='note-board'>
                                        <div className="content">
                                            <NotePat></NotePat>
                                        </div>
                                    </div>
                                </div>
                                <div className='content3'>
                                    <div className='header'>
                                        <h2>My Book</h2>
                                        <a 
                                            className="btn-add-co3" href='/MainSheet'>Show</a>
                                    </div>
                                    <div className='book-board'>
                                        <div className="content">
                                        {/* <BookPat month={selectedMonth} /> */}
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
                                                        <img src={userLogin.imge} alt="imge" className="avatar" />
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
                                        <NotificationPat numDays={3} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id='popup'>
                    <div className='compo-search'>
                        <SearchPat></SearchPat>
                        <a href="#" className='btn-close' onClick={toggle}>Close</a>
                    </div>
            </div>

            <div id='popupNote'>
                <div className="head">
                    <h2>New Note</h2>
                </div>
                <div className='noteBoard'>
                    <div className="head">
                        <input className='titleNote' placeholder="หัวข้อ" type="text"/>
                        <div className='border'></div>
                    </div>
                    <div className="content">
                        <textarea className='contentNote' placeholder="เนื้อหา..."></textarea>
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn-cancel" onClick={addNotePat}>ยกเลิก</button>
                    <button className="btn-create">สร้างโน้ต</button>
                </div>
            </div>
        </div>
    )
}

export default Pat