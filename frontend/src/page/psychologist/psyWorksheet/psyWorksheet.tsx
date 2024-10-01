import React, { useState } from 'react'
import '../psyHome/psyHomePage.css';
import './psyWorksheet.css';
import AntD from '../../../component/psychologist/sideBar/AntD';
import PsyCalendar from '../../../component/psychologist/calendar/Calendar';
import Profile from '../../../component/psychologist/Profile/Profile';
import WorksheetsList from '../../../component/psychologist/patTypeSelect/WorksheetList';

interface User {
  name: string;
  profilePicture: string;
}



function PsyWorksheet() {
  
  const [user, setUser] = useState<User>({
    name: 'ศุภชลิตา พลนงค์',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image URL
  });

  return (
    <div className="PsyWorksheetPage">
      <div className="SideBar"><AntD/></div>
        <div className="Main-area">
          <div className="Main">
            <div style={{position:'relative',width:'100%',height:'6%',top:'2%',display:'flex',alignItems:'center'}}>
                <h2 style={{color:'#585858'}}>Worksheets ที่แชร์กับคุณ</h2>
              </div>
              <div style={{position:'relative',width:'100%',height:'100%',marginTop:'1%',display:'flex'}}>
                <WorksheetsList/>
              </div>
            </div>
        </div>
        {/* <div className="Search"><SearchAntD/></div> */}
        {/* <div className='Noti'><Noti/></div> */}
        <div className="Calendar-area">
            <div className="Calendar">
              <div className="Cal"><PsyCalendar/></div>
              <div className="Profile-pic"><Profile user={user}/></div>

            </div>
        </div>
    </div>
  )
}

export default PsyWorksheet