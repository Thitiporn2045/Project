import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal } from 'antd'; // นำเข้าองค์ประกอบที่ใช้จาก Ant Design
import './stylePat.css'; // นำเข้าไฟล์ CSS สำหรับการจัดแต่งหน้าตา
import { CreateDiaryPat, GetEmotionByPatientID } from '../../services/https/emotion/emotion'; // ฟังก์ชันในการดึงข้อมูลอารมณ์ของผู้ป่วยจาก API
import { EmtionInterface } from '../../interfaces/emotion/IEmotion'; // นำเข้าอินเทอร์เฟซที่ใช้ในการจัดการข้อมูลอารมณ์


type AddEmotion = {
    ColorCode: string; // สีของอารมณ์
    Emoticon: string; // อีโมจิที่แสดงถึงอารมณ์
};

const addEmotions: AddEmotion[] = [ // รายการอารมณ์เริ่มต้นที่สามารถเลือกได้
    { ColorCode: '#A8E6CE', Emoticon: '😊' }, // อารมณ์ "Happy"
    { ColorCode: '#FF91AE', Emoticon: '😡' }, // อารมณ์ "Angry"
    { ColorCode: '#F4ED7F', Emoticon: '😕' }, // อารมณ์ "Confused"
    { ColorCode: '#B78FCB', Emoticon: '😢' }, // อารมณ์ "Sad"
];

const EmotionalWeb = () => { // คอมโพเนนต์หลักที่แสดงอารมณ์
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
    const [selectedEmotion, setSelectedEmotion] = useState<AddEmotion | null>(null); // สถานะเก็บอารมณ์ที่ถูกเลือก
    const [newEmotionLabel, setNewEmotionLabel] = useState<string>(''); // สถานะเก็บชื่อใหม่ของอารมณ์
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // สถานะควบคุมการแสดงผล Modal
    const [messageApi, contextHolder] = message.useMessage();


    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage

    // ฟังก์ชันดึงข้อมูลอารมณ์จาก API โดยใช้ patientID
    const fetchEmotionPatientData = async () => {
        const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
        if (res) {
            setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
        }
        console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
    };

    // useEffect เพื่อเรียกใช้ฟังก์ชัน fetchEmotionPatientData เมื่อคอมโพเนนต์นี้ถูกแสดง
    useEffect(() => {
        fetchEmotionPatientData();
    }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง

    // ฟังก์ชันที่ทำงานเมื่อผู้ใช้เลือกอารมณ์
    const handleSelectEmotion = (emotion: AddEmotion) => {
        setSelectedEmotion(emotion); // ตั้งค่าอารมณ์ที่เลือก
    };

    const handleAddEmotion = async () => {
        if (selectedEmotion && newEmotionLabel) {
            const newEmotion = {
                Emoticon: selectedEmotion.Emoticon,
                ColorCode: selectedEmotion.ColorCode,
                Name: newEmotionLabel,
                PatID: patID ? Number(patID) : undefined,
            };
    
            try {
                console.log('New Emotion:', newEmotion);
                const response = await CreateDiaryPat(newEmotion);
                console.log('API Response:', response);

                if (response) {
                    messageApi.success('อารมณ์ถูกเพิ่มเรียบร้อย');
                    fetchEmotionPatientData(); // รีเฟรชข้อมูลอารมณ์ของผู้ป่วย
                } else {
                    messageApi.error('ไม่สามารถเพิ่มอารมณ์ได้');
                }
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error adding emotion:', error);
                messageApi.error('เกิดข้อผิดพลาดในการเพิ่มอารมณ์');
            }
        } else {
            messageApi.warning('กรุณาเลือกอารมณ์และตั้งชื่อ');
        }
    };    
    

    return (
        <div className="emotional-web" style={{ backgroundColor: selectedEmotion?.ColorCode }}> {/* คอมโพเนนต์หลัก */}
        {contextHolder}
            <div className="main-bg"> {/* แบ็คกราวด์หลัก */}
                <div className="bg-left"> {/* ส่วนแสดงอารมณ์ที่ผู้ป่วยมี */}
                    <h2>อารมณ์ของคุณ</h2>
                    <div className="emoji-grid"> {/* แสดงตารางอีโมจิ */}
                        {emotionPatients.length === 0 ? (
                            <div 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <div className="Loading-Data"></div>
                                <div className="text">ไม่มีข้อมูล...</div>
                            </div>
                        ) : (
                            emotionPatients.map((emotion, index) => ( 
                                <div
                                    key={index}
                                    className="emoji"
                                    style={{ backgroundColor: emotion.ColorCode }} // กำหนดสีพื้นหลังจากข้อมูลของอารมณ์
                                >
                                    {emotion.Emoticon} {/* แสดงอีโมจิ */}
                                    <span>{emotion.Name}</span> {/* แสดงชื่อของอารมณ์ */}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-right"> {/* ส่วนแสดงอารมณ์ที่สามารถเลือกได้ */}
                    <div className="emotion-container" style={{ backgroundColor: selectedEmotion?.ColorCode }}>
                    <h2>เลือกอารมณ์ที่คุณต้องการจะสร้าง</h2>
                        <div className="emotion-card">
                        {/* Large Emoji Display */}
                        <div className="large-emoji">
                            {selectedEmotion ? (
                                <>
                                    <div className="emoji-circle" style={{ backgroundColor: selectedEmotion.ColorCode }}>
                                        <span className="emoji-large">{selectedEmotion.Emoticon}</span>
                                    </div>
                                    <div>ชื่ออารมณ์</div> {/* ชื่ออารมณ์ */}
                                </>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        
                                    }}
                                >
                                    <div className="Loading-Data"></div>
                                    <div className="text">ยังไม่ได้เลือกอิโมจิ...</div>
                                </div>
                            )}
                        </div>
                        {/* Emotions Grid */}
                        <div className="emotion-grid">
                        {addEmotions.map((emotion, index) => (
                            <button
                            key={index}
                            className="emotion-button"
                            style={{ backgroundColor: emotion.ColorCode }}
                            onClick={() => handleSelectEmotion(emotion)} // เรียกฟังก์ชันเมื่อเลือกอารมณ์
                            >
                            <span className="emoji-small">{emotion.Emoticon}</span>
                            </button>
                        ))}
                        </div>

                        {/* Create Emotion Button */}
                        <div className="create-emotion">
                        <button 
                            className="create-emotion-btn" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            สร้างอารมณ์
                        </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <Modal
                title="ตั้งชื่ออารมณ์ของคุณ"
                visible={isModalOpen}
                onOk={handleAddEmotion}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input
                    placeholder="ใส่ชื่ออารมณ์..."
                    value={newEmotionLabel}
                    onChange={(e) => setNewEmotionLabel(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default EmotionalWeb;
