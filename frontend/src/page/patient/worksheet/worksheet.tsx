import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt, FaUnlockAlt } from "react-icons/fa";
import 'react-datepicker/dist/react-datepicker.css';

import './stylePat.css';
import { WorksheetTypeInterface } from '../../../interfaces/worksheetType/IWorksheetType';
import { ListWorkSheetType } from '../../../services/https/workSheetType/workSheetType';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { CreateDiaryPat } from '../../../services/https/diary';
import { message } from 'antd';
import dayjs from 'dayjs';

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

    const handleSaveNote = async () => {
        const diaryData = {
            Name: diaryName,
            Picture: selectedWorksheet?.Picture,
            Start:  dayjs(diaryStart).format('DD-MM-YYYY'),
            End:  dayjs(diaryEnd).format('DD-MM-YYYY'),
            IsPublic: diaryIsPublic,
            WorksheetTypeID: selectedBook || 0,
            PatID: Number(patID),
        };
        const res = await CreateDiaryPat(diaryData);
        console.log(res)
        if (res) {
            messageApi.success("สร้างแล้ว");
            setTimeout(() => {
                window.location.reload()
            }, 1000)
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
                                        <span>START</span>
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
                                        {selectedBook !== null && (
                                            <img src={worksheets[selectedBook - 1]?.Picture} alt="" />
                                        )}
                                    </div>
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
                        <button className='btn-submit' onClick={handleSaveNote}>สร้างโน้ต</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Worksheets;
