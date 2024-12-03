import React, { useEffect, useState } from 'react';
import { Modal, Button, message, ConfigProvider } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './admin.css';
import Navbar from '../../../component/admin/navbar/navbar';
import { PatientInterface } from '../../../interfaces/patient/IPatient';
import { DeletePatientByID, ListPatients } from '../../../services/https/patient';
import { RiDeleteBin6Line } from 'react-icons/ri';

function ListPat() {
    const [pintien, setPintien] = useState<PatientInterface[]>([]);
    const [deleteId, setDeleteId] = useState<number>();
    const [messageApi, contextHolder] = message.useMessage();
    const [modalText, setModalText] = useState<string>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const listPintiens = async () => {
        const res = await ListPatients();
        if (res) {
            setPintien(res);
        }
    };

    useEffect(() => {
        listPintiens();
    }, []);

    const showModalDel = (val: PatientInterface) => {
        setModalText(
            `คุณต้องการลบข้อมูลผู้ใช้ "${val.Firstname} ${val.Lastname}" หรือไม่ ?`
        );
        setDeleteId(val.ID);
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        const res = await DeletePatientByID(Number(deleteId));
        if (res.status) {
            messageApi.success("ลบบัญชีผู้ใช้แล้ว!");
            setOpen(false);
            listPintiens();
        } else {
            messageApi.error(res.message || "เกิดข้อผิดพลาด");
        }
        setConfirmLoading(false);
    };

    const handleCancelDel = () => {
        setOpen(false);
    };

    return (
        <ConfigProvider
            locale={thTH}
            theme={{
                token: {
                    colorText: '#585858',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    colorPrimary: '#24252C',
                },
            }}
        >
            <div className="listPat">
                {contextHolder}
                <div className="bg-main">
                    <div className="left">
                        <Navbar />
                    </div>
                    <div className="right">
                        <div className="listPsycho">
                            <div className="box-content">
                                <div className="mainText">
                                    <h2>Patien Table</h2>
                                </div>
                                <div className="boxTable">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="col-working-number">เลขบัตรประชาชน</th>
                                                <th className="col-first-name">ชื่อจริง</th>
                                                <th className="col-last-name">นามสกุล</th>
                                                <th className="col-tel">เบอร์โทรศัพท์</th>
                                                <th className="col-email">อีเมล</th>
                                                <th className="col-actions">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pintien.map((pintien) => (
                                                <tr key={pintien.ID}>
                                                    <td>{pintien.IdNumber}</td>
                                                    <td>{pintien.Firstname}</td>
                                                    <td>{pintien.Lastname}</td>
                                                    <td>{pintien.Tel}</td>
                                                    <td>{pintien.Email}</td>
                                                    <td>
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            onClick={() => showModalDel(pintien)}
                                                        >
                                                            <RiDeleteBin6Line />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="ลบข้อมูล ?"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancelDel}
                >
                    <p>{modalText}</p>
                </Modal>
            </div>
        </ConfigProvider>
    );
}

export default ListPat;
