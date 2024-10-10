import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarPat from '../../../component/navbarPat/navbarPat';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { GrEdit } from "react-icons/gr";
import { FaRegCalendarAlt, FaUnlockAlt } from "react-icons/fa";
import 'react-datepicker/dist/react-datepicker.css';

import './stylePat.css';

const worksheetData = [
    {
        numberIndex: 1,
        title: "Cross Sectional Formulation",
        image: "https://i.pinimg.com/564x/8f/1a/b1/8f1ab1e2ef48c2a26de7df6e977930bd.jpg",
        description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม"
    },
    {
        numberIndex: 2,
        title: "Behavioral Experiment",
        image: "https://i.pinimg.com/564x/4a/e5/d6/4ae5d6acd7226353af132969be733a61.jpg",
        description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม"
    },
    {
        numberIndex: 3,
        title: "Activity Planning",
        image: "https://i.pinimg.com/564x/2f/c5/e2/2fc5e275f3a1fbd35c0a729ae2178002.jpg",
        description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม"
    },
    {
        numberIndex: 4,
        title: "Panic - Self-Monitoring Record",
        image: "https://i.pinimg.com/564x/7d/2d/c5/7d2dc513fc506bd9ad6cf3847b7326c2.jpg",
        description: "การกำหนดกรอบความคิดกระบวนการ (สูตร) ช่วยให้นักบำบัดและลูกค้ามีความเข้าใจร่วมกันเกี่ยวกับปัญหา สูตรแบบตัดขวางนี้จะสำรวจปฏิสัมพันธ์ระหว่างสถานการณ์ ความคิด อารมณ์ ความรู้สึกของร่างกาย และพฤติกรรม"
    }
];

function Worksheets() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState(0);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);

    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index);
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0, 
            y: -20, 
            transition: { 
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const calculateDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDuration(diffDays);
    };

    const handleClickOutside = (event: any) => {
        if (showDatePicker && !event.target.closest('.date-picker-popup')) {
            setShowDatePicker(false);
        }
    };

    useEffect(() => {
        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    return (
        <div className={`worksheets ${showDatePicker ? 'show-blur-background' : ''}`}>
            <div className="main-body">
                <div className='sidebar'>
                    <NavbarPat />
                </div>
                <div className="main-background">
                    <div className="bg-content">
                        <div className="content-img">
                            <motion.img 
                                key={activeIndex}
                                src={worksheetData[activeIndex].image} 
                                alt={worksheetData[activeIndex].title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                className="content-text"
                                key={activeIndex}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.h2 variants={contentVariants}>{worksheetData[activeIndex].title}</motion.h2>
                                <motion.p variants={contentVariants}>{worksheetData[activeIndex].description}</motion.p>
                                <motion.div variants={contentVariants}>
                                    <button className="btn" onClick={() => setShowDatePicker(true)}>
                                        <span>START</span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="thumbnail">
                        {worksheetData.map((item, index) => (
                            <motion.div 
                                key={index}
                                className={`thumbnail-item ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.numberIndex}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            {showDatePicker && (
                <div className='bg-popup' onClick={handleClickOutside}>
                    <div className="date-picker-popup" onClick={(e) => e.stopPropagation()}>
                        {/* <h2 className='title'>New Note</h2> */}
                        <div className="date-picker-content">
                            <div className="left-column">
                                <div className='book-item'>
                                    <div className="img-book">
                                        <img src={selectedBook !== null ? worksheetData[selectedBook - 1].image : ''} alt="" />
                                    </div>
                                    <div className="head">
                                        <input className='nameBook' type="text" placeholder="ชื่อไดอารี่" />
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
                                        {worksheetData.map((item) => (
                                            <option value={item.numberIndex} key={item.numberIndex}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>วันเริ่มต้น</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => {
                                            if (date) setStartDate(date);
                                        }}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>วันสิ้นสุด</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                                setEndDate(date);
                                                calculateDuration(startDate, date);
                                            }
                                        }}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>จำนวนวัน</label>
                                    <input type="text" value={`${duration} วัน`} readOnly />
                                </div>
                            </div>
                        </div>
                        <button className='btn-submit' onClick={() => setShowDatePicker(false)}>สร้างโน้ต</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Worksheets;
