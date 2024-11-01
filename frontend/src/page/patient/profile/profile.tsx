import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import './stylePat.css';
import { PatientInterface } from '../../../interfaces/patient/IPatient';
import { ConnectionRequestInterface } from '../../../interfaces/connectionRequest/IConnectionRequest';
import { Button, Form, message } from 'antd';
import { GetConnectionPatientById } from '../../../services/https/connectionRequest';
import { GetPatientById, UpdatePatient } from '../../../services/https/patient';
import userEmpty from '../../../assets/userEmty.png';

const userLogin = {
    imge: 'https://i.pinimg.com/474x/0f/44/6f/0f446fc154c16b2dd85413d50bc9c170.jpg',
    name: "สมใจ ยิ้มแย้ม",
    birthDate: "20 สิงหาคม 2003",
    phone: "0801234567",
    email: "somjai2003@gmail.com",
    drug: "ไม่ได้กินยา",
    therapist: "ญาดา โภคาริตนกุล",
}

function Profile() {
    const patID = localStorage.getItem('patientID') 
    const [patient, setPatient] = useState<PatientInterface>();
    const [connectedPsy, setConnectedPsy] = useState<ConnectionRequestInterface>();
    const [initialPatient, setInitialPatient] = useState<PatientInterface>();
    const [isChanged, setIsChanged] = useState(false); // สถานะสำหรับปุ่มบันทึก
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const getPatientById = async () => {
        let res = await GetPatientById(Number(patID));
        if(res){
            setPatient(res);
            setInitialPatient(res);
    
            form.setFieldsValue({
                firstname: res.FirstName,
                lastname: res.LastName,
                tel: res.Tel,
                email: res.Email,
                picture: res.Picture,
                isTakeMedicine: res.IsTakeMedicine
            });
        }
    }
    //==================================================================
    const handleCancel = () => {
        if (initialPatient) {
            setInitialPatient(initialPatient); 

        form.setFieldsValue({
            firstname: initialPatient.Firstname,
            lastname: initialPatient.Lastname,
            tel: initialPatient.Tel,
            email: initialPatient.Email,
            picture: initialPatient.Picture,
            isTakeMedicine: initialPatient.IsTakeMedicine
        });      
        
        setIsChanged(false); 
        }
    };
    //==================================================================
    
    const getConnectionRequest = async () => {
        let res = await GetConnectionPatientById(Number(patID));
        if (res) {
            setConnectedPsy(res);
        }
    };

    useEffect(() => {
        getPatientById();
        getConnectionRequest();
    }, []);

    const formatDateString = (dateString: string) => {
        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const [day, month, year] = dateString.split('-');
        return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
    };

    //==================================================================

    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const base64String = e.target.result as string;
                    setPatient(prev => ({ ...prev, Picture: base64String }));
                    setIsChanged(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    

//===================================================================
    const handleInputChange = (field: keyof PatientInterface, value: string) => {
        setPatient({ ...patient, [field]: value });
        setIsChanged(true); 
    };
    //===========================================================
    
    const onFinishEditer = async (allValues: PatientInterface) => {
        allValues.ID = patient?.ID;
        allValues.Firstname = patient?.Firstname;
        allValues.Lastname = patient?.Lastname;
        allValues.Dob = patient?.Dob;
        allValues.Tel = patient?.Tel;
        allValues.Email = patient?.Email;
        allValues.IsTakeMedicine = patient?.IsTakeMedicine;
        
        console.log('Form submitted with values:', allValues);

            let res = await UpdatePatient(allValues);

            if (res.status) {
                messageApi.open({
                    type: "success",
                    content: "แก้ไขข้อมูลสำเร็จ",
                });
                setTimeout(() => {
                    setIsChanged(false)
                    getPatientById(); 
                }, 2000);
            } else {
                messageApi.open({
                    type: "error",
                    content: res.message,
                });
            }
        
    };
    //===========================================================
    
    
    const [isOpen, setIsOpen] = useState(false);
    const [activeContent, setActiveContent] = useState('profile');
    const { scrollYProgress } = useScroll();
    
    const toggleCard = () => {
        setIsOpen(prev => !prev);
    }

    const cardVariants = {
        closed: { rotateY: 0, translateX: 0},
        open: { rotateY: 180, translateX: '-50%' }
    };

    const contentVariants = {
        closed: { rotateY: 0 },
        open: { rotateY: 180 }
    };

    const Previwe = () => (
        <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className='previwe'>
                <div className="content3">
                    <motion.div
                        className="card"
                        variants={cardVariants}
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        transition={{ duration: 0.5 }}
                        onClick={toggleCard}
                    >
                        <motion.div className="imgBox" variants={contentVariants}>
                            <div className="profile">
                                <motion.div className="cardbg" variants={contentVariants}>
                                    <motion.div className="name" variants={contentVariants}>
                                        <div className="firstname">{patient?.Firstname} {patient?.Lastname}</div>
                                    </motion.div>
                                    <motion.div className="user-profile" variants={contentVariants}>
                                        <img src={userLogin.imge} alt="profile" className="pro" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                        <div className="bg-right">
                            <div className="content">
                                <div className="info">
                                    <div className="m-content">
                                        <div className="row">
                                            <strong>วันเกิด:</strong>
                                            <label className="label-wrapper"><p>{patient?.Dob ? formatDateString(patient.Dob) : ""}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>เบอร์โทรศัพท์:</strong>
                                            <label className="label-wrapper"><p>{patient?.Tel}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>อีเมล:</strong>
                                            <label className="label-wrapper"><p>{patient?.Email}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>สถานะ:</strong>
                                            <label className="label-wrapper"><p>{userLogin.drug}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>นักจิตของคุณ:</strong>
                                            <label className="label-wrapper"><p>{connectedPsy?.Psychologist?.FirstName} {connectedPsy?.Psychologist?.LastName}</p></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="infoPsy">
                                    <div className="head">
                                        <img src={userLogin.imge} alt="therapist" className="pro" />
                                        <strong>{connectedPsy?.Psychologist?.FirstName} {connectedPsy?.Psychologist?.LastName}</strong>
                                    </div>
                                    <div className="rowPsy">
                                            <strong>อีเมล:</strong>
                                            <label className="label-wrapper"><p>{connectedPsy?.Psychologist?.Email}</p></label>
                                    </div>
                                    <div className="rowPsy">
                                            <strong>เบอร์โทรศัพท์:</strong>
                                            <label className="label-wrapper"><p>{connectedPsy?.Psychologist?.Tel}</p></label>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );

    const EditProfile = () => (
        <motion.div
            key="editProfile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Form form={form} onFinish={onFinishEditer}>        
            <div className="edit-profile">
                <div className="imgBox">
                    <div className="profile">
                        <div className="cardbg">
                            <div className="name">
                                <h2>รูปโปรไฟล์</h2>
                            </div>
                            <div className="user-profile">
                            {patient?.Picture && (patient?.Picture !== " ") && (patient.Picture !== undefined) ? (
                            <img 
                                    className='pro'
                                    src={patient.Picture} 
                                    alt="profile" 
                                />
                                ) : (
                                    <img 
                                    className='pro'
                                    src={userEmpty} 
                                />
                                )}
                            </div>
                            <label htmlFor="input-file" id="label" onClick={() => document.getElementById('profilePicInput')?.click()}>
                                เปลี่ยนรูปโปร์ไฟล์
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                onChange={handleProfilePicChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-right">
                    <div className="content" >
                        <div className="info">
                            <div className="m-content">
                                <div className="title">
                                    <h2>ข้อมูลส่วนตัว</h2>
                                </div>
                                <div className="row">
                                    <strong>ชื่อจริง:</strong>
                                    <input 
                                        className="label-wrapper"
                                        value={patient?.Firstname}
                                        onChange={(e) => handleInputChange('Firstname', e.target.value)}
                                    ></input>
                                </div>
                                <div className="row">
                                    <strong>นามสกุล:</strong>
                                    <input 
                                        className="label-wrapper"
                                        value={patient?.Lastname}
                                        onChange={(e) => handleInputChange('Lastname', e.target.value)}
                                        ></input>
                                </div>
                                <div className="row">
                                    <strong>เบอร์โทรศัพท์:</strong>
                                    <input 
                                        className="label-wrapper"
                                        value={patient?.Tel}
                                        onChange={(e) => handleInputChange('Tel', e.target.value)}
                                        ></input>
                                </div>
                                <div className="row">
                                    <strong>อีเมล:</strong>
                                    <input 
                                        className="label-wrapper"
                                        value={patient?.Email}
                                        onChange={(e) => handleInputChange('Email', e.target.value)}
                                        ></input>
                                </div>
                                <div className="row">
                                    <strong>สถานะ:</strong>
                                    {/* <input 
                                        className="label-wrapper"
                                        value={patient?.IsTakeMedicine}
                                        onChange={(e) => handleInputChange(String(patient?.IsTakeMedicine), e.target.value)}
                                        ></input> */}
                                </div>
                                    <button 
                                        type="button" // เปลี่ยนจาก submit เป็น button
                                        className="save-changes-btn"
                                        onClick={() => form.submit()} // เรียกใช้ form.submit() แทนการ submit อัตโนมัติ
                                        disabled={!isChanged}
                                    >
                                        บันทึกการเปลี่ยนแปลง
                                    </button>
                                <div className='nextPage'>
                                    <a href="#passwordPat">รหัสผ่าน</a>
                                </div>
                            </div>

                            <div id='passwordPat' className="password">
                                <h2>เปลี่ยนรหัสผ่าน</h2>
                                <form>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>รหัสผ่านเดิม</label>
                                            <input type="password" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>รหัสผ่านใหม่</label>
                                            <input type="password"/>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>ยืนยันรหัสผ่านใหม่</label>
                                            <input type="password" />
                                        </div>
                                    </div>
                                    <button type="submit" className="save-btn">บันทึกการเปลี่ยนแปลง</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Form>
        </motion.div>
    );

    const DeleteAccount = () => (
        <motion.div
            key="deleteAccount"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div>
                <h2>ลบบัญชีผู้ใช้</h2>
            </div>
        </motion.div>
    );

    return (
        <div className='profilePat'>
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat />
                    </div>
                    <div className="main-background">
                        <div className='content1'>
                            <div className="header">
                                <h2>ตั้งค่าบัญชีผู้ใช้</h2>
                            </div>
                            <ul className="list">
                                <li
                                    className={`list-item ${activeContent === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveContent('profile')}
                                >
                                    <span className="link-name">โปรไฟล์</span>
                                </li>
                                <li
                                    className={`list-item ${activeContent === 'editProfile' ? 'active' : ''}`}
                                    onClick={() => setActiveContent('editProfile')}
                                >
                                    <span className="link-name">แก้ไขโปรไฟล์</span>
                                </li>
                                <li
                                    className={`list-item ${activeContent === 'deleteAccount' ? 'active' : ''}`}
                                    onClick={() => setActiveContent('deleteAccount')}
                                >
                                    <span className="link-name">ลบบัญชีผู้ใช้</span>
                                </li>
                            </ul>
                        </div>
                        <div className="content2">
                            <AnimatePresence mode='wait'>
                                {activeContent === 'profile' && <Previwe />}
                                {activeContent === 'editProfile' && <EditProfile />}
                                {activeContent === 'deleteAccount' && <DeleteAccount />}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
