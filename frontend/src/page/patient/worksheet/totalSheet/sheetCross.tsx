import React, { useState, useEffect } from 'react';
import { FaUnlockAlt } from "react-icons/fa";
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Button, ConfigProvider, message, Result, Select, Tag, Tooltip } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { GetDiaryByDiaryID } from '../../../../services/https/diary';
import { GetCrossSectionalByDiaryID, GetEmotionsHaveDateByDiaryID, UpdateCrossSectional } from '../../../../services/https/cbt/crossSectional/crossSectional';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { CrossSectionalInterface } from '../../../../interfaces/crossSectional/ICrossSectional';
import { BiSolidEditAlt, BiSolidLockOpen } from "react-icons/bi";

import dayjs from 'dayjs';
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';

const comments = [
    {
        user: "John Doe",
        date: '25/08/2024',
        comment: "The psychologist was very attentive and gave practical advice on managing stress. I felt heard and understood throughout the session.",
        image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    },
    {
        user: "Jane Smith",
        date: '25/08/2024',
        comment: "The session was insightful, but I felt like there could have been more focus on solutions. However, the psychologist was very compassionate.",
        image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    },
    {
        user: "David Brown",
        date: '28/08/2024',
        comment: "I appreciated the psychologist's approach to mindfulness exercises. It helped me stay grounded during stressful moments.",
        image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    }
];

