import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AiFillHome } from "react-icons/ai";
import { FaSignOutAlt, FaUserInjured } from "react-icons/fa";
import { IoBarChart, IoDocumentText, IoMenu, IoPerson } from "react-icons/io5";
import './styleAdmin.css';
import logo from '../../../assets/logo4.png';
import { RiEmotionFill } from 'react-icons/ri';
import { FaUserDoctor } from 'react-icons/fa6';

function Navbar() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/admin') {
            setActiveItem('home');
        } else if (currentPath === '/ListPsycho') {
            setActiveItem('listPsycho');
        } else if (currentPath === '/ListPat') {
            setActiveItem('listPat');
        } else if (currentPath === '/Profile') {
            setActiveItem('profile');
        }else if (currentPath === '/EditProfile'){
            setActiveItem('editProfile')
        }
    }, [location]);

const handleToggle = () => {
    setSidebarActive(!sidebarActive);
};

return (
    <div className='adminNavbar'>
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
                    
                    <a href="/admin">
                        <i><AiFillHome /></i>
                        <span className="link-name" >หน้าหลัก</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'listPsycho' ? 'active' : ''}`}
                    data-name="listPsycho"
                >

                    <a href="/ListPsycho">
                        <i><FaUserDoctor /></i>
                        <span className="link-name" >นักจิตวิทยา</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'listPat' ? 'active' : ''}`}
                    data-name="listPat"
                >
                    <a href="/ListPat">
                        <i><FaUserInjured /></i>
                        <span className="link-name" >ผู้ป่วย</span>
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

export default Navbar;