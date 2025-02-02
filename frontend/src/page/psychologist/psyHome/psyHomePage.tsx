import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './psyHomePage.css';
import AntD from "../../../component/psychologist/sideBar/AntD";
import PsyCalendar from "../../../component/psychologist/calendar/Calendar";
import doctor from '../../../assets/Doctors-resize.png';
import dayjs from 'dayjs';
import { PsychologistInterface } from "../../../interfaces/psychologist/IPsychologist";
import { GetPsychologistById } from "../../../services/https/psychologist/psy";
import { PatienForDashboardInterface } from "../../../interfaces/patient/IPatient";
import { ListPatientsForDashboard } from "../../../services/https/patient";
import userEmpty from "../../../assets/userEmty.jpg"
import { Button } from "antd";
import Profile from "../../../component/psychologist/Profile/Profile";


export default function PsyHomePage(){
  const [psychologist, setPsychologist] = useState<PsychologistInterface>();
  const [patients, setPatients] = useState<PatienForDashboardInterface[]>([])
  const [currentTime, setCurrentTime] = useState(dayjs());

  const [loading, setLoading] = useState(true);

  const psyID = localStorage.getItem('psychologistID') 
  
  const getPsychologist = async () => {
    let res = await GetPsychologistById(Number(psyID));
    if(res){
      setPsychologist(res);
    }
  }
//===========================================================================
  const listPatientsForDashboard = async () => {
    let res = await ListPatientsForDashboard(Number(psyID))
    if(res){
      setPatients(res);
      setTimeout(() => {
        setLoading(false);
      },1000)
    }
    
  }

//=========================================================================== 
  useEffect(() => {
    getPsychologist();
    listPatientsForDashboard();
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

//===========================================================================
  const [animatedIndexes, setAnimatedIndexes] = useState<number[]>([]);

  useEffect(() => {
    patients.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedIndexes((prev) => [...prev, index]);
      }, (index + 1) * 100); // เพิ่ม delay ให้แสดงทีละรายการ
    });
  }, [patients]);
//===========================================================================
  const navigate = useNavigate();
  const GoToPatListPage = () =>{
    navigate("/PsyPatient");
  }

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
              width: '98%',
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <b style={{ fontSize: 20, color: '#585858' }}>ผู้ป่วยในระบบของคุณ</b>
              <Button type="default" onClick={GoToPatListPage} style={{
                border: 'none',
                borderRadius: '40px',
                background: '#2C9F99',
                color: 'white'
              }}>แสดงทั้งหมด</Button>
            </div>
            {loading? (
              <div style={{ width:'100%',height:'100%', color: '#b9b9b9',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center' }}>
                <div className="Psy-Loading-Data"></div>
                <div>กำลังโหลดข้อมูล...</div>
              </div>
            ):(
              patients.length !== 0? (<div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                
                {/* Header */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0',
                  }}
                >
                  <div style={{ width: '20%', textAlign: 'center' }}>
                  <b>เลขประจำตัว</b>
                  </div>
                  <div style={{ width: '30%', textAlign: 'center' }}>
                    <b>ชื่อ-สกุล</b>
                  </div>
                  <div style={{ width: '30%', textAlign: 'center' }}>
                    <b>อาการที่รักษา</b>
                  </div>
                  <div style={{ width: '25%', textAlign: 'center' }}>
                    <b>การแชร์ Worksheet</b>
                  </div>
                </div>

                {/* Patient List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    gap: '0.8rem',
                  }}
                >
                  {patients.map((pat, index) => (
                    <div
                      key={pat.ID}
                      className={`pat-list-info ${
                        animatedIndexes.includes(index) ? 'animated' : ''
                      }`}
                      style={{
                        position: 'relative',
                        height:'21%',
                        maxHeight: '80px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexShrink:0,
                        alignItems: 'center',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.03)',
                        padding: '0',
                      }}
                    >
                      {/* ID */}

                        <div
                          style={{
                            width: '20%',
                            textAlign: 'center',
                            color: '#b8b8b8'
                          }}
                        >
                          {pat.IdNumber}
                        </div>

                        {/* Picture and Name */}
                        <div
                          style={{
                            width: '30%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '1rem',                        
                          }}
                        >
                          {/* Picture */}
                          {pat.Picture && pat.Picture !== '' ? (
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundImage: `url(${pat.Picture})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                marginLeft:'3rem'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundImage: `url(${userEmpty})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                marginLeft:'4rem'

                              }}
                            />
                          )}
                          <div style={{}}>{pat.Firstname} {pat.Lastname}</div>
                        </div>

                        {/* Symptoms */}
                        <div
                          style={{
                            width: '30%',
                            textAlign: 'center',
                          }}
                        >
                          {pat.Symtoms === '' || pat.Symtoms === undefined ? 'ไม่ระบุ' : pat.Symtoms}
                        </div>

                        {/* Diary Status */}
                        <div
                        style={{
                          width: '25%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: pat.Diary_Status === 'มีการแชร์' ? '#4CAF50' : '#b0b0b0',
                          }}
                       >
                          {pat.Diary_Status === 'มีการแชร์' && (
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#4CAF50',
                                borderRadius: '50%',
                                display: 'inline-block',
                              }}
                            />
                          )}
                          <span>{pat.Diary_Status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>)
                  
              :(
                <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',}}>
                  <div className="Psy-No-Data"></div>
                  <div style={{color:'#b9b9b9'}}>ไม่มีข้อมูล...</div>
                </div>
              )
              
            )} 

              
          </div>


        </div>      
      </div>
      

      <div className='Carendar'>
        <Profile/>
        <PsyCalendar/>

      </div>


      
    </div>
      
  )
}