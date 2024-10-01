import React, { useState } from 'react'
import NavbarPat from '../../component/navbarPat/navbarPat'
import SearchPat from '../../component/searchPat/searchPat'
import './stylePat.css'

import { ImSearch } from "react-icons/im";
import { FaBell } from "react-icons/fa";
import NotePat from '../../component/notePat/notePat';

const userLogin = {
    name: "Anna"
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
                                        <div className="bg-warm">
                                            <i><FaBell /></i>
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
                                        <button 
                                            className="btn-add-co2" 
                                            onClick={addNotePat}>Show</button>
                                    </div>
                                    <div className='book-board'>
                                        <div className="content">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-bg-right">
                            <div className="main-content">
                                <div className='content1'>
                                    <div className='box'>
                                    </div>
                                </div>
                                <div className='content2'>
                                    <div className='box'>
                                    </div>
                                </div>
                                <div className='content3'>
                                    <div className='box'>
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