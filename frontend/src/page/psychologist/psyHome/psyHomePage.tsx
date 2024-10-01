import React, { useEffect, useState } from "react";
import './psyHomePage.css';
import AntD from "../../../component/psychologist/sideBar/AntD";
import SearchAntD from "../../../component/psychologist/search/SearchAntD";
import Noti from "../../../component/psychologist/notificate/Noti";
import PsyCalendar from "../../../component/psychologist/calendar/Calendar";
import Profile from "../../../component/psychologist/Profile/Profile";
import dayjs from 'dayjs';

interface Patient{
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  age: number;
  phone: string;
  email: string;
  symptoms: string;
  type: string;
  profilePicture: string;
  connectionStatus: string;
  isWorksheetPublic: boolean;

}

const patients: Patient[] = [
  {
    "id": 1,
    "firstName": "สมใจ",
    "lastName": "ยิ้มแย้ม",
    "birthdate": "1985-05-12",
    "age": 39,
    "phone": "0812345678",
    "email": "somchai.s@example.com",
    "symptoms": "Depression",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Somchai",
    "connectionStatus": "connected",
    "isWorksheetPublic": true,

  },
  {
    "id": 2,
    "firstName": "สมใจ",
    "lastName": "ชีวเจริญ",
    "birthdate": "1990-03-22",
    "age": 34,
    "phone": "0897654321",
    "email": "somsak.p@example.com",
    "symptoms": "Anxiety",
    "type": "คลินิกวัยรุ่น",
    "profilePicture": "https://via.placeholder.com/150?text=Somsak",
    "connectionStatus": "not_connected",
    "isWorksheetPublic": true,

  },
{
    "id": 3,
    "firstName": "สมใจ",
    "lastName": "ยอดรักยิ่ง",
    "birthdate": "1978-08-15",
    "age": 46,
    "phone": "0876543210",
    "email": "sompong.j@example.com",
    "symptoms": "PTSD",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Sompong",
    "connectionStatus": "pending",
    "isWorksheetPublic": false,

  },
  {
    "id": 4,
    "firstName": "สมพงษ์",
    "lastName": "รักไทย",
    "birthdate": "1995-01-30",
    "age": 29,
    "phone": "0865432109",
    "email": "sureeporn.w@example.com",
    "symptoms": "Bipolar Disorder",
    "type": "คลินิกวัยรุ่น",
    "profilePicture": "https://via.placeholder.com/150?text=Sureeporn",
    "connectionStatus": "pending",
    "isWorksheetPublic": true,

  },
{
    "id": 5,
    "firstName": "ศรราม",
    "lastName": "น้ำใจ",
    "birthdate": "1988-11-05",
    "age": 35,
    "phone": "0854321098",
    "email": "siriwan.k@example.com",
    "symptoms": "OCD",
    "type": "รพ.มทส",
    "profilePicture": "https://via.placeholder.com/150?text=Siriwan",
    "connectionStatus": "pending",
    "isWorksheetPublic": false,

  },
{
    "id": 6,
    "firstName": "อนุชา",
    "lastName": "งามเจริญ",
    "birthdate": "1983-07-21",
    "age": 41,
    "phone": "0843210987",
    "email": "sakchai.i@example.com",
    "symptoms": "Schizophrenia",
    "type": "",
    "profilePicture": "https://via.placeholder.com/150?text=Sakchai",
    "connectionStatus": "connected",
    "isWorksheetPublic": true,

  },
  {
    "id": 7,
    "firstName": "สุมาลี",
    "lastName": "ทองใส",
    "birthdate": "1992-12-10",
    "age": 31,
    "phone": "0832109876",
    "email": "sumalee.t@example.com",
    "symptoms": "Panic Disorder",
    "type": "",
    "profilePicture": "https://via.placeholder.com/150?text=Sumalee",
    "connectionStatus": "pending",
    "isWorksheetPublic": true,

  }
]

interface User {
  name: string;
  profilePicture: string;
}

export default function PsyHomePage(){
    const [currentTime, setCurrentTime] = useState(dayjs());
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentTime(dayjs());
        }, 1000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
      }, []);

    const [user, setUser] = useState<User>({
        name: 'ศุภชลิตา พลนงค์',
        profilePicture: 'https://via.placeholder.com/150', // Placeholder image URL
      });

    return(
        <div className="PsyHomePage">
            <div className="SideBar"><AntD/></div>
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
            </div>
          
          
          
          
        </div>
        
    )
}