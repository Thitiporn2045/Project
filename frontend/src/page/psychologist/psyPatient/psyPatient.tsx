import React, { useState } from 'react'
import '../psyHome/psyHomePage.css';
import './psyPatient.css';
import AntD from '../../../component/psychologist/sideBar/AntD';
import PsyCalendar from '../../../component/psychologist/calendar/Calendar';
import Profile from '../../../component/psychologist/Profile/Profile';
import PatTypeSelect from '../../../component/psychologist/patTypeSelect/PatTypeSelect';
import AddPat from '../../../component/psychologist/addPatient/AddPat';

interface User {
  name: string;
  profilePicture: string;
}

function PsyPatient() {
  const [user, setUser] = useState<User>({
    name: 'ศุภชลิตา พลนงค์',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image URL
  });

  return (
    <div className="PsyPatientPage">
        <div className="SideBar"><AntD/></div>
        <div className="Main-area">
            <div className="Main">
              <div style={{position:'relative',width:'100%',height:'6%',top:'2%',display:'flex',alignItems:'center'}}>
                <h2 style={{color:'#585858'}}>ผู้ป่วยที่รับผิดชอบ</h2>
              </div>
              <div style={{position:'relative',width:'100%',height:'100%',display:'flex',alignItems:'center'}}>
                <PatTypeSelect/> 
              </div>
              <div style={{position:'absolute',top:'10.1%',right:'1%'}}>
                <AddPat/>
              </div>

            </div>
        </div>
        {/* <div className="Search"><SearchAntD/></div>
        <div className='Noti'><Noti/></div> */}
        <div className="Calendar-area">
            <div className="Calendar">
                <div className="Cal"><PsyCalendar/></div>
                <div className="Profile-pic"><Profile user={user}/></div>

            </div>
        </div>
    </div>
  )
}

export default PsyPatient