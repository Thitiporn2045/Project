import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Input, message, Modal } from 'antd'; // นำเข้าองค์ประกอบที่ใช้จาก Ant Design
import './stylePat.css'; // นำเข้าไฟล์ CSS สำหรับการจัดแต่งหน้าตา
import { CreateDiaryPat, GetEmotionByPatientID, UpdateEmotionByID, DeleteEmtionByID } from '../../services/https/emotion/emotion'; // ฟังก์ชันในการดึงข้อมูลอารมณ์ของผู้ป่วยจาก API
import { EmtionInterface } from '../../interfaces/emotion/IEmotion'; // นำเข้าอินเทอร์เฟซที่ใช้ในการจัดการข้อมูลอารมณ์
import { RiEdit2Fill } from 'react-icons/ri';
import { ImBin } from 'react-icons/im';
import NavbarPat from '../navbarPat/navbarPat';


type AddEmotion = {
    ColorCode: string; // สีของอารมณ์
    Emoticon: string; // อีโมจิที่แสดงถึงอารมณ์
};

const addEmotions: AddEmotion[] = [
    // โกรธ (Angry)
    { ColorCode: '#FF7171', Emoticon: '😡' }, // โกรธ
    { ColorCode: '#FF7F7F', Emoticon: '😠' }, // หงุดหงิด
    { ColorCode: '#FF9090', Emoticon: '😤' }, // รำคาญ

    // ภูมิใจ (Pride)
    { ColorCode: '#FFD875', Emoticon: '😌' }, // ภูมิใจ
    { ColorCode: '#FFE798', Emoticon: '😊' }, // ยินดี

    // สุข (Happy)
    { ColorCode: '#F7E971', Emoticon: '😄' }, // สุข
    { ColorCode: '#FFEC8C', Emoticon: '😂' }, // หัวเราะ

    // สนใจ (Interested)
    { ColorCode: '#B7EFFF', Emoticon: '🤩' }, // ตื่นเต้น
    { ColorCode: '#A0E3FF', Emoticon: '🤔' }, // สงสัย

    // มั่นใจ (Confident)
    { ColorCode: '#94CDFF', Emoticon: '😎' }, // มั่นใจ
    { ColorCode: '#93DBFF', Emoticon: '😇' }, // ปลอดภัย

    // รัก/ชอบ (Love)
    { ColorCode: '#FF9BCB', Emoticon: '🥰' }, // รัก
    { ColorCode: '#FF91AE', Emoticon: '😘' }, // อบอุ่น
    { ColorCode: '#FAA7C0', Emoticon: '😳' }, // อาย

    // สันติ (Peaceful)
    { ColorCode: '#ADEED5', Emoticon: '😌' }, // สงบ
    { ColorCode: '#B2F3E7', Emoticon: '🧘‍♀️' }, // ผ่อนคลาย

    // อับอาย (Embarrassed)
    { ColorCode: '#C7F8BF', Emoticon: '😅' }, // กระอักกระอ่วน

    // เสียใจ (Sad)
    { ColorCode: '#AFDAFF', Emoticon: '😢' }, // เสียใจ
    { ColorCode: '#97B9F0', Emoticon: '😭' }, // ร้องไห้

    // ประหลาดใจ (Surprised)
    { ColorCode: '#C1E6FF', Emoticon: '😮' }, // ตกใจ
    { ColorCode: '#ACD6F8', Emoticon: '😱' }, // ช็อค

    // กลัว (Fear)
    { ColorCode: '#B7C3FF', Emoticon: '😨' }, // กลัว
    { ColorCode: '#A8B4F7', Emoticon: '😰' }, // หวาดหวั่น

    // รังเกียจ (Disgusted)
    { ColorCode: '#E1C6F7', Emoticon: '😒' }, // รังเกียจ
    { ColorCode: '#B78FCB', Emoticon: '😩' }, // ขยะแขยง
];



