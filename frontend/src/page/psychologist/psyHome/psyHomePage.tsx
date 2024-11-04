import React, { useEffect, useState } from "react";
import './psyHomePage.css';
import AntD from "../../../component/psychologist/sideBar/AntD";
import SearchAntD from "../../../component/psychologist/search/SearchAntD";
import Noti from "../../../component/psychologist/notificate/Noti";
import PsyCalendar from "../../../component/psychologist/calendar/Calendar";
import Profile from "../../../component/psychologist/Profile/Profile";
import dayjs from 'dayjs';


export default function PsyHomePage(){
    const [currentTime, setCurrentTime] = useState(dayjs());
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentTime(dayjs());
        }, 1000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
      }, []);

  return(
    <div className="PsyHomePage">
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className='Content'>
        <h1 style={{color:'white'}}>ปิดปรับปรุง รอรีโนเวทจ้า</h1>
      </div>

      <div className='Carendar'>
        
      </div>


      {/* <div className="SideBar"><AntD/></div>
      <div className="Main-area">
          <div className="Main">
              <div className="Banner-home">
                  <div className="Banner-img"></div>
                  <div className="Banner-date">
                      {currentTime.format('DD MMMM YYYY h:mm A')}
                  </div>
                  <h1 className="Banner-hello">สวัสดี! คุณ{user?.name}</h1>
                  <p className="Banner-bless">ขอให้วันนี้เป็นวันที่ดี</p>
              </div>
              <div className="PatientList-home">
                  <div className="PatientList-head"><h2>ผู้ป่วยที่รับผิดชอบ ({patients.length})</h2></div>
                  <div className="PatientList-info">
                      {patients.map((patient)=>(
                        <li style={{listStyle:'none'}}>
                          <div className="PatientList-containner" key={patient.id}>
                              <img src={patient.profilePicture} alt={`${patient.firstName} ${patient.lastName}`} style={{ borderRadius: '30%', width: '50px', height: '50px', marginRight: '10px',marginLeft:'1%' }} />
                              <div>
                              <strong>{patient.firstName} {patient.lastName}</strong><br/>
                              <span style={{color:'#b0b0b0'}}>อายุ: {patient.age}&nbsp;&nbsp;&nbsp;อาการที่รักษา: {patient.symptoms}</span>
                              </div>
                          </div> 
                        </li>
                      ))}
                  </div>
              </div>


          </div>
      </div>
      <div className="Search"><SearchAntD/></div>
      <div className='Noti'><Noti/></div>
      <div className="Calendar-area">
          <div className="Calendar">
              <div className="Cal"><PsyCalendar/></div>
              <div className="Profile-pic"><Profile user={user}/></div>
          </div>
      </div>*/}
      
      
      
        
    </div>
      
  )
}