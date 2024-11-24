import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { ImBin, ImSearch } from 'react-icons/im';
import './styleSheetPat.css';
import SearchPat from '../../../../component/searchPat/searchPat';
import { useNavigate } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { Drawer, Form, message } from 'antd';
import { GetDiaryByPatientID, UpdateDiaryPat } from '../../../../services/https/diary';
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

    // Function to navigate based on the WorksheetTypeID
    const navigateToDiaryPage = (diary: DiaryPatInterface) => {
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

    

    const DiaryCategory = ({ title, diaries }: { title: string; diaries: DiaryPatInterface[] }) => {
        const [hoveredDiaryID, setHoveredDiaryID] = useState<number | null>(null);
    
        return (
            <div className="diary-category">
                <h3>{title}</h3>
                <div className="diary-grid">
                {diaries.length > 0 ? (
                    diaries.map((diary) => (
                        <div
                            key={diary.ID}
                            className="diary-card"
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
                                        {diary.IsPublic === true ? <FaLock /> : <FaUnlockAlt />}
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                    }}>
                                        <FaComment />
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                    }}>
                                        <ImBin />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-diary-message">
                        ยังไม่มีไดอารี่ในหมวดหมู่นี้
                    </div>
                )}
                </div>
            </div>
        );
    };
    
    return (
        <div className='mainSheet'>
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
                                    <div className='on'>
                                        <h2>My Book</h2>
                                    </div>
                                    <div className="labelSearch">
                                        <input
                                            className='searchBook'
                                            type="text"
                                            placeholder="ค้นหาหนังสือของคุณ"
                                            onClick={toggle}
                                        />
                                        <i className="searchIcon"><ImSearch /></i>
                                    </div>                                   
                                </div>
                                
                                {/* Display categorized diary entries */}
                                <div className="diary-categories">
                                    {[
                                        { title: "Planning Diary", diaries: categorizeDiaries().planning },
                                        { title: "Activity Diary", diaries: categorizeDiaries().activity },
                                        { title: "Behavioral Diary", diaries: categorizeDiaries().behavioral },
                                        { title: "Cross Sectional Diary", diaries: categorizeDiaries().crossSectional }
                                    ]
                                        .filter(category => category.diaries.length > 0)
                                        .map(category => (
                                            <DiaryCategory 
                                                key={category.title}
                                                title={category.title} 
                                                diaries={category.diaries}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup for Search */}
            <div id='popup'>
                <div className='compo-search'>
                    <SearchPat />
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
                                />
                            
                            </div>
                            <div className="input-group">
                            <label>วันสิ้นสุด</label>
                            <DatePicker
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
            
        </div>
    );
}

export default MainSheet;

