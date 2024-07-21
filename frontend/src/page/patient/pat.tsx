import React, { useState } from 'react'
import NavbarPat from '../../component/navbarPat/navbarPat'
import SearchPat from '../../component/searchPat/searchPat'
import './stylePat.css'

import { ImSearch } from "react-icons/im";
import { FaBell } from "react-icons/fa";
import NotePat from '../../component/notePat/notePat';
import NoteboardPat from '../../component/notePat/noteboardPat';

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

                                    </div>
                                </div>
                                <div className='content3'>
                                    <div className='header'>
                                        <h2>My Book</h2>
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
                    <div className='compo-search'>
                        <NoteboardPat onSave={handleSave} onClose={handleClose} />
                        <a href="#" className='btn-close' onClick={addNotePat}>Close</a>
                    </div>
            </div>
        </div>
    )
}

export default Pat