import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImg from '../../../assets/book cover/cover7.jpg'
import './stylePat.css';
import { WorksheetTypeInterface } from '../../../interfaces/worksheetType/IWorksheetType';
import { ListWorkSheetType } from '../../../services/https/workSheetType/workSheetType';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { CreateDiaryPat } from '../../../services/https/diary';
import { Button, Drawer, message } from 'antd';
import dayjs from 'dayjs';

    // global.d.ts หรือ index.d.ts
    declare var require: {
        context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
            keys: () => string[];
            (id: string): any;
        };
    };

function Worksheets() {
    const [messageApi, contextHolder] = message.useMessage();
    const [diaryName, setDiaryName] = useState('');
    const [diaryPicture, setDiaryPicture] = useState('');
    const [diaryStart, setDiaryStart] = useState(new Date());
    const [diaryEnd, setDiaryEnd] = useState(new Date());
    const [diaryIsPublic, setDiaryIsPublic] = useState(false);
    const patID = localStorage.getItem('patientID');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState(0);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
    const [worksheets, setWorksheets] = useState<WorksheetTypeInterface[]>([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState<WorksheetTypeInterface | null>(null);
    const isFormValid = diaryName && selectedBook && diaryStart && diaryEnd;
    const navigate = useNavigate();

    // ใช้ require.context เพื่อดึงไฟล์รูปจากโฟลเดอร์
    const imageContext = require.context('../../../assets/book cover', false, /\.(jpg|jpeg|png)$/);
    const imageFiles = imageContext.keys().map(imageContext);

    const handleImageClick = (image: any) => {
        setDiaryPicture(image);
        setOpen(false); // Close the popup after selecting an image
        setShowDatePicker(true);
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    
    const onClose = () => {
        setOpen(false);
    };

    const fetchWorksheetData = async () => {
        const res = await ListWorkSheetType();
        if (res) {
            setWorksheets(res);
            setSelectedWorksheet(res[0] || null); // Set the first item as default
        }
    };

    useEffect(() => {
        fetchWorksheetData();
    }, []);

    const convertImageToBase64 = (imageUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // ถ้ารูปภาพเป็น cross-origin
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const base64Image = canvas.toDataURL();
                    resolve(base64Image);
                } else {
                    reject('Canvas context is null');
                }
            };
            img.onerror = (error) => reject(error);
            img.src = imageUrl;
        });
    };
    
    const handleSaveNote = async () => {
        if (!diaryPicture) {
            messageApi.error("กรุณาเลือกภาพ");
            return;
        }

        // แปลงภาพที่เลือกให้เป็น Base64
        const base64Image = await convertImageToBase64(diaryPicture);

        const diaryData: DiaryPatInterface = {
            Name: diaryName,
            Picture: base64Image as string,  // แปลง Picture เป็น string
            Start: dayjs(diaryStart).format('DD-MM-YYYY'),
            End: dayjs(diaryEnd).format('DD-MM-YYYY'),
            IsPublic: diaryIsPublic,
            WorksheetTypeID: selectedBook || 0,
            PatID: Number(patID),
        };

        const res = await CreateDiaryPat(diaryData);
        if (res) {
            messageApi.success("สร้างแล้ว");
            setTimeout(() => {
                navigate('/mainSheet');
            }, 1000);
            resetForm();
        } else {
            messageApi.error("เกิดข้อผิดพลาดในการสร้าง");
        }
    };

    const resetForm = () => {
        setDiaryName('');
        setDiaryStart(new Date());
        setDiaryEnd(new Date());
        setDiaryIsPublic(false);
        setDiaryPicture('');
        setSelectedBook(null);
    };

    const calculateDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setDuration(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    const handleThumbnailClick = (worksheet: WorksheetTypeInterface) => {
        setSelectedWorksheet(worksheet);
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

    return (
        <div className={`worksheets ${showDatePicker ? 'show-blur-background' : ''}`}>
            {contextHolder}
            <div className="main-body">
                <div className='sidebar'>
                    <NavbarPat />
                </div>
                <div className="main-background">
                    <div className="bg-content">
                        <div className="content-img">
                            {selectedWorksheet && (
                                <img 
                                    src={selectedWorksheet.Picture} 
                                    alt={selectedWorksheet.Name}
                                    style={{ opacity: 1, transition: 'opacity 0.5s' }}
                                />
                            )}
                        </div>
                        <div className="content-text">
                            {selectedWorksheet && (
                                <>
                                    <h2>{selectedWorksheet.Name}</h2>
                                    <p>{selectedWorksheet.Description}</p>
                                    <button className="btn" onClick={() => setShowDatePicker(true)}>
                                        <span>เริ่มสร้าง</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="thumbnail">
                        {worksheets.map((item) => (
                            <div 
                                key={item.ID}
                                className={`thumbnail-item ${selectedWorksheet?.ID === item.ID ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.NumberType}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showDatePicker && (
                <div className='bg-popup' onClick={handleClickOutside}>
                    <div className="date-picker-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="date-picker-content">
                            <div className="left-column">
                                <div className='book-item'>
                                    <div className="img-book">
                                    {diaryPicture ? (
                                        <img 
                                            src={diaryPicture}
                                            onClick={showDrawer} 
                                            alt="Selected" />
                                    ) : (
                                        <img 
                                            src={defaultImg}
                                            onClick={showDrawer} 
                                            alt="Selected" />
                                    )}
                                    </div>
                                    <p className='text'>สามารถคลิกที่รูปเพื่อเปลี่ยนรูปได้</p>
                                    <div className="head">
                                        <input 
                                            required
                                            className='nameBook' 
                                            type="text" 
                                            placeholder="ชื่อไดอารี่"
                                            value={diaryName}
                                            onChange={(e) => setDiaryName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="right-column">
                                <div className="input-group">
                                    <label>ยืนยันแบบฟอร์มของคุณ</label>
                                    <select 
                                        className='typeBook'
                                        value={selectedBook ?? ''}
                                        onChange={(e) => setSelectedBook(Number(e.target.value))}
                                    >
                                        <option value="" disabled hidden>เลือกแบบฟอร์ม</option>
                                        {worksheets.map((item) => (
                                            <option value={item.ID} key={item.ID}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>วันเริ่มต้น</label>
                                    <DatePicker
                                        selected={diaryStart}
                                        onChange={(date: Date | null) => {
                                            if (date) setDiaryStart(date);
                                        }}
                                        selectsStart
                                        startDate={diaryStart}
                                        endDate={diaryEnd}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>วันสิ้นสุด</label>
                                    <DatePicker
                                        selected={diaryEnd}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                                setDiaryEnd(date);
                                                calculateDuration(diaryStart, date);
                                            }
                                        }}
                                        selectsEnd
                                        startDate={diaryStart}
                                        endDate={diaryEnd}
                                        minDate={diaryStart}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>จำนวนวัน</label>
                                    <input type="text" value={`${duration} วัน`} readOnly />
                                </div>
                            </div>
                        </div>
                        <button className='btn-submit' onClick={handleSaveNote} disabled={!isFormValid}>
                            สร้างโน้ต
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

export default Worksheets;
