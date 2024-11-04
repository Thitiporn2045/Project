import React, { useEffect, useState } from "react";
import './psyHomePage.css';
import AntD from "../../../component/psychologist/sideBar/AntD";
import SearchAntD from "../../../component/psychologist/search/SearchAntD";
import Noti from "../../../component/psychologist/notificate/Noti";
import PsyCalendar from "../../../component/psychologist/calendar/Calendar";
import Profile from "../../../component/psychologist/Profile/Profile";
import doctor from '../../../assets/Doctors-resize.png';
import dayjs from 'dayjs';
import { PsychologistInterface } from "../../../interfaces/psychologist/IPsychologist";
import { GetPsychologistById } from "../../../services/https/psychologist/psy";


export default function PsyHomePage(){
  const [psychologist, setPsychologist] = useState<PsychologistInterface>();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const psyID = localStorage.getItem('psychologistID') 
  
  const getPsychologist = async () => {
    let res = await GetPsychologistById(Number(psyID));
    if(res){
      setPsychologist(res);
    }
  }

  
  useEffect(() => {
    getPsychologist();
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
        
        <div style={{position:'relative',height:'5%',display:'flex',alignItems:'center',marginTop:'2rem',}}>
          <h2 style={{color:'#585858'}}>หน้าแรก</h2>
        </div>
        
        <div style={{
          position:'relative',
          width:'100%',
          height:'90%',
          display:'flex',
          alignItems:'center',
          flexDirection:'column',
          gap:'2rem'
          }}
        >
          <div className="Banner" 
            style={{
              position:'relative',
              width:'98%',
              height:'35%',
              background: 'linear-gradient(-225deg, #B7F8DB 0%, #50A7C2 100%)',
              boxShadow: 'rgba(149, 157, 165, 0.3) 0px 8px 20px',             
              borderRadius:'20px',
              marginTop:'2rem',
              display:'flex',
              flexDirection:'row',
              flexShrink:0
            }}
          >
            <div className="Banner-Left" style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'50%',height:'100%',}}>
                <div className="Banner-DateTime" 
                  style={{
                    width:'45%',
                    minWidth: '220px',
                    height:'15%',
                    borderRadius:'10px',
                    display:'flex',
                    flexShrink:0,
                    justifyContent:'center',
                    alignItems:'center',
                    background:'#2C9F99',
                    color:'white',
                    marginLeft:'2rem',
                    marginTop:'2rem'
                  }}
                >
                  {currentTime.format('DD MMMM YYYY h:mm A')}
                </div>

                <div className="Banner-PsyName" style={{marginLeft:'2rem',marginBottom:'2rem'}}>
                  <div style={{fontSize:34,fontWeight:600}}>สวัสดี, {psychologist?.FirstName}</div>
                  <div style={{fontSize:22,color:'#989898'}}>ขอให้วันนี้เป็นวันที่ดี 😊</div>
                </div>

            </div>
            <div className="Banner-Right" 
              style={{
                display:'flex',
                justifyContent:'center',
                flexGrow:1,
              }}
            >
              <div 
                style={{
                  width:'70%',
                  height:'100%',
                  backgroundImage:`url(${doctor})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginLeft:'6rem'
                  
                }}
              >

              </div>

            </div>

          </div>

          <div className="Patient-list"
            style={{
              width:'98%',
              height:'90%',
              border:'solid 1px',
            }}
          >

          </div>

        </div>      
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