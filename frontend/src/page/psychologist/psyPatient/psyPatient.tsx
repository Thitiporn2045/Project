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
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className='Content'>
        <div style={{position:'relative',height:'5%',display:'flex',alignItems:'center',marginTop:'2rem'}}>
          <h2 style={{color:'#585858'}}>ผู้ป่วยที่รับผิดชอบ</h2>
        </div>
        <div style={{position:'relative',flexGrow:1,}}>
          <PatTypeSelect/>
        </div>
      </div>

      <div className='Carendar'>
        <Profile/>
        <PsyCalendar/>

      </div>
        
    </div>
  )
}

export default PsyPatient