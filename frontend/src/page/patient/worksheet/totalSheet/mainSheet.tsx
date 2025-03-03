import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { ImBin, ImSearch } from 'react-icons/im';
import './styleSheetPat.css';
import { motion } from 'framer-motion'; // Import motion
import { useNavigate } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { Drawer, Form, message, Modal } from 'antd';
import { DeleteDiary, GetDiaryByPatientID, UpdateDiaryPat } from '../../../../services/https/diary';
import { RiEdit2Fill } from "react-icons/ri";
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { FaComment, FaLock } from "react-icons/fa6";
import { FaUnlockAlt } from 'react-icons/fa';
// global.d.ts หรือ index.d.ts
declare var require: {
    context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
        keys: () => string[];
        (id: string): any;
    };
};

function MainSheet() {
    const patID = localStorage.getItem('patientID');
    const numericPatID = patID ? Number(patID) : undefined; // แปลงเป็น number หรือ undefined ถ้าไม่มีค่า
    const [diarys, setDiarys] = useState<DiaryPatInterface[]>([]); // Default to empty array
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchDiaryByPatientID = async () => {
        const res = await GetDiaryByPatientID(Number(patID));
        if (res) {
            setDiarys(res);
            console.log("res", res)
            
        }
    };

    useEffect(() => {
        fetchDiaryByPatientID();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    const navigateToDiaryPage = (diary: DiaryPatInterface) => {
        const currentDate = dayjs();
        const startDate = dayjs(diary.Start, 'DD-MM-YYYY');
        const endDate = dayjs(diary.End, 'DD-MM-YYYY');
        
        // Check if it's not a Planning or Activity WorksheetTypeID
        if (![1, 2].includes(Number(diary.WorksheetTypeID))) {
            if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
                if (!currentDate.isSame(startDate, 'day') && !currentDate.isSame(endDate, 'day')) {
                    messageApi.error('ไม่สามารถเข้าถึงไดอารี่ เนื่องจากอยู่นอกช่วงเวลาที่กำหนด');
                    return;
                }
            }
        }
    
        let routePath = '';
        switch (diary.WorksheetTypeID) {
            case 1:
                routePath = '/Planning';
                break;
            case 2:
                routePath = '/Activity';
                break;
            case 3:
                routePath = '/Behavioural';
                break;
            case 4:
                routePath = '/CrossSectional';
                break;
            default:
                console.error('Unknown worksheet type');
                return;
        }
    
        navigate(`${routePath}?id=${diary.ID}`);
    };    
    
    // Animation variants
    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const scaleUpVariants = {
        hidden: { scale: 0.8 },
        visible: { scale: 1, transition: { duration: 0.3 } },
    };

    // Toggle popup visibility
    function toggle() {
        const blur = document.getElementById('blur') as HTMLElement;
        blur.classList.toggle('active');

        const popup = document.getElementById('popup') as HTMLElement;
        popup.classList.toggle('active');
    }

    const categorizeDiaries = () => {
        if (!diarys || diarys.length === 0) {
            return {
                planning: [],
                activity: [],
                behavioral: [],
                crossSectional: []
            };
        }
    
        return {
            planning: diarys.filter(diary => diary.WorksheetType?.Name === "Activity Planning"),  // กรองโดยใช้ WorksheetType.ID
            activity: diarys.filter(diary => diary.WorksheetType?.Name === "Activity Diary"),
            behavioral: diarys.filter(diary => diary.WorksheetType?.Name === "Behavioral Experiment"),
            crossSectional: diarys.filter(diary => diary.WorksheetType?.Name === "Cross Sectional")
        };
    };

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [diaryName, setDiaryName] = useState('');
    const [diaryPicture, setDiaryPicture] = useState('');
    const [diaryStart, setDiaryStart] = useState('');
    const [diaryEnd, setDiaryEnd] = useState('');  
    const [diaryIsPublic, setDiaryIsPublic] = useState(false);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
    const [duration, setDuration] = useState(0);
    const [editingDiary, setEditingDiary] = useState<DiaryPatInterface | null>(null);

    const [open, setOpen] = useState(false);
    const isFormValid = diaryName && selectedBook && diaryStart && diaryEnd;

    // ใช้ require.context เพื่อดึงไฟล์รูปจากโฟลเดอร์
    const imageContext = require.context('../../../../assets/book cover', false, /\.(jpg|jpeg|png)$/);
    const imageFiles = imageContext.keys().map(imageContext);

    const handleImageClick = (image: any) => {
        setDiaryPicture(image);
        setOpen(false); // Close the popup after selecting an image
        setShowDatePicker(true);
    };

    const showDrawer = () => {
        setOpen(true);
    };
    
    const onClose = () => {
        setOpen(false);
    };

    const calculateDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setDuration(Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // แสดงเป็นจำนวนวัน
    };
    

    const handleClickOutside = (event: any) => {
        if (showDatePicker && !event.target.closest('.date-picker-popup')) {
            setShowDatePicker(false);
        }
    };

    useEffect(() => {
        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    const handleEditDiary = async () => {
        console.log('Edit button clicked');
    
        try {
            const updatedDiary: DiaryPatInterface = {
                ...editingDiary,
                Name: diaryName,
                Picture: diaryPicture,
                Start: diaryStart,
                End: diaryEnd,
                IsPublic: diaryIsPublic,
            };
    
            console.log('Updating diary with data:', updatedDiary);
    
            // Send update request to the server
            const response = await UpdateDiaryPat(updatedDiary);
    
            if (response) {
                messageApi.success('อัปเดตไดอารี่สำเร็จ');
    
                // Update the diary list in the state
                setDiarys((prevDiaries) =>
                    prevDiaries.map((diary) =>
                        diary.ID === updatedDiary.ID ? updatedDiary : diary
                    )
                );
    
                // Reset states
                setEditingDiary(null);
                setDiaryName('');
                setDiaryPicture('');
                setDiaryStart('');
                setDiaryEnd('');
                setDiaryIsPublic(false);
                setShowDatePicker(false); // Close popup
            }
        } catch (error) {
            console.error('Error updating diary:', error);
            messageApi.error('เกิดข้อผิดพลาดในการอัปเดตไดอารี่');
        }
    };

    // ฟังก์ชันสำหรับเปลี่ยนค่า IsPublic
const toggleIsPublic = async (diary: DiaryPatInterface) => {
    try {
        const updatedDiary: DiaryPatInterface = {
            ...diary,
            IsPublic: !diary.IsPublic, // Toggle ค่า IsPublic
        };

        const response = await UpdateDiaryPat(updatedDiary);
        if (response) {
            messageApi.success(`เปลี่ยนสถานะไดอารี่เป็น ${updatedDiary.IsPublic ? 'สาธารณะ' : 'ส่วนตัว'} สำเร็จ`);

            // อัปเดต state
            setDiarys((prevDiaries) =>
                prevDiaries.map((item) =>
                    item.ID === updatedDiary.ID ? updatedDiary : item
                )
            );
        }
    } catch (error) {
        console.error('Error updating IsPublic:', error);
        messageApi.error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะไดอารี่');
    }
};

const handleDeleteDiary = async (diaryId: number | undefined) => {
    Modal.confirm({
        title: 'ต้องการลบไดอารี่เล่มนี้หรือไม่?',
        onOk: async () => {
            try {
                await DeleteDiary(diaryId); // ส่ง ID ไปที่ API สำหรับลบ
                messageApi.success('ลบไดอารี่สำเร็จ');
                // กรองไดอารี่ที่ไม่มี ID ตรงกับที่ถูกลบ
                setDiarys(prevDiarys => prevDiarys.filter(diary => diary.ID !== diaryId));                
            } catch (error) {
                messageApi.error('ลบไดอารี่ไม่สำเร็จ');
            }
        },
        okText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
    });
};  

    const DiaryCategory = ({ title, diaries }: { title: string; diaries: DiaryPatInterface[] }) => {
        const [hoveredDiaryID, setHoveredDiaryID] = useState<number | null>(null);
    
        return (
            <motion.div
                className="diary-category"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
            >
            <div className="diary-category">
            <motion.h3>{title}</motion.h3>
                <div className="diary-grid">
                {diaries.length > 0 ? (
                    diaries.map((diary) => (
                        <motion.div
                                key={diary.ID}
                                className="diary-card"
                                variants={scaleUpVariants}
                                initial="hidden"
                                animate="visible"
                                onMouseEnter={() => setHoveredDiaryID(diary.ID ?? 0)}
                                onMouseLeave={() => setHoveredDiaryID(null)}
                                onClick={() => navigateToDiaryPage(diary)}
                        >
                            <img 
                                className='coverBook'
                                src={diary.Picture} 
                                alt={diary.Name}
                            />
                            <div className='contentBook'>
                                <h4>{diary.Name}</h4>
                                <div className="text-sm">
                                    <p>เริ่ม: {diary.Start}</p>
                                    <p>สิ้นสุด: {diary.End}</p>
                                </div>
                            </div>
                            {/* แสดงเมนูเมื่อเมาส์โฮเวอร์ */}
                            {hoveredDiaryID === diary.ID && (
                                <div className="hover-menu">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // ป้องกันการ navigate
                                            setEditingDiary(diary); // เก็บข้อมูลของไดอารี่ที่เลือกใน state
                                            setDiaryName(diary.Name || '');
                                            setDiaryPicture(diary.Picture || '');
                                            setDiaryStart(diary?.Start ? diary.Start : '');
                                            setDiaryEnd(diary.End ? diary.End : '');
                                            setDiaryIsPublic(diary.IsPublic || false);
                                            setShowDatePicker(true); // เปิด popup
                                            console.log(dayjs(diaryStart, 'DD-MM-YYYY').toDate()); 
                                        }}
                                    >
                                        <RiEdit2Fill />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // ป้องกันการ navigate
                                            toggleIsPublic(diary); // เรียกใช้ฟังก์ชัน
                                        }}
                                    >
                                        {diary.IsPublic === true ? <FaUnlockAlt /> :<FaLock />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // ป้องกันการ navigate อัตโนมัติของการคลิก parent
                                            if (diary.WorksheetType?.Name === "Cross Sectional") {
                                                navigate(`/SheetCross?id=${diary.ID}`); // เปลี่ยนหน้าไปยัง SheetCross พร้อมส่งไอดี
                                            } else if (diary.WorksheetType?.Name === "Behavioral Experiment") {
                                                navigate(`/SheetBehav?id=${diary.ID}`); // เปลี่ยนหน้าไปยัง SheetBehav พร้อมส่งไอดี
                                            } else if (diary.WorksheetType?.Name === "Activity Diary") {
                                                navigate(`/Activity?id=${diary.ID}`); // เปลี่ยนหน้าไปยัง SheetBehav พร้อมส่งไอดี
                                            } else if (diary.WorksheetType?.Name === "Activity Planning") {
                                                navigate(`/Planning?id=${diary.ID}`); // เปลี่ยนหน้าไปยัง SheetBehav พร้อมส่งไอดี
                                            }else {
                                                messageApi.error('ไม่รองรับประเภทไดอารี่นี้'); // แจ้งเตือนหากเป็นประเภทอื่น
                                            }
                                        }}
                                    >
                                        <FaComment />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDiary(diary.ID); // เรียกใช้ฟังก์ชันลบเมื่อคลิก
                                        }}
                                    >
                                        <ImBin />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-diary-message">
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <div className="Loading-Data-Search"></div>
                            <div className='text'>ไม่มีไดอารี่ของประเภทนี้...</div>
                        </div>
                    </div>
                )}
                </div>
            </div>
            </motion.div>
        );
    };
    
    return (
        <motion.div
            className='mainSheet'
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
        >
            {contextHolder} {/* Make sure this line is present */}
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat />
                    </div>
                    <div className="main-background">
                        <div className="main-content">
                            <div className='bg-content'>
                                <div className="header">
                                    <motion.div
                                            className='on'
                                            variants={scaleUpVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                        <h2>My Book</h2>
                                    </motion.div>
                                    <div className="labelSearch">
                                        <input
                                            className='searchBook'
                                            type="text"
                                            placeholder="ค้นหาหนังสือของคุณ"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)} // อัปเดตค่าคำค้นหา
                                        />
                                        <i className="searchIcon"><ImSearch /></i>
                                    </div>                                   
                                </div>
                                
                                {/* Display categorized diary entries */}
                                <motion.div
                                    className="diary-categories"
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                {[
                                    { title: "Planning Diary", diaries: categorizeDiaries().planning },
                                    { title: "Activity Diary", diaries: categorizeDiaries().activity },
                                    { title: "Behavioral Diary", diaries: categorizeDiaries().behavioral },
                                    { title: "Cross Sectional Diary", diaries: categorizeDiaries().crossSectional }
                                ]
                                    .filter(category => category.diaries.length > 0) // คัดกรองหมวดหมู่ที่มีข้อมูล
                                    .map(category => (
                                        <DiaryCategory 
                                            key={category.title}
                                            title={category.title} 
                                            diaries={category.diaries.filter(diary =>
                                                diary.Name?.toLowerCase().includes(searchQuery.toLowerCase())
                                            )}
                                        />
                                ))}

                                {[
                                    { title: "Planning Diary", diaries: categorizeDiaries().planning },
                                    { title: "Activity Diary", diaries: categorizeDiaries().activity },
                                    { title: "Behavioral Diary", diaries: categorizeDiaries().behavioral },
                                    { title: "Cross Sectional Diary", diaries: categorizeDiaries().crossSectional }
                                ].every(category => category.diaries.length === 0) && (
                                    <div style={{ width: '100%', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <div className="Loading-Data"></div>
                                        <div className='text'>ไม่มีข้อมูล...</div>
                                    </div>
                                )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup for Search */}
            <div id='popup'>
                <div className='compo-search'>
                    {/* <SearchPat patID={numericPatID} /> */}
                    <a href="#" className='btn-close' onClick={toggle}>Close</a>
                </div>
            </div>
            { showDatePicker && (
            <div className="bg-popup" onClick={handleClickOutside}>
                <div className="date-picker-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="date-picker-content">
                        <div className="left-column">
                            <div className="book-item">
                                <div className="img-book">
                                    {diaryPicture ? (
                                        <img
                                            src={diaryPicture}
                                            onClick={showDrawer} 
                                            alt="Selected"
                                        />
                                    ) : (
                                        <img
                                            src="default-image-url"
                                            onClick={showDrawer} 
                                            alt="Selected"
                                        />
                                    )}
                                </div>
                                <p className="text">สามารถคลิกที่รูปเพื่อเปลี่ยนรูปได้</p>
                            </div>
                        </div>
                        <div className="right-column">
                            <div className="input-group">
                                <label>ชื่อไดอารี่</label>
                                <input
                                    required
                                    className="nameBook"
                                    type="text"
                                    value={diaryName}
                                    onChange={(e) => setDiaryName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>วันเริ่มต้น</label>
                                <DatePicker
                                    calendarClassName="custom-calendar"
                                    selected={diaryStart ? dayjs(diaryStart, 'DD-MM-YYYY').toDate() : undefined}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            setDiaryStart(dayjs(date).format('DD-MM-YYYY')); // Format the date as needed
                                        }
                                    }}                                                                    
                                    selectsStart
                                    startDate={diaryStart ? dayjs(diaryStart, 'DD-MM-YYYY').toDate() : undefined}  // Convert diaryStart to Date if it's a string
                                    endDate={diaryEnd ? dayjs(diaryEnd, 'DD-MM-YYYY').toDate() : undefined}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()} // ไม่อนุญาตให้เลือกวันที่ย้อนหลัง
                                />
                            
                            </div>
                            <div className="input-group">
                            <label>วันสิ้นสุด</label>
                            <DatePicker
                                calendarClassName="custom-calendar"
                                selected={diaryEnd ? dayjs(diaryEnd, 'DD-MM-YYYY').toDate() : undefined}
                                onChange={(date: Date | null) => {
                                    setDiaryEnd(dayjs(date ?? new Date()).format('DD-MM-YYYY'));
                                    if (diaryEnd && date) {
                                        calculateDuration(dayjs(diaryStart, 'DD-MM-YYYY').toDate(), date);
                                    }
                                }}                                
                                selectsEnd
                                startDate={diaryStart ? dayjs(diaryStart, 'DD-MM-YYYY').toDate() : undefined}  // Convert diaryStart to Date if it's a string
                                endDate={diaryEnd ? dayjs(diaryEnd, 'DD-MM-YYYY').toDate() : undefined} // Pass diaryEnd as Date
                                minDate={diaryStart ? dayjs(diaryStart, 'DD-MM-YYYY').toDate() : undefined}  // Set minimum date to diaryStart
                                dateFormat="dd/MM/yyyy"  // Format the date for display
                            />
                            
                        </div>
                            <div className="input-group">
                                <label>จำนวนวัน</label>
                                <input type="text" value={`${duration} วัน`} readOnly />
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn-submit"
                        onClick={() => handleEditDiary()}
                    >
                        ยืนยันการแก้ไข
                    </button>

                </div>
            </div>
        )}
            <Drawer title="เลือกภาพปก" onClose={onClose} open={open}>
                <div className='bgCover'
                    style={{marginLeft: '70px'}}
                    >
                    {imageFiles.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Cover ${index + 1}`}
                            onClick={() => handleImageClick(image)}
                            style={{ cursor: 'pointer', width: '200px', height: '300px', marginBottom: '40px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}
                        />
                    ))}
                </div>
            </Drawer>          
        </motion.div>
    );
}

export default MainSheet;