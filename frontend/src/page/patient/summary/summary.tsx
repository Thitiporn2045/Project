import React, { useEffect, useRef, useState } from 'react'; 
import NavbarPat from '../../../component/navbarPat/navbarPat'; 
import SummaryEmojiPat from '../../../component/summaryEmojiPat/summaryEmojiPat';
import SelectDayPat from '../../../component/selectDayPat/selectDayPat';
import './stylePat.css';
import { useSearchParams } from 'react-router-dom';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import dayjs from 'dayjs';
import { CrossSectionalInterface } from '../../../interfaces/crossSectional/ICrossSectional';
import { GetCrossSectionalByDiaryID, GetEmotionsHaveDateByDiaryID } from '../../../services/https/cbt/crossSectional/crossSectional';
import { EmtionInterface } from '../../../interfaces/emotion/IEmotion';
import OverallMood from '../../../component/summaryDiary/overallMood';
import MostCommon from '../../../component/summaryDiary/mostCommon';
import FilterEmotions from '../../../component/summaryDiary/filterEmotions';

const Summary: React.FC = () => {
    const [searchParams] = useSearchParams();
    const diaryID = searchParams.get('id');
    const numericDiaryID = diaryID ? Number(diaryID) : undefined;
    const [diary, setDiary] = useState<DiaryPatInterface | null>(null);

    const [dateRange, setDateRange] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [numberOfDays, setNumberOfDays] = useState<number | null>(null);  // Add this state for numberOfDays
    const [crossSectional, setCrossSectional] = useState<CrossSectionalInterface[]>([]); // ใช้ array ว่างแทน null
    const [datesWithData, setDatesWithData] = useState<string[]>([]); // สถานะเก็บวันที่ที่ไม่มีข้อมูล
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // ตั้งค่าประเภทของ emotionPatients เป็น EmtionInterface[]
    
    const bookRef = useRef<HTMLDivElement>(null);
    const [prev, setPrev] = useState(0);
    const [isDragging, setIsDragging] = useState(false);  // State สำหรับตรวจสอบการลาก

    const fetchDiaryByDiary = async () => {
        if (!diaryID) return;
    
        try {
            const res = await GetDiaryByDiaryID(Number(diaryID));
            setDiary(res || null);
            console.log('Diary:', res);
        } catch (error) {
            console.error('Error fetching diary:', error);
            // Add UI feedback here for the user
        }
    };    

    const fetchCrossSectionalByDiary = async () => {
        if (diaryID) {
            try {
                const res = await GetCrossSectionalByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                if (res) {
                    setCrossSectional(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                }
                console.log('Cross Sectional:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
            } catch (error) {
                console.error('Error fetching cross-sectional data:', error); // แสดงข้อผิดพลาด
            }
        }
    };

    const fetchEmotionPatientData = async () => {
        if (!diaryID || !selectedDate) {
            console.error("Diary ID or date is missing");
            return;
        }
    
        const dateString = dayjs(selectedDate).format('DD-MM-YYYY');
    
        try {
            const res = await GetEmotionsHaveDateByDiaryID(numericDiaryID, dateString);
    
            if (res) {
                // แปลงคีย์ของข้อมูลจาก API ให้ตรงกับ EmtionInterface
                const transformedEmotions = res.map((emotion: any) => ({
                    ID: emotion.emotion_id,
                    Name: emotion.emotion_name,
                    Emoticon: emotion.emoticon, // สมมติว่ามีอยู่ใน API
                    ColorCode: emotion.color_code,
                    PatID: emotion.PatID, // สมมติว่ามีอยู่ใน API
                    Patient: emotion.Patient, // สมมติว่ามีอยู่ใน API
                }));
    
                setEmotionPatients(transformedEmotions); // เก็บข้อมูลหลังจากแปลง
                console.log("setEmotionPatients", transformedEmotions);
            } else {
                console.error("Failed to fetch emotions");
            }
        } catch (error) {
            console.error("Error fetching emotions:", error);
        }
    };    
        

    useEffect(() => {
        fetchDiaryByDiary();
        fetchCrossSectionalByDiary();
    }, []);

    useEffect(() => {
        if (diary && diary.Start && diary.End) {
            const start = dayjs(diary.Start, 'DD-MM-YYYY');
            const end = dayjs(diary.End, 'DD-MM-YYYY');
            const range: Date[] = [];

            // คำนวณช่วงวันที่ตั้งแต่เริ่มจนถึงจบ
            for (let date = start; date.isBefore(end) || date.isSame(end, 'day'); date = date.add(1, 'day')) {
                range.push(date.toDate());
            }
            console.log('Date Range:', range);
            setDateRange(range);

            // คำนวณจำนวนวันทั้งหมด
            const totalDays = end.diff(start, 'day') + 1; // +1 เพื่อรวมวันเริ่มและวันสิ้นสุด
            console.log('Number of days:', totalDays);
            setNumberOfDays(totalDays);

            // สร้าง Set เพื่อเก็บวันที่ที่มีข้อมูลจาก CrossSectional (ฟอร์แมตเป็น 'DD-MM-YYYY')
        const existingDates = new Set(crossSectional.map((entry: any) => dayjs(entry.Date, 'DD-MM-YYYY').format('DD-MM-YYYY')));

        // ตรวจสอบวันที่ที่มีข้อมูล
        const datesWithData: string[] = [];
        for (let date = start; date.isBefore(end) || date.isSame(end, 'day'); date = date.add(1, 'day')) {
            const formattedDate = date.format('DD-MM-YYYY'); // ฟอร์แมตวันที่เป็น 'DD-MM-YYYY'
            if (existingDates.has(formattedDate)) {
                datesWithData.push(formattedDate); // วันที่ที่มีข้อมูล (ในรูปแบบ 'DD-MM-YYYY')
            }
        }

        setDatesWithData(datesWithData); // เก็บวันที่ที่มีข้อมูล
        }
    }, [diary, crossSectional]); // เพิ่ม crossSectional ใน dependencies เพื่อให้การคำนวณวันที่ไม่ถูกบันทึกทำงานทุกครั้งที่ข้อมูลเปลี่ยน

    
    const formatDate = (date: Date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' })}`;
    };

    const onDateClick = (date: any) => {
        setSelectedDate(date);
        handleDateChange(date);

        const element = document.getElementById(`day-${date.toDateString()}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    };

    const handleDateChange = (date: Date) => {
        console.log('Selected Date:', date);
        setSelectedDate(date);
    };

    useEffect(() => {
        if (selectedDate) {
            fetchEmotionPatientData(); // เรียก fetchEmotionPatientData เมื่อ selectedDate เปลี่ยน
        }
    }, [selectedDate]);
    

    const rotateBookAutomatically = () => {
        let currentRotation = prev;
        const rotate = () => {
            if (!isDragging) {
                currentRotation += 0.2; // หมุนทีละ 0.2 องศา
                if (bookRef.current) {
                    bookRef.current.style.transform = `rotateY(${currentRotation}deg)`;
                }
                requestAnimationFrame(rotate); // เรียกฟังก์ชันนี้ซ้ำเพื่อหมุนต่อไป
            }
        };
        requestAnimationFrame(rotate); // เริ่มหมุนเมื่อคอมโพเนนต์ mount
    };
    
    useEffect(() => {
        rotateBookAutomatically();
    }, [isDragging]); // หมุนต่อเนื่องจนกว่าผู้ใช้จะหยุดลาก
    

    return (
        <div className='summary'>
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat />
                    </div>

                    <div className="main-background">
                        <div className="main-content">
                            <div className='contentMain'>
                                <header>
                                    <div className="boxContent1">
                                        <div className='titleName'>{diary?.Name}</div>
                                        <div className="typeBook">{diary?.WorksheetType?.Name}</div>
                                    </div>
                                    <div className="boxContent2">
                                        <div className="picture">
                                            <div className="bdImg">
                                                <img src={diary?.Patient?.Picture} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </header>
                                <div className="showBook">
                                    <section className="book-showcase">
                                        <div className="wrapper">
                                            <div 
                                                ref={bookRef}
                                                className="book"
                                                style={{
                                                    width: '27.0625em',
                                                    height: '40.5em',
                                                    transformOrigin: '13.53125em 4.375em',
                                                    position: 'relative',
                                            }}
                                            >
                                                <div className="front" style={{ backgroundImage: `url(${diary?.Picture})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                <div className="side" style={{ backgroundImage: `url(${diary?.Picture})` }}>
                                                    <div className="book-title">{diary?.Name}</div>
                                                </div>
                                                <div className="back" style={{ backgroundImage: `url(${diary?.Picture})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                <div className="pages"></div>
                                                <div className="shadow"></div>
                                            </div>
                                        </div>
                                    </section>
                                    
                                <div className='cardEmotion'>
                                    <div className="card-container">
                                        <div className="labelShowDay">
                                            <small className="text-muted">อารมณ์วันที่ {selectedDate ? formatDate(selectedDate) : 'ไม่ระบุ'}</small>
                                        </div>
                                            {emotionPatients.map((emoPat, index) => (
                                                <div className="card" key={index}>
                                                    <div className="card-header">
                                                        <div 
                                                            className="card-header-icon"
                                                            style={{
                                                                color: String(emoPat.ColorCode) || 'transparent',
                                                                backgroundColor: String(emoPat.ColorCode) || 'transparent',
                                                            }}
                                                        >
                                                            {emoPat.Emoticon}
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <p 
                                                            className="card-value"
                                                        >{emoPat.Name}</p>
                                                        {/* <p className="card-percentage II">{emoPat.percentage}%</p> */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <OverallMood diaryID={numericDiaryID} />
                                    {/* <FilterEmotions diaryID={numericDiaryID}/> */}
                                {/* <SummaryEmojiPat/> */}
                            </div>
                        </div>
                    </div>

                    <div className="main-bg-right">
                        <div className="main-content">
                            <div className='content1'>
                                <div className='mainBox'>
                                    <div className="box1">
                                        <div className="shoedate">
                                            <p>เลือกวันที่</p>
                                        </div>
                                        <div className="date-range">
                                            {dateRange.map((date, index) => (
                                                <div
                                                    key={index}
                                                    id={`day-${date.toDateString()}`}
                                                    className={`day ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                                    onClick={() => onDateClick(date)}
                                                >
                                                    {formatDate(date)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            
                                    <div className='box2'>
                                        <div className="boxContent1">
                                            <div className="container">
                                                {/* <div className="numberDay">
                                                    {numberOfDays && <p>{numberOfDays}</p>}
                                                    <small className="text-muted">วันทั้งหมด</small>
                                                </div> */}
                                                {/* วงกลมแสดง % ของวันที่เข้าทำบันทึก */}
                                                <div
                                                    className="circular_progress"
                                                    style={
                                                        {
                                                            '--clr': '#9BA5F6',
                                                            '--value': numberOfDays ? (datesWithData.length / numberOfDays) * 100 : 0
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    <div className="totalDay">
                                                        <p>{datesWithData.length} วัน</p>
                                                        <span>{numberOfDays ? Math.round((datesWithData.length / numberOfDays) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="labelDay">
                                                    <small className="text-muted">วันเข้าบันทึก</small>
                                                </div>

                                            </div>
                                            <div className="container">
                                                {/* วงกลมแสดง % ของวันที่ไม่ได้เข้าทำบันทึก */}
                                                <div
                                                    className="circular_progress no"
                                                    style={
                                                        {
                                                            '--clr': '#edf0ff',
                                                            '--value': numberOfDays ? ((numberOfDays - datesWithData.length) / numberOfDays) * 100 : 0
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    <div className="totalDay">
                                                        {numberOfDays && <p>{numberOfDays - datesWithData.length} วัน</p>}
                                                        <span>{numberOfDays ? Math.round(((numberOfDays - datesWithData.length) / numberOfDays) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="labelDay">
                                                    <small className="text-muted">วันไม่ได้เข้าบันทึก</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='boxContent2'>
                                            
                                        </div>

                                        <div className="boxContent3">
                                            อารมณ์ที่พบบ่อย
                                            <MostCommon diaryID={numericDiaryID}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