const EmotionalWeb = () => { // คอมโพเนนต์หลักที่แสดงอารมณ์
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
    const [selectedEmotion, setSelectedEmotion] = useState<AddEmotion | null>(null); // สถานะเก็บอารมณ์ที่ถูกเลือก
    const [selectedEmotionEdit, setSelectedEmotionEdit] = useState<EmtionInterface | null>(null); // สถานะเก็บอารมณ์ที่ถูกเลือก
    const [newEmotionLabel, setNewEmotionLabel] = useState<string>(''); // สถานะเก็บชื่อใหม่ของอารมณ์
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // สถานะควบคุมการแสดงผล Modal
    const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false); // สถานะควบคุมการแสดงผล Modal
    const [messageApi, contextHolder] = message.useMessage();
    const [hoveredEmotionID, setHoveredEmotionID] = useState<number | null>(null);

    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage

    // ฟังก์ชันดึงข้อมูลอารมณ์จาก API โดยใช้ patientID
    const fetchEmotionPatientData = async () => {
        const res = await GetEmotionByPatientID(Number(patID)); 
        if (res) {
          setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
          console.log('Fetched emotions:', res); // แสดงข้อมูลอารมณ์ที่ได้รับ
        }
    };
    

    // useEffect เพื่อเรียกใช้ฟังก์ชัน fetchEmotionPatientData เมื่อคอมโพเนนต์นี้ถูกแสดง
    useEffect(() => {
        fetchEmotionPatientData();
    }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง

    useEffect(() => {
        if (isModalOpen) {
            const nameEmotionInput = document.querySelector('.nameEmotionInput') as HTMLInputElement;
            const nameEmotion = document.querySelector('.nameEmotion') as HTMLDivElement;
    
            if (nameEmotionInput && nameEmotion) {
                const updateName = () => {
                    nameEmotion.innerText = nameEmotionInput.value;
                };
                nameEmotionInput.addEventListener('input', updateName);
    
                return () => {
                    nameEmotionInput.removeEventListener('input', updateName);
                };
            }
        }
    }, [isModalOpen]);    

    const handleSelectEmotionEdit = (emotionPatients: EmtionInterface) => {
        setSelectedEmotionEdit(emotionPatients);
        setIsModalEditOpen(true);
    }

    // ฟังก์ชันที่ทำงานเมื่อผู้ใช้เลือกอารมณ์
    const handleSelectEmotion = (emotion: AddEmotion) => {
        setSelectedEmotion(emotion);
        setNewEmotionLabel(''); // เคลียร์ชื่อเมื่อเลือกอารมณ์ใหม่
    };    

    const handleAddEmotion = async () => {
        if (selectedEmotion && newEmotionLabel.trim()) {
            // เพิ่ม `.trim()` เพื่อป้องกันชื่ออารมณ์ว่าง
            const newEmotion = {
                Emoticon: selectedEmotion.Emoticon,
                ColorCode: selectedEmotion.ColorCode,
                Name: newEmotionLabel.trim(),
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
    
    const handleEditEmotion = async () => {
        if (selectedEmotionEdit && newEmotionLabel) {
            const updatedEmotion = {
                ...selectedEmotionEdit,
                Name: newEmotionLabel, // ชื่ออารมณ์ใหม่
            };
    
            try {
                console.log('Updating Emotion:', updatedEmotion);
                const response = await UpdateEmotionByID(updatedEmotion); // เรียก API สำหรับการอัปเดต
                console.log('API Response:', response);
    
                if (response) {
                    messageApi.success('อารมณ์ถูกแก้ไขเรียบร้อย');
                    fetchEmotionPatientData(); // โหลดข้อมูลใหม่จาก API
                    setIsModalEditOpen(false); // ปิด Modal
                } else {
                    messageApi.error('ไม่สามารถแก้ไขอารมณ์ได้');
                }
            } catch (error) {
                console.error('Error editing emotion:', error);
                messageApi.error('เกิดข้อผิดพลาดในการแก้ไขอารมณ์');
            }
        } else {
            messageApi.warning('กรุณาเลือกอารมณ์และตั้งชื่อใหม่');
        }
    };

    const handleDeleteEmotion = async (emotionID: number | undefined) => {
        if (!emotionID) return;
        Modal.confirm({
            title: 'ต้องการลบอารมณ์นี้หรือไม่?',
            onOk: async () => {
                try {
                    // เรียก API เพื่อลบอารมณ์
                    const response = await DeleteEmtionByID(emotionID);
                    if (response) {
                        messageApi.success('อารมณ์ถูกลบเรียบร้อย');
                        fetchEmotionPatientData(); // รีเฟรชข้อมูล
                    } else {
                        messageApi.error('ไม่สามารถลบอารมณ์ได้');
                    }
                } catch (error) {
                    console.error('Error deleting emotion:', error);
                    messageApi.error('เกิดข้อผิดพลาดในการลบอารมณ์');
                }
            },
            okText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
        });
    };
    
    

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9BA5F6',
                },
            }}
        >
        <div className="emotional-web"> {/* คอมโพเนนต์หลัก */}
        {contextHolder}
            <div className="main-bg"> {/* แบ็คกราวด์หลัก */}
            <div className='sidebar'>
                            <NavbarPat></NavbarPat>
                        </div>
            <div className="bg-left"> {/* ส่วนแสดงอารมณ์ที่ผู้ป่วยมี */}
                <div className="emotion-container">
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
                                    flexDirection: 'column',
                                    marginLeft: '10rem',
                                }}
                            >
                                <div className="Loading-Data-Self"></div>
                                <div className="text">ไม่มีข้อมูล...</div>
                            </div>
                        ) : (
                            emotionPatients.map((emotion, index) => ( 
                                <div
                                    key={index}
                                    className="emoji"
                                    style={{ backgroundColor: emotion.ColorCode }}
                                    onMouseEnter={() => setHoveredEmotionID(emotion.ID ?? null)} // Use null as a fallback for undefined
                                    onMouseLeave={() => setHoveredEmotionID(null)}
                                >
                                    {emotion.Emoticon} {/* แสดงอีโมจิ */}
                                    <span>{emotion.Name}</span> {/* แสดงชื่อของอารมณ์ */}
                                    {hoveredEmotionID === emotion.ID && (
                                        <div className="hover-menu">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // ป้องกันการ navigate
                                                    handleSelectEmotionEdit(emotion); // เรียกฟังก์ชันแก้ไข
                                                }}
                                                style={{
                                                    color: emotion?.ColorCode,
                                                    transition: '.3s'
                                                }}
                                            >
                                                <RiEdit2Fill />
                                            </button>

                                            <button
                                                style={{
                                                    color: emotion?.ColorCode,
                                                    transition: '.3s'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // เรียกฟังก์ชันลบ (ถ้ายังไม่มีสามารถสร้างได้)
                                                    handleDeleteEmotion(emotion.ID); 
                                                }}
                                            >
                                                <ImBin />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>


                <div className="bg-right" style={{ backgroundColor: selectedEmotion?.ColorCode }}> {/* ส่วนแสดงอารมณ์ที่สามารถเลือกได้ */}
                    <div className="emotion-container">
                    <h2
                        style={{
                            color: selectedEmotion ? '#fff' : '#333f60', // สีตัวหนังสือ
                            textShadow: selectedEmotion 
                                ? '1px 1px 2px rgba(192, 192, 192, 0.8)' // เพิ่มเงาเมื่อเป็นสีขาว
                                : 'none' // ไม่มีเงาเมื่อเป็นสีอื่น
                        }}
                    >
                        เลือกอารมณ์ที่คุณต้องการจะสร้าง
                    </h2>
                        <div className="emotion-card">
                        {/* Large Emoji Display */}
                        <div className="large-emoji">
                            {selectedEmotion ? (
                                <>
                                    <div className="emoji-circle">
                                        <span className="emoji-large">{selectedEmotion.Emoticon}</span>
                                    </div>
                                    <div className='nameEmotion'>ชื่ออารมณ์</div> {/* ชื่ออารมณ์ */}
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
                                        transition: '.3s'
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
                                    style={{
                                        backgroundColor: selectedEmotion?.Emoticon === emotion.Emoticon ? '#FFFFFF' : emotion.ColorCode,
                                        transition: '.3s'
                                    }}
                                    onClick={() => handleSelectEmotion(emotion)}
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
                    className='nameEmotionInput'
                    placeholder="ใส่ชื่ออารมณ์..."
                    value={newEmotionLabel}
                    onChange={(e) => setNewEmotionLabel(e.target.value)}
                />
            </Modal>

            <Modal
                title="แก้ไขอารมณ์"
                visible={isModalEditOpen}
                onOk={handleEditEmotion} // เรียกใช้ฟังก์ชันแก้ไขเมื่อผู้ใช้กดปุ่มตกลง
                onCancel={() => setIsModalEditOpen(false)} // ปิด Modal
            >
                <Input
                    className='editName'
                    placeholder="ใส่ชื่ออารมณ์ใหม่..."
                    value={newEmotionLabel} // ชื่อใหม่ของอารมณ์
                    onChange={(e) => setNewEmotionLabel(e.target.value)} // เก็บค่าที่ผู้ใช้พิมพ์
                />
            </Modal>
        </div>
        </ConfigProvider>
    );
};

export default EmotionalWeb;
