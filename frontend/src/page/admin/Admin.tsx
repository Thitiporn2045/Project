import React, { useEffect, useState } from 'react';
import { Modal, Button, message, ConfigProvider } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './admin.css';
import Navbar from '../../component/admin/navbar/navbar';
import { FaUserDoctor } from "react-icons/fa6";
import DonutGraph from '../../component/admin/Graph/donutGraph';
import BarChart from '../../component/admin/Graph/barChart';
import { PsychologistInterface } from '../../interfaces/psychologist/IPsychologist';
import { ListPsychologists, UpdatePsychologist } from '../../services/https/psychologist/psy';

function Admin() {
  const [psychologist, setPsychologists] = useState<PsychologistInterface[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();


  // ดึงข้อมูลนักจิตวิทยาจาก API
  const listPsychologists = async () => {
    const res = await ListPsychologists();
    if (res) {
    setPsychologists(res);
    }
  };

  useEffect(() => {
    listPsychologists();
  }, []);

  // ฟังก์ชันเปิด Modal
  const showModal = (base64: string) => {
    setSelectedCertificate(base64);
    setIsModalVisible(true);
  };

  // ฟังก์ชันปิด Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCertificate(null);
  };
  //=====================================================================
  const handleUpdate = async (id: number, isApproved: boolean) => {

    const psychologistToUpdate = psychologist.find((psy) => psy.ID === id);

    const updatedPsychologist = {
    ...psychologistToUpdate,
    IsApproved: !isApproved, // Toggle the approval status
    };
    const res = await UpdatePsychologist(updatedPsychologist);

    if (res.status) {
    messageApi.success("อัปเดตการอนุมัติแล้ว!");
    listPsychologists(); 
    } else {
    messageApi.error(`เกิดข้อผิดพลาด: ${res.message}`);
    }

  };

  const user = 102496;
  const psychologists = 47403;
  const patients = 55093;

  const cbtData = [
    { name: 'Activity Planning', value: 10 },
    { name: 'Activity Diary', value: 20 },
    { name: 'Behavioral Experiment', value: 30 },
    { name: 'Cross Sectional', value: 10 },
    { name: 'Dairy', value: 5 },
  ];

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorText: '#585858',
          fontFamily: 'Noto Sans Thai, sans-serif',
          colorPrimary: '#24252C'
        }
      }}
    >
      <div className='Admin'>
      {contextHolder}
        <div className='bg-main'>
          <div className='left'>
            <Navbar></Navbar>
          </div>
          <div className='middle'>
            <div className="box-content">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon I">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='I'>จำนวนผู้ใช้ระบบ</h3>
                </div>
                <div className="card-body">
                  <p className="card-value I">$11.67M</p>
                  <p className="card-percentage I">+33.40%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon II">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='II'>จำนวนนักจิตวิทยา</h3>
                </div>
                <div className="card-body">
                  <p className="card-value II">47,403</p>
                  <p className="card-percentage II">-12.4%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon III">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='III'>จำนวนผู้ป่วย</h3>
                </div>
                <div className="card-body">
                  <p className="card-value III">55,093</p>
                  <p className="card-percentage III">+40%</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon IV">
                    <i><FaUserDoctor /></i>
                  </div>
                  <h3 className='IV'>เปอร์เซ็นต์รวม</h3>
                </div>
                <div className="card-body">
                  <p className="card-value IV">$12.33B</p>
                  <p className="card-percentage IV">+4.46%</p>
                </div>
              </div>
            </div>
            <div className='graph'>
              <BarChart data={cbtData} />
              <DonutGraph users={user} psychologists={psychologists} patients={patients} />
            </div>
            <div className="list">
              <div className="listPsycho">
                <div className="boxTable">
                  {psychologist.length === 0 ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        transition: '.3s',
                      }}
                    >
                      <div className="Loading-Data"></div>
                      <div className="text">ยังไม่ได้เลือกอิโมจิ...</div>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th className="col-first-name">ชื่อจริง</th>
                          <th className="col-last-name">นามสกุล</th>
                          <th className="col-email">อีเมล</th>
                          <th className="col-work-place">สถานที่ทำงาน</th>
                          <th className="col-certificate">ไฟล์ใบรับรอง</th>
                          <th className="col-working-number">เลขที่ใบรับรอง</th>
                          <th className="col-is-approved">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                      {psychologist.slice(0, 3).map((psychologist) => (
                          <tr key={psychologist.ID}>
                            <td>{psychologist.FirstName}</td>
                            <td>{psychologist.LastName}</td>
                            <td>{psychologist.Email}</td>
                            <td>{psychologist.WorkPlace}</td>
                            <td>
                              {psychologist.CertificateFile ? (
                                <span
                                  style={{ color: '#FF88A8', cursor: 'pointer' }}
                                  onClick={() => psychologist.CertificateFile && showModal(psychologist.CertificateFile)}
                                >
                                  แสดงไฟล์
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td>{psychologist.WorkingNumber}</td>
                            <td>
                              {psychologist.IsApproved ? (
                                <Button
                                  className="approved"
                                  onClick={() => handleUpdate(Number(psychologist.ID), Boolean(psychologist.IsApproved))}
                                >
                                  อนุมัติแล้ว
                                </Button>
                              ) : (
                                <Button
                                  className="not-approved"
                                  onClick={() => handleUpdate(Number(psychologist.ID), Boolean(psychologist.IsApproved))}
                                >
                                  รอการอนุมัติ
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div style={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#EBF1F5',
                    textDecoration: 'none',
                    marginTop: '5px'
                  }}>
                    <a 
                      href="/ListPsycho" 
                      style={{ 
                        textDecoration: 'none',  // เอาเส้นใต้ลิงก์ออก
                        color: '#9095b2' // เปลี่ยนสีตัวหนังสือ
                      }}
                    >
                      ดูเพิ่มเติม
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='right'>
          </div> */}
        </div>
      </div>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{top:0,paddingTop:20,paddingBottom:0}} 
        width="50%" // ตั้งกว้างเต็ม
        height="100%" // ตั้งสูงเต็ม
    >
        <iframe
            src={`${selectedCertificate}`}
            width="100%"
            height="640px"
            style={{marginTop:25,border:'none',borderRadius:'10px'}}
        />
    </Modal>
    </ConfigProvider>
  );
}

export default Admin;