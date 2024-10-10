import React, { useState } from 'react'
import NavbarPat from '../../component/navbarPat/navbarPat'
import SearchPat from '../../component/searchPat/searchPat'
import NotePat from '../../component/notePat/notePat';
import BookPat from '../../component/bookPat/bookPat';
import NotificationPat from '../../component/notificationPat/notificationPat';
import './stylePat.css'

import { ImSearch } from "react-icons/im";
import { FaBell } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";

const userLogin = {
    imge: 'https://i.pinimg.com/474x/0f/44/6f/0f446fc154c16b2dd85413d50bc9c170.jpg',
    name: "สมใจ ยิ้มแย้ม",
    birthDate: "20 สิงหาคม 2003",
    phone: "0801234567",
    email: "somjai2003@gmail.com",
    therapist: "ญาดา โภคาริตนกุล",
}

function Pat() {

//Note
function addNotePat() {
    const blur = document.getElementById('blur') as HTMLElement;
    blur.classList.toggle('active');

    const popup = document.getElementById('popupNote') as HTMLElement;
    popup.classList.toggle('active');
}

const handleSave = (text: string) => {
    console.log('Note saved:', text);
    addNotePat();
};

const handleClose = () => {
    addNotePat();
};

//popup
function toggle() {
    const blur = document.getElementById('blur') as HTMLElement;
    blur.classList.toggle('active');

    const popup = document.getElementById('popup') as HTMLElement;
    popup.classList.toggle('active');
}

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
                                <h1>Hello, {userLogin.name} 👋</h1>
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
                                                    <h2 className="name">{userLogin.name}</h2>
                                                    <div className='border'></div>
                                                </div>
                                                <div className="info">
                                                    <p><strong>วันเกิด:</strong> {userLogin.birthDate}</p>
                                                    <p><strong>เบอร์โทรศัพท์:</strong> {userLogin.phone}</p>
                                                    <p><strong>อีเมล:</strong> {userLogin.email}</p>
                                                    <p><strong>นักวิดของคุณ:</strong> {userLogin.therapist}</p>
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