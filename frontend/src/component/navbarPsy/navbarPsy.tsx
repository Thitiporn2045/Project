import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AiFillHome } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { IoBarChart, IoDocumentText, IoMenu, IoPerson } from "react-icons/io5";
import './stylePsy.css';
import logo from '../../assets/logo4.png';

function NavbarPsy() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/Psy') {
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
    <div className='navbarPsy'>
        <nav className={`sidebarPsy ${sidebarActive ? 'active' : ''}`}>
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
                    
                    <a href="/Psy">
                        <i><AiFillHome /></i>
                        <span className="link-name" >Home</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'worksheets' ? 'active' : ''}`}
                    data-name="worksheets"
                >

                    <a href="/Worksheets">
                        <i><IoDocumentText /></i>
                        <span className="link-name" >CBT Worksheets</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'summary' ? 'active' : ''}`}
                    data-name="summary"
                >
                    <a href="/Summary">
                        <i><IoBarChart /></i>
                        <span className="link-name" >Summary</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'profile' ? 'active' : ''}`}
                    data-name="profile"
                >
                    <a href="/Profile">
                        <i><IoPerson /></i>
                        <span className="link-name" >Profile</span>
                    </a>
                </li>
                <li
                    className={`list-item ${activeItem === 'outline' ? 'active' : ''}`}
                    data-name="profile"
                >
                    <a href="/">
                        <i><FaSignOutAlt /></i>
                        <span className="link-name" >Logout</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
);
}

export default NavbarPsy;
