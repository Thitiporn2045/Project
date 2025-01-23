import React, { useState, useEffect } from 'react';
import { FaUnlockAlt } from "react-icons/fa";
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Button, ConfigProvider, message, Result, Select, Tag, Tooltip } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GetDiaryByDiaryID } from '../../../../services/https/diary';
import { GetCrossSectionalByDiaryID, GetEmotionsHaveDateByDiaryID, UpdateCrossSectional } from '../../../../services/https/cbt/crossSectional/crossSectional';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { CrossSectionalInterface } from '../../../../interfaces/crossSectional/ICrossSectional';
import { BiSolidEditAlt, BiSolidLockOpen } from "react-icons/bi";
import { AiFillSignal } from "react-icons/ai";
import dayjs from 'dayjs';
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';
import { ListCommentByDiaryId } from '../../../../services/https/psychologist/comment';
import { CommentInterface } from '../../../../interfaces/psychologist/IComment';

function SheetCross() {
    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
    const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
    const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
    const numericDiaryID = diaryID ? Number(diaryID) : undefined; // แปลงเป็น number หรือ undefined ถ้าไม่มีค่า

    const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
    const [comments, setComments] = useState<CommentInterface[]>([]); // ตั้งค่าประเภทของ emotionPatients เป็น EmtionInterface[]
    const [crossSectional, setCrossSectional] = useState<CrossSectionalInterface[] | null>(null); // เปลี่ยนเป็น array เพื่อรองรับหลายรายการ
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // ตั้งค่าประเภทของ emotionPatients เป็น EmtionInterface[]
    const [dateRange, setDateRange] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isEditing, setIsEditing] = useState(false); // State สำหรับโหมดแก้ไข
    const [editContent, setEditContent] = useState<CrossSectionalInterface | null>(null); // เก็บข้อมูลที่จะแก้ไข
    const [emotions, setEmotions] = useState<EmtionInterface[]>([]);     
    const [selectEmotion, setSelectEmotion] = useState<EmtionInterface[]>([]);


    const [messageApi, contextHolder] = message.useMessage();

    const handleEditClick = async (date: Date) => {
        const formattedDate = dayjs(date).format('DD/MM/YYYY');
        const contentToEdit = crossSectional?.find(item => 
            dayjs(item.Date, 'DD/MM/YYYY').isSame(dayjs(formattedDate, 'DD/MM/YYYY'))
        );
    
        if (contentToEdit) {
            setEditContent({ ...contentToEdit });
            setIsEditing(true);
            setSelectedDate(date);
    
            try {
                await fetchEmotionPatientData(); // ดึงข้อมูลที่เลือกไว้ก่อน
                await fetchEmotions(); // ดึงข้อมูลทั้งหมด
            } catch (error) {
                console.error('Error fetching emotions:', error);
            }
        } else {
            console.error('No content found for the selected date');
        }
    };
    
    

    const handleInputChange = (key: keyof CrossSectionalInterface, value: string) => {
        if (editContent) {
            setEditContent({
                ...editContent,
                [key]: value, // อัปเดตค่าที่ผู้ใช้พิมพ์
            });
        }
    };

    const saveEditedContent = async () => {
        if (editContent) {
            try {
                // เพิ่มข้อมูลอิโมจิที่เลือกไว้ลงใน editContent
                const updatedContent = {
                    ...editContent,
                    EmotionIDs: emotionPatients.map(emotion => emotion.ID), // ส่ง ID ของอิโมจิที่เลือก
                };
    
                const res = await UpdateCrossSectional(updatedContent); // เรียก API เพื่ออัปเดตข้อมูล
                console.log(updatedContent)
                if (res.status) {
                    console.log('Update successful:', res.message);
                    messageApi.success('อัปเดตข้อมูลในไดอารี่สำเร็จ');
                    setIsEditing(false); // ปิดโหมดแก้ไข
                    fetchCrossSectionalByDiary(); // อัปเดตข้อมูลในหน้า
                } else {
                    console.error('Error updating data:', res.message);
                    messageApi.error('ไม่สามารถแก้ไขได้ เนื่องจากเลยกำหนดเวลาที่สามารถแก้ไขได้แล้ว');
                }
            } catch (error) {
                console.error('Error during update:', error);
            }
        }
    };    

    // ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน
    useEffect(() => {
        const today = new Date(); // วันปัจจุบัน
        setSelectedDate(today);
    }, []);

    const onDateClick = (date: any) => {
        setSelectedDate(date); // อัปเดต state เมื่อเลือกวัน
        handleDateChange(date); // เรียกฟังก์ชัน handleDateChange

        // เลื่อนวันที่ที่เลือกมาอยู่ตรงกลาง
        const element = document.getElementById(`day-${date.toDateString()}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',  // เปลี่ยนจาก 'center' เป็น 'nearest'
                inline: 'center'   // เลื่อนให้วันที่อยู่กลางในแนวนอน
            });
        }
    };


    const fetchDiaryByDiary = async () => {
        if (diaryID) {
            try {
                const res = await GetDiaryByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                if (res) {
                    setDiary(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                }
                console.log('Diary:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
            } catch (error) {
                console.error('Error fetching diary:', error); // แสดงข้อผิดพลาด
            }
        }
    };

    const fetchCommentsByDiaryID = async () => {
        if (diaryID) {
            try {
                const res = await ListCommentByDiaryId(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                if (res) {
                    setComments(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                }
                console.log('comments:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
            } catch (error) {
                console.error('Error fetching diary:', error); // แสดงข้อผิดพลาด
            }
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

    // ฟังก์ชันในการดึงข้อมูลอารมณ์จาก API
    const fetchEmotions = async () => {
        const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
        if (res) {
            setEmotions(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
        }
        console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
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
        fetchEmotions();
        fetchCommentsByDiaryID();
    }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง
    

    const [selectedEmotions, setSelectedEmotions] = useState<EmtionInterface[]>([]);

    // ฟังก์ชัน handleSelectChange
const handleSelectChange = (values: (number | undefined)[], setSelectEmotion: React.Dispatch<React.SetStateAction<EmtionInterface[]>>) => {
    // กรองค่า undefined ออกก่อน
    const validValues = values.filter((value): value is number => value !== undefined);
    
    // คัดลอกข้อมูลอารมณ์ที่ตรงกับ ID ที่เลือก
    const selectedData = emotions.filter(emotion => validValues.includes(emotion.ID!));
    
    setSelectedEmotions(selectedData); // เก็บข้อมูลอารมณ์ที่เลือก
    setSelectEmotion(selectedData); // ส่งข้อมูลที่เลือกไปยังฟังก์ชันที่เกี่ยวข้อง
};
    const createTagRender = (selectedTags: { value: number; label: string; color: string; emotion: string }[]) => {
        return (props: any) => {
            const { label, value, closable, onClose } = props;
            const selectedTag = selectedTags.find(tag => tag.value === value);
            const color = selectedTag?.color || '#d9d9d9'; // สี default ถ้าไม่เจอ
            const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                event.preventDefault();
                event.stopPropagation();
            };
    
            return (
                <Tag
                    color={color}
                    onMouseDown={onPreventMouseDown}
                    closable={closable}
                    onClose={onClose}
                    style={{
                        marginInlineEnd: 4,
                        color: 'white', // Ensure text is visible
                        textShadow: '1px 1px 2px rgba(192, 192, 192, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    {label}
                </Tag>
            );
        };
    };
    
    const transformedEmotions = emotionPatients
    .filter(emotion => emotion.ID !== undefined && emotion.Name !== undefined && emotion.ColorCode !== undefined && emotion.Emoticon !== undefined) // กรองข้อมูลที่เป็น undefined
    .map(emotion => ({
        value: emotion.ID!, // ใช้การบังคับให้ไม่เป็น undefined
        label: emotion.Name!, // ใช้การบังคับให้ไม่เป็น undefined
        color: emotion.ColorCode!, // ใช้การบังคับให้ไม่เป็น undefined
        emotion: emotion.Emoticon! // ใช้การบังคับให้ไม่เป็น undefined
    }));

    // ตรวจสอบว่า transformedEmotions ไม่ว่างเปล่า
    if (transformedEmotions.length === 0) {
        console.error("No valid emotions found");
    }

    useEffect(() => {
        if (diary && diary.Start && diary.End) {
            const start = dayjs(diary.Start, 'DD-MM-YYYY').toDate();
            const end = dayjs(diary.End, 'DD-MM-YYYY').toDate();
            const range: Date[] = [];
            
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                range.push(new Date(date));
            }
            console.log('Date Range:', range); // Check the range here
            setDateRange(range);
        }
    }, [diary]);
    

    const formatDate = (date: Date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' })}`;
    };

    const isDateInRange = (date: Date) => {
        if (!diary || !diary.Start || !diary.End) {
            return false;
        }
    
        const start = dayjs(diary.Start, 'DD-MM-YYYY').toDate();
        const end = dayjs(diary.End, 'DD-MM-YYYY').toDate();
    
        // ตรวจสอบว่า date อยู่ในช่วง start และ end
        return date >= start && date <= end;
    };
    

    // ฟังก์ชันเลือกวันที่
    const handleDateChange = (date: Date) => {
        console.log('Selected Date:', date);
        setSelectedDate(date); 
    };    
    
    const navigate = useNavigate();

    const handleNavigateToSummary = () => {
        if (diary && diary.ID) {
            navigate(`/Summary?id=${diary.ID}`); // ใช้ query parameter แทน
        } else {
            console.warn("Diary ID is missing");
        }
    };

    // ฟังก์ชันที่ดึงข้อมูลตามวันที่
    const getContentForDay = (date: Date | null) => {
        if (!date || !isDateInRange(date)) return null;

        const formattedDate = dayjs(date).format('DD/MM/YYYY');  // รูปแบบ 'DD/MM/YYYY'
        //ค้าหาวันที่กับเนื้อหาที่ตรงกัน
        const content = crossSectional?.find(item => dayjs(item.Date, 'DD/MM/YYYY').isSame(dayjs(formattedDate, 'DD/MM/YYYY')));

        if (content) {
            const { Situation, Thought, Behavior, BodilySensation, TextEmotions } = content;
            console.log( Situation, Thought, Behavior, BodilySensation, TextEmotions)

            return (
                <div className="day-content">
                    <div className="content">
                        <div className="head">
                            <div className="onTitle">
                                <h2 className="title">สถานการณ์ของวันนี้</h2>
                                <div className='button'>
                                    <Tooltip title="สรุปข้อมูล">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<AiFillSignal />}
                                            onClick={handleNavigateToSummary} // ใช้ชื่อฟังก์ชันใหม่
                                        />
                                    </Tooltip>
                                    <Tooltip title="แก้ไข">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<BiSolidEditAlt />}
                                        onClick={() => selectedDate && handleEditClick(selectedDate)} // กดเพื่อแก้ไขวันที่ที่เลือก
                                    />                                    
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="lowerInput">
                                <div className="mainTitle">
                                    {Situation && <div className="title">{Situation}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="lower-content">
                            <div className="bg-Content">
                                <div className="content-box">
                                    <h3>ความคิด</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={Thought || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>พฤติกรรม</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={Behavior || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>ความรู้สึกทางร่างกาย</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={BodilySensation || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>อารมณ์</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={TextEmotions || ''} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="no-content">
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
                    <div className="Loading-Data-Self"></div>
                    <div className="text">ไม่มีข้อมูล...</div>
                </div>
            </div>
        );
    };


    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <ConfigProvider
        theme={{
            token: {
            colorPrimary: '#9BA5F6', // Example of primary color customization
            },
        }}
        >
        <div className='SheetCross'>
            {contextHolder}
            <div className='main-body'>
                <div className='sidebar'>
                    <NavbarPat />
                </div>
                <div className="main-background">
                    <div className="main-content">
                        <div className='content1'>
                            <div className="content-display">
                                {isEditing && editContent ? ( // ถ้าอยู่ในโหมดแก้ไข ให้แสดงฟอร์มแก้ไข
                                    <div className="day-content">
                                        <div className='content'>
                                            <div className="head">
                                            <div className="onTitle">
                                                <h2 className="title">สถานการณ์ของวันนี้</h2>
                                                <div className="showEmo">
                                                    {emotionPatients && emotionPatients.length > 0 ? (
                                                        emotionPatients.map((emotion) => (
                                                            <span
                                                                key={emotion.ID} // ใช้ emotion_id แทน ID
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '1.2em',
                                                                    backgroundColor: emotion.ColorCode, // ใช้ color_code แทน ColorCode
                                                                    borderRadius: '50%',
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    color: '#fff',
                                                                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
                                                                    cursor: 'pointer', // เพิ่มตัวชี้เมื่อโฮเวอร์
                                                                }}
                                                            >
                                                                {emotion.Emoticon} {/* ใช้ emotion_name แทน Emoticon */}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <div className="Loading-Data-SelfEmo"></div>
                                                            <div className="text">โปรดเลือกอิโมจิตามอารมณ์ของคุณ</div>
                                                        </div>
                                                    )}
                                                </div>
                                        </div>
                                                <div className="lowerInput">
                                                    <div className="mainTitle">
                                                        <textarea
                                                            className="titleEdit"
                                                            value={editContent.Situation || ''}
                                                            onChange={(e) => handleInputChange('Situation', e.target.value)} // อัปเดต State
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lower-content Edit">
                                                <div className="bg-Content">
                                                    <div className="content-box">
                                                    <h3>ความคิด</h3>
                                                        <div className="bg-input">
                                                            <textarea
                                                                value={editContent.Thought || ''}
                                                                className="content-input"
                                                                onChange={(e) => handleInputChange('Thought', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="content-box">
                                                    <h3>พฤติกรรม</h3>
                                                        <div className="bg-input">
                                                            <textarea
                                                                value={editContent.Behavior || ''}
                                                                className="content-input"
                                                                onChange={(e) => handleInputChange('Behavior', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="content-box">
                                                    <h3>ความรู้สึกทางร่างกาย</h3>
                                                        <div className="bg-input">
                                                            <textarea
                                                                value={editContent.BodilySensation || ''}
                                                                className="content-input"
                                                                onChange={(e) => handleInputChange('BodilySensation', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="content-box">
                                                    <h3>อารมณ์</h3>
                                                        <div className="bg-input">
                                                            <textarea
                                                                value={editContent.TextEmotions || ''}
                                                                className="content-input"
                                                                onChange={(e) => handleInputChange('TextEmotions', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* แสดงอารมณ์ให้เลือก */}
                                        <div className='bg-select'>
                                            <div>
                                                <label htmlFor="emotion" style={{marginRight: '20px'}}>เลือกอารมณ์</label>    
                                                <Select
                                                    className="content-emo"
                                                    mode="multiple"
                                                    tagRender={createTagRender(transformedEmotions)}
                                                    options={emotions.map(emotion => ({
                                                        value: emotion.ID,
                                                        label: `${emotion.Emoticon} ${emotion.Name}`,
                                                    }))}
                                                    placeholder="ความรู้สึก..."
                                                    optionLabelProp="label"
                                                    optionFilterProp="label"
                                                    value={emotionPatients?.map(emotion => emotion.ID)} // แสดงอิโมจิที่ผู้ใช้เลือกไว้
                                                    onChange={(selectedIDs) => {
                                                        const selectedEmotions = emotions.filter(emotion => selectedIDs.includes(emotion.ID));
                                                        setEmotionPatients(selectedEmotions); // อัปเดตสถานะอิโมจิที่เลือกไว้
                                                        handleSelectChange(selectedIDs, setSelectEmotion); // จัดการข้อมูลเพิ่มเติม (ถ้าจำเป็น)
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <Button onClick={() => setIsEditing(false)}>ยกเลิก</Button> {/* ปุ่มยกเลิก */}
                                                <Button onClick={saveEditedContent}>บันทึก</Button> {/* ปุ่มบันทึก */}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    getContentForDay(selectedDate) || (
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
                                            <div className="Loading-Data-Self"></div>
                                            <div className="text">ไม่มีข้อมูล...</div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="main-bg-right">
                    <div className="main-content">
                        <div className='content1'>
                            <div className="box1">
                                <div className="shoedate">
                                    <p>เลือกวันที่</p>
                                </div>
                                <div className="date-range">
                                    {dateRange.map((date, index) => (
                                        <div
                                            key={index}
                                            id={`day-${date.toDateString()}`} // เพิ่ม id ให้แต่ละวัน
                                            className={`day ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                            onClick={() => onDateClick(date)} // เลือกวันที่เมื่อคลิก
                                        >
                                            {formatDate(date)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='box2'>
                                <div className="contentComment">
                                    <h3>คำแนะนำ</h3>
                                    <div className="day-comments">
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment, index) => (
                                            <div key={index} className="comment-box">
                                            <div className="comment-content">
                                                <div className="comment-user">
                                                <strong>
                                                    {comment.Psychologist?.FirstName} {comment.Psychologist?.LastName}
                                                </strong>
                                                <span className="comment-date">นักจิตวิทยา</span>
                                                </div>
                                                <div className="comment-text">{comment.Comment}</div>
                                            </div>
                                            {/* Avatar at the bottom */}
                                            <div className="comment-avatar">
                                                <img src={comment.Psychologist?.Picture} alt="Avatar" />
                                            </div>
                                            </div>
                                        ))
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
                                            <div className="Loading-Data-SelfCom"></div>
                                            <div className="text">ยังไม่มีคำแนะนำ</div>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ConfigProvider>
    );
}

export default SheetCross;
