import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

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
  

function PsyShowWSh() {
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
      // อ่าน patientId จาก cookie
      const patientId = Cookies.get('patientId');
  
      if (patientId) {
        // แปลง patientId เป็นหมายเลข
        const id = parseInt(patientId, 10);
  
        // ค้นหาผู้ป่วยจาก id
        const foundPatient = patients.find(p => p.id === id);
        setPatient(foundPatient || null);
      }
    }, []);
  
    return (
        <div>
          {patient ? (
            <div>
              <h1>{patient.firstName} {patient.lastName}</h1>
              <img src={patient.profilePicture} alt={`${patient.firstName} ${patient.lastName}`} />
              <p>อายุ: {patient.age}</p>
              <p>อาการ: {patient.symptoms}</p>
              <p>เบอร์โทร: {patient.phone}</p>
              <p>อีเมล: {patient.email}</p>
            </div>
          ) : (
            <p>ไม่พบข้อมูลผู้ป่วย</p>
          )}
        </div>
      );
    };

export default PsyShowWSh;