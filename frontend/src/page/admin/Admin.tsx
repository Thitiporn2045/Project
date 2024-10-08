import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { PsychologistInterface } from '../../interfaces/psychologist/IPsychologist';
import { ListPsychologists, UpdatePsychologist, DeletePsychologistByID } from '../../services/https/psychologist/psy';
import './admin.css';

function Admin() {
  const [psychologist, setPsychologists] = useState<PsychologistInterface[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState<String>();
  const [deleteId, setDeleteId] = useState<number>();
  const [confirmLoading, setConfirmLoading] = useState(false);



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
      message.success("อัปเดทการอนุมัติแล้ว!");
      listPsychologists(); 
    } else {
      message.error(`เกิดข้อผิดพลาด: ${res.message}`);
    }


  };
//====================================================================
const showModalDel = (val: PsychologistInterface) => {
    setModalText(
      `คุณต้องการลบข้อมูลผู้ใช้ "${val.FirstName} ${val.LastName}" หรือไม่ ?`
    );
    setDeleteId(val.ID);
    setOpen(true);
  };
  const handleOk = async () =>{
   setConfirmLoading(true);

   let  res = await DeletePsychologistByID(Number(deleteId));
   if (res.status) {
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      setOpen(false);
      ListPsychologists();
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด",
      });
    }
    setConfirmLoading(false);
  }
  const handleCancelDel = () => {
    setOpen(false);
  };

  return (
    
    <div className='Admin' style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      {contextHolder}
      <div><h2>Psychologist Table</h2></div>

      <table>
        <thead>
        <tr>
            <th className="col-first-name">ชื่อจริง</th>
            <th className="col-last-name">นามสกุล</th>
            <th className="col-tel">เบอร์โทรศัพท์</th>
            <th className="col-email">อีเมล</th>
            <th className="col-certificate">ไฟล์ใบรับรอง</th>
            <th className="col-working-number">เลขที่ใบรับรอง</th>
            <th className="col-is-approved">สถานะ</th>
            <th className="col-actions">จัดการ</th>
        </tr>
        </thead>
        <tbody>
          {psychologist.map((psychologist) => (
            <tr key={psychologist.ID}>
                <td>{psychologist.FirstName}</td>
                <td>{psychologist.LastName}</td>
                <td>{psychologist.Tel}</td>
                <td>{psychologist.Email}</td>
            
                <td>
                    {psychologist.CertificateFile ? (
                    <span 
                        style={{ color: 'blue', cursor: 'pointer' }}
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
                    onClick={()=> handleUpdate(Number(psychologist.ID),Boolean(psychologist.IsApproved))}
          
                >
                    อนุมัติแล้ว
                </Button>) : (
                <Button
                    className="not-approved"
                    onClick={()=> handleUpdate(Number(psychologist.ID),Boolean(psychologist.IsApproved))}
          
                >
                    รอการอนุมัติ
                </Button>
                )}
                </td>
                <td>
                    <Button type="primary" danger
                    onClick={()=>showModalDel(psychologist)}>
                    ลบ
                    </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

        <Modal
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            style={{top:0,paddingTop:20}} 
            width="100%" // ตั้งกว้างเต็ม
            height="100%" // ตั้งสูงเต็ม
        >
            <iframe
                src={`${selectedCertificate}`}
                width="100%"
                height="600px"
                style={{marginTop:25,border:'none',borderRadius:'10px'}}
            />
        </Modal>
        <Modal
            title="ลบข้อมูล ?"
            visible={open}
            onOk={handleOk}
            onCancel={handleCancelDel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );

}
export default Admin;