function SheetCross() {
    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
    const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
    const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
    const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
    const [crossSectional, setCrossSectional] = useState<CrossSectionalInterface[] | null>(null); // เปลี่ยนเป็น array เพื่อรองรับหลายรายการ
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
    const [dateRange, setDateRange] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isEditing, setIsEditing] = useState(false); // State สำหรับโหมดแก้ไข
    const [editContent, setEditContent] = useState<CrossSectionalInterface | null>(null); // เก็บข้อมูลที่จะแก้ไข
    const [emotions, setEmotions] = useState<Array<string>>([]); // เก็บข้อมูลอารมณ์
    const [selectEmotion, setSelectEmotion] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
    


    const [messageApi, contextHolder] = message.useMessage();

    const handleEditClick = (date: Date) => {
        // ดึงข้อมูลของวันที่เลือกเพื่อแก้ไข
        const formattedDate = dayjs(date).format('DD/MM/YYYY');
        const contentToEdit = crossSectional?.find(item => 
            dayjs(item.Date, 'DD/MM/YYYY').isSame(dayjs(formattedDate, 'DD/MM/YYYY'))
        );

        if (contentToEdit) {
            setEditContent({ ...contentToEdit }); // ตั้งค่าเนื้อหาที่จะแก้ไข
            setIsEditing(true); // เปิดโหมดแก้ไข
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
                const res = await UpdateCrossSectional(editContent); // เรียก API เพื่ออัปเดตข้อมูล
                if (res.status) {
                    console.log('Update successful:', res.message);
                    messageApi.success('อัปเดตข้อมูลในไดอารี่สำเร็จ');
                    setIsEditing(false); // ปิดโหมดแก้ไข
                    fetchCrossSectionalByDiary(); // อัปเดตข้อมูลในหน้า
                } else {
                    console.error('Error updating data:', res.message);
                    messageApi.error('เกิดข้อผิดพลาด โปรดลองใหม่ในภายหลัง');

                }
            } catch (error) {
                console.error('Error during update:', error);
            }
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

    const fetchEmotions = async () => {
        try {
            const res = await GetEmotionsHaveDateByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
            if (res.status === 200) {
                setEmotions(res.data); // เก็บข้อมูลอารมณ์จาก API
            } else {
                console.error('Failed to fetch emotions');
            }
        } catch (error) {
            console.error('Error fetching emotions:', error);
        }
    };

    const fetchEmotionPatientData = async () => {
        const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
        if (res) {
          setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
        }
        console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
    };
    

    useEffect(() => {
        fetchDiaryByDiary();
        fetchCrossSectionalByDiary();
        fetchEmotions();
        fetchEmotionPatientData();
    }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง

    const handleSelectChange = (selectedValues: number[], setTags: React.Dispatch<React.SetStateAction<{ value: number; label: string; color: string; emotion: string }[]>>) => {
        const updatedTags = selectedValues.map(value => {
        const emotion = emotionPatients.find(emotion => emotion.ID === value);
        return {
            value: emotion?.ID || value,
            label: emotion?.Name || '',
            color: emotion?.ColorCode || '#d9d9d9',
            emotion: emotion?.Emoticon || ''
        };
        });
        setTags(updatedTags);
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
                                <h2 className="title">Situation to Trigger</h2>
                                <div className='button'>
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
                                    <h3>Thoughts</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={Thought || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>Behavior</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={Behavior || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>Bodily Sensations</h3>
                                    <div className="bg-input">
                                        <textarea className="content-input" value={BodilySensation || ''} />
                                    </div>
                                </div>
                                <div className="content-box">
                                    <h3>Emotions</h3>
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
                                        <h3>แก้ไขข้อมูล</h3>
                                        <textarea
                                            value={editContent.Situation || ''}
                                            onChange={(e) => handleInputChange('Situation', e.target.value)} // อัปเดต State
                                        />
                                        <textarea
                                            value={editContent.Thought || ''}
                                            className="content-input"
                                            onChange={(e) => handleInputChange('Thought', e.target.value)}
                                        />
                                        <textarea
                                            value={editContent.Behavior || ''}
                                            className="content-input"
                                            onChange={(e) => handleInputChange('Behavior', e.target.value)}
                                        />
                                        <textarea
                                            value={editContent.BodilySensation || ''}
                                            className="content-input"
                                            onChange={(e) => handleInputChange('BodilySensation', e.target.value)}
                                        />
                                        <textarea
                                            value={editContent.TextEmotions || ''}
                                            className="content-input"
                                            onChange={(e) => handleInputChange('TextEmotions', e.target.value)}
                                        />

                                        {/* แสดงอารมณ์ให้เลือก */}
                                        <label htmlFor="emotion">Select Emotion:</label>
                                        <div className="showEmo">
                                        {selectEmotion.map((emotion) => (
                                        <span
                                            key={emotion.value}
                                            style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5em',
                                            backgroundColor: emotion.color,
                                            borderRadius: '50%',
                                            width: '2em',
                                            height: '2em',
                                            color: '#fff',
                                            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
                                            cursor: 'pointer',
                                            }}
                                        >
                                            {emotion.emotion}
                                        </span>
                                        ))}
                                    </div>
                                        <Select
                                            className='content-emo'
                                            mode="multiple"
                                            tagRender={(props) => createTagRender(selectEmotion)(props)} // ใช้ฟังก์ชัน tagRender
                                            options={emotionPatients.map((emotion) => ({
                                                value: emotion.ID,    // ใช้ ID เป็น value
                                                label: `${emotion.Emoticon} ${emotion.Name}`,  // แสดงอารมณ์และชื่อ
                                            }))}
                                            placeholder="ความรู้สึก..."
                                            optionLabelProp="label"
                                            optionFilterProp="label"
                                            onChange={(values) => handleSelectChange(values, setSelectEmotion)} // ส่ง setSelectEmotion
                                        />
                                        <Button onClick={saveEditedContent}>บันทึก</Button> {/* ปุ่มบันทึก */}
                                        <Button onClick={() => setIsEditing(false)}>ยกเลิก</Button> {/* ปุ่มยกเลิก */}
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
                                            <div className="text">ยังไม่ได้เลือกวันที่...</div>
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
                                        className={`day ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                        onClick={() => handleDateChange(date)} // เลือกวันที่เมื่อคลิก
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
                                        {comments.map((comment, index) => (
                                            <div key={index} className="comment-box">
                                                <div className="comment-content">
                                                    <div className="comment-user">
                                                        <strong>{comment.user}</strong>
                                                        {/* <span className="comment-date">{formattedDate}</span> */}
                                                    </div>
                                                    <div className="comment-text">
                                                        {comment.comment}
                                                    </div>
                                                </div>
                                                {/* Avatar at the bottom */}
                                                <div className="comment-avatar">
                                                    <img src={comment.image} />
                                                </div>
                                            </div>
                                        ))}
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
