import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Updated import for react-router-dom
import { AiFillHome } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { IoDocumentText, IoMenu, IoPerson } from "react-icons/io5";
import './stylePat.css';
import logo from '../../assets/logo4.png';
import { RiEmotionFill } from 'react-icons/ri';
import { ImBook } from "react-icons/im";

function NavbarPat() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [delayedPath, setDelayedPath] = useState('');
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const currentPath = location.pathname;
        let timeoutId: NodeJS.Timeout; // Explicitly typing timeoutId
        
        if (currentPath === '/Pat') {
            setActiveItem('home');
        } else if (currentPath === '/Worksheets') {
            setActiveItem('worksheets');
        } else if (currentPath === '/mainSheet') {
            setActiveItem('mainSheet');
        } else if (currentPath === '/Profile') {
            setActiveItem('profile');
        } else if (currentPath === '/EditProfile') {
            setActiveItem('editProfile');
        }

        // Set a timeout before navigating to another path
        timeoutId = setTimeout(() => {
            if (delayedPath) {
                navigate(delayedPath); // Use navigate() to change the route
            }
        }, 200); // Delay time (2 seconds)

        return () => clearTimeout(timeoutId); // Cleanup timeout
    }, [location, delayedPath, navigate]);

    const handleToggle = () => {
        setSidebarActive(!sidebarActive);
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage
        navigate('/login/patient'); // Navigate to login page
    };


    const toggleCollapsed = () =>{
        setCollapsed(!collapsed);
    };

    const handleNavigation = (path: string) => {
        setDelayedPath(path); // Set the path to navigate after delay
    };

    return (
        <div className='navbarPat'>
            <nav className={`sidebarPat ${sidebarActive ? 'active' : ''}`}>
                <div className="logo-menu">
                    <img className='logo' src={logo} alt="" />
                    <i className='icon toggle-btn' onClick={handleToggle}><IoMenu /></i>
                </div>
                <ul className="list">
                    <li
                        className={`list-item ${activeItem === 'home' ? 'active' : ''}`}
                        data-name="home"
                    >
                        <a href="#" onClick={() => handleNavigation('/Pat')}>
                            <i><AiFillHome /></i>
                            <span className="link-name" >หน้าหลัก</span>
                        </a>
                    </li>
                    <li
                        className={`list-item ${activeItem === 'worksheets' ? 'active' : ''}`}
                        data-name="worksheets"
                    >
                        <a href="#" onClick={() => handleNavigation('/Worksheets')}>
                            <i><IoDocumentText /></i>
                            <span className="link-name" >CBT เวิร์คชีท</span>
                        </a>
                    </li>
                    <li
                        className={`list-item ${activeItem === 'mainSheet' ? 'active' : ''}`}
                        data-name="mainSheet"
                    >
                        <a href="#" onClick={() => handleNavigation('/mainSheet')}>
                            <i><ImBook /></i>
                            <span className="link-name" >ไดอารี่</span>
                        </a>
                    </li>
                    <li
                        className={`list-item ${activeItem === 'emotion' ? 'active' : ''}`}
                        data-name="emotion"
                    >
                        <a href="#" onClick={() => handleNavigation('/Emotional')}>
                            <i><RiEmotionFill /></i>
                            <span className="link-name" >อารมณ์</span>
                        </a>
                    </li>
                    <li
                        className={`list-item ${activeItem === 'profile' ? 'active' : ''}`}
                        data-name="profile"
                    >
                        <a href="#" onClick={() => handleNavigation('/Profile')}>
                            <i><IoPerson /></i>
                            <span className="link-name" >โปรไฟล์</span>
                        </a>
                    </li>
                    <li
                        className={`list-item ${activeItem === 'outline' ? 'active' : ''}`}
                        data-name="outline"
                    >
                        <a href="#" onClick={() => handleLogout()}>
                            <i><FaSignOutAlt /></i>
                            <span className="link-name" >{!collapsed && 'ออกจากระบบ'}</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default NavbarPat;
