import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import './stylePat.css';

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
                                        <div className="firstname">{userLogin.name}</div>
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
                                            <label className="label-wrapper"><p>{userLogin.birthDate}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>เบอร์โทรศัพท์:</strong>
                                            <label className="label-wrapper"><p>{userLogin.phone}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>อีเมล:</strong>
                                            <label className="label-wrapper"><p>{userLogin.email}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>สถานะ:</strong>
                                            <label className="label-wrapper"><p>{userLogin.drug}</p></label>
                                        </div>
                                        <div className="row">
                                            <strong>นักจิตของคุณ:</strong>
                                            <label className="label-wrapper"><p>{userLogin.therapist}</p></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="infoPsy">
                                    <div className="head">
                                        <img src={userLogin.imge} alt="therapist" className="pro" />
                                        <strong>{userLogin.therapist}</strong>
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
            <div className="edit-profile">
                <div className="imgBox">
                    <div className="profile">
                        <div className="cardbg">
                            <div className="name">
                                <h2>รูปโปรไฟล์</h2>
                            </div>
                            <div className="user-profile">
                                <img src={userLogin.imge} alt="profile" className="pro" />
                            </div>
                            <label htmlFor="input-file" id="label">
                                เปลี่ยนรูปโปร์ไฟล์
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="input-file"
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
                                    <strong>ชื่อ:</strong>
                                    <label className="label-wrapper"><p>{userLogin.name}</p></label>
                                </div>
                                <div className="row">
                                    <strong>วันเกิด:</strong>
                                    <label className="label-wrapper"><p>{userLogin.birthDate}</p></label>
                                </div>
                                <div className="row">
                                    <strong>เบอร์โทรศัพท์:</strong>
                                    <label className="label-wrapper"><p>{userLogin.phone}</p></label>
                                </div>
                                <div className="row">
                                    <strong>อีเมล:</strong>
                                    <label className="label-wrapper"><p>{userLogin.email}</p></label>
                                </div>
                                <div className="row">
                                    <strong>สถานะ:</strong>
                                    <label className="label-wrapper"><p>{userLogin.drug}</p></label>
                                </div>
                                <button type="submit" className="save-changes-btn">บันทึกการเปลี่ยนแปลง</button>
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
