import React, { useState } from 'react';
import { Avatar, Button, ConfigProvider, Input, List, Modal } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import { CiSearch } from "react-icons/ci";
import './AddPat.css';

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

function AddPat() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered);
  };

  const handleAddRequest = (id: number) => {
    setFilteredPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === id ? { ...patient, connectionStatus: 'pending' } : patient
      )
    );
    console.log('Send request to patient with id:', id);
  };

  const handleCancelRequest = (id: number) => {
    setFilteredPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === id ? { ...patient, connectionStatus: 'not_connected' } : patient
      )
    );
    console.log('Cancel request to patient with id:', id);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Button: {},
        },
        token: {
          colorPrimary: '#63C592',
          colorText: '#585858',
        },
      }}
    >
      <div>
        <Button type="primary" onClick={showModal}>
          <b style={{ fontSize: 20 }}>+</b>เพิ่มผู้ป่วยใหม่
        </Button>
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Input
            placeholder="ค้นหา"
            suffix={<CiSearch style={{ color: '#63C592', fontSize: '20px', fontWeight: 'bolder' }} />}
            value={searchTerm}
            onChange={handleSearch}
            variant="filled"
            style={{ marginBottom: '16px', marginTop: '25px', position: 'relative' }}
          />
          <div style={{ position: 'relative', maxHeight: '400px', overflowY: 'auto' }}>
            <List
              itemLayout="horizontal"
              dataSource={filteredPatients}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.profilePicture} style={{ borderRadius: '10px', width: '50px', height: '50px' }} />}
                    title={`${item.firstName} ${item.lastName}`}
                  />
                  {item.connectionStatus === 'connected' ? (
                    <Button disabled style={{ minWidth: '120px' }}>ผู้ป่วยของคุณ</Button>
                  ) : item.connectionStatus === 'not_connected' ? (
                    <Button
                      type="primary"
                      onClick={() => handleAddRequest(item.id)}
                      style={{ minWidth: '120px' }}
                    >
                      + ส่งคำขอ
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCancelRequest(item.id)}
                      style={{ minWidth: '120px' }}
                    >ยกเลิกคำขอ
                    </Button>
                  )}
                </List.Item>
              )}
            />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default AddPat;
