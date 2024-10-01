import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AiFillHome } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { IoBarChart, IoDocumentText, IoMenu, IoPerson } from "react-icons/io5";
import './stylePat.css';
import logo from '../../assets/logo4.png';

function NavbarPat() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/Pat') {
            setActiveItem('home');
        } else if (currentPath === '/Worksheets') {
            setActiveItem('worksheets');
        } else if (currentPath === '/Summary') {
            setActiveItem('summary');
        } else if (currentPath === '/Profile') {
            setActiveItem('profile');
        }
    }, [location]);

const handleToggle = () => {
    setSidebarActive(!sidebarActive);
};

return (
    <div className='navbarPat'>
        <nav className={`sidebarPat ${sidebarActive ? 'active' : ''}`}>
            <div className="logo-menu">
                <img className='logo' src={logo} alt="" />
                {/* <h2 className="logo">CBT Buddies</h2> */}
                <i className='icon toggle-btn' onClick={handleToggle}><IoMenu /></i>
            </div>
            <ul className="list">
                <li
                    className={`list-item ${activeItem === 'home' ? 'active' : ''}`}
                    data-name="home"
                >
                    
                    <a href="/Pat">
                        <i><AiFillHome /></i>
                        <span className="link-name" >หน้าหลัก</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'worksheets' ? 'active' : ''}`}
                    data-name="worksheets"
                >

                    <a href="/Worksheets">
                        <i><IoDocumentText /></i>
                        <span className="link-name" >CBT เวิร์คชีท</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'summary' ? 'active' : ''}`}
                    data-name="summary"
                >
                    <a href="/Summary">
                        <i><IoBarChart /></i>
                        <span className="link-name" >สรุปผล</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'profile' ? 'active' : ''}`}
                    data-name="profile"
                >
                    <a href="/Profile">
                        <i><IoPerson /></i>
                        <span className="link-name" >โปรไฟล์</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'outline' ? 'active' : ''}`}
                    data-name="outline"
                >
                    <a href="/">
                        <i><FaSignOutAlt /></i>
                        <span className="link-name" >ออกจากระบบ</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
);
}

export default NavbarPat;
