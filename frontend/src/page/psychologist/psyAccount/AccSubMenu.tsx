import React, { useState } from 'react'
import './AccSubMenu.css'
import PsyProfile from './psyProfile';
import PsyPassword from './psyPassword';
import PsyDelAccount from './psyDelAccount';

function AccSubMenu() {
    const [activePage, setActivePage] = useState('profile');

    return (
        <div className='AccSubMenu'>
            
            <div className='Acc-menu'>
                <h2>ตั้งค่าบัญชีผู้ใช้</h2>
                <ul>
                    <li
                        className={activePage === 'profile' ? 'active' : ''}
                        onClick={() => setActivePage('profile')}
                    >
                        โปรไฟล์
                    </li>
                    <li
                        className={activePage === 'password' ? 'active' : ''}
                        onClick={() => setActivePage('password')}
                    >
                        รหัสผ่าน
                    </li>
                    <li
                        className={activePage === 'delete' ? 'active' : ''}
                        onClick={() => setActivePage('delete')}
                    >
                        ลบบัญชีผู้ใช้
                    </li>
                </ul>
            </div> 
            <div className="Acc-content">
                {activePage === 'profile' && <div style={{width:'100%',height:'100%'}}><PsyProfile/></div>}
                {activePage === 'password' && <div style={{width:'100%',height:'100%'}}><PsyPassword/></div>}
                {activePage === 'delete' && <div style={{width:'100%',height:'100%'}}><PsyDelAccount/></div>}
            </div>
            
            
        </div>
    )
}

export default AccSubMenu