import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, List, Input, ConfigProvider, Dropdown, Button, Menu, Timeline, Drawer, message, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';  // นำเข้า locale ภาษาไทย
import { AiFillSignal, AiOutlineMore } from 'react-icons/ai';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../../services/https/diary';
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import { ActivityDiaryInterface } from '../../../../interfaces/activityDiary/IActivityDiary';
import { ListCommentByDiaryId } from '../../../../services/https/psychologist/comment';
import { CommentInterface } from '../../../../interfaces/psychologist/IComment';
import { CreateActivityDiary, GetActivityDiaryByDiaryID, UpdateActivityDiary } from '../../../../services/https/cbt/activityDiary/activityDiary';
import moment from 'moment';

const Activity: React.FC = () => {
    dayjs.locale('th'); // ตั้งค่า locale เป็นภาษาไทย
    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
    const [activityDiary, setActivityDiary] = useState<ActivityDiaryInterface[]>([]);
    const [comments, setComments] = useState<CommentInterface[]>([]); // ตั้งค่าประเภทของ emotionPatients เป็น EmtionInterface[]
    const [messageApi, contextHolder] = message.useMessage();

    const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
    const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
    const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());    
    const [form] = Form.useForm();
    const [editingEvent, setEditingEvent] = useState<ActivityDiaryInterface | null>(null); // Track the event being edited


    const startDay = dayjs(diary?.Start, 'DD-MM-YYYY');
    const endDay = dayjs(diary?.End, 'DD-MM-YYYY');
    const [activity, setActivity] = useState('');
    const [emotionID, setEmotionID] = useState('');


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
    
    const fetchEmotionPatientData = async () => {
        const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
        if (res) {
        setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
        }
        console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
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

    const fetchActivityDiaryByDiary = async () => {
        if (diaryID) {
            try {
                const res = await GetActivityDiaryByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
                if (res) {
                    setActivityDiary(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
                }
                console.log('ActivityDiary:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
            } catch (error) {
                console.error('Error fetching ActivityDiary data:', error); // แสดงข้อผิดพลาด
            }
        }
    };
    
    useEffect(() => {
        fetchEmotionPatientData();
        fetchDiaryByDiary();
        fetchCommentsByDiaryID();
        fetchActivityDiaryByDiary();
    }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง

    const handleSubmit = async () => {
        // ตรวจสอบให้แน่ใจว่ามีการเลือกอารมณ์และกรอกคำอธิบายแล้ว
        if (!emotionID || !activity) {
            messageApi.error('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
    
        // แปลง emotionID เป็น number
        const emotionIDNumber = Number(emotionID); // แปลงจาก string เป็น number
    
        if (isNaN(emotionIDNumber)) {
            messageApi.error('ID อารมณ์ไม่ถูกต้อง');
            return;
        }
    
        // ตรวจสอบว่า diaryID มีค่าอยู่
        if (!diaryID) {
            messageApi.error('ไม่พบข้อมูลไดอารี่');
            return;
        }
    
        // สร้าง object ข้อมูลที่จะส่งไปยัง API
        const data = {
            Date: selectedDate ? selectedDate.format('DD-MM-YYYY') : '', // ใช้ moment ในการแปลงวันที่
            EmotionID: emotionIDNumber, // ส่งเป็น number
            Activity: activity,
            Time: moment().format('HH:mm:ss'), // ใช้ moment เพื่อดึงเวลาปัจจุบันในฟอร์แมต 'HH:mm:ss'
            DiaryID: Number(diaryID), // เพิ่ม diaryID ที่ดึงมาจาก URL
        };
    
        try {
            // ส่งข้อมูลไปยัง backend API (POST)
            const response = await CreateActivityDiary(data);
    
            if (response.status) {
                setIsModalOpen(false);
                messageApi.success('บันทึกข้อมูลสำเร็จ');
                fetchActivityDiaryByDiary();
            } else {
                messageApi.error(`ไม่สามารถบันทึกข้อมูลได้: ${response.message}`);
            }
        } catch (err) {
            console.error('Error:', err);
            messageApi.error('ไม่สามารถบันทึกข้อมูลได้');
        }
    };    

const openModal = (date: Dayjs) => {
    if (date.isSame(dayjs(), 'day')) {
        // หากวันที่ที่เลือกเป็นวันปัจจุบัน ให้เปิด modal
        setSelectedDate(date);
        setIsModalOpen(true);  // เปิด modal
        // เรียกใช้ openModal ที่นี่
        console.log('เปิด modal วันที่:', date.format('DD/MM/YYYY'));
    } else {
        // หากไม่ใช่วันปัจจุบัน เก็บวันที่ที่เลือกไว้
        setSelectedDate(date);
        console.log('เก็บวันที่เลือก:', date.format('DD/MM/YYYY'));
    }
};


const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
};

const [open, setOpen] = useState(false);

const showDrawer = () => {
    setOpen(true);
};

const onClose = () => {
    setOpen(false);
};

const dateCellRender = (date: Dayjs) => {
    const dayEvents = activityDiary.filter(event => event.Date === date.format('DD-MM-YYYY'));

    return (
        <ul className="events">
            {dayEvents.map((event, index) => {
                return (
                    <li key={index}>
                        <Badge 
                            color={`${event.Emotion?.ColorCode}`} // Use the correct emotion to get color
                            text={`${event?.Emotion?.Name} ${event?.Emotion?.Emoticon}`} // Corrected the string interpolation
                        />
                    </li>
                );
            })}
        </ul>
    );
};

const getContentForDay = (date: Date | null) => {
    if (!date) return <p>กรุณาเลือกวันที่</p>;

    const formattedDate = dayjs(date).format('DD/MM/YYYY'); // แปลงวันที่เป็นฟอร์แมต 'DD/MM/YYYY'

    // ค้นหาข้อมูลที่ตรงกับวันที่เลือก
    const eventsForDay = activityDiary?.filter(item =>
        dayjs(item.Date, 'DD/MM/YYYY').isSame(dayjs(formattedDate, 'DD/MM/YYYY'))
    );

    if (!eventsForDay || eventsForDay.length === 0) {
        return (
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
                <div className="Loading-Data-SelfDay"></div>
                <div className="text">ไม่มีข้อมูลสำหรับวันที่ {formattedDate}</div>
            </div>
        );
    }

    // Define the hourly ranges
    const timeRanges = [
        { start: 0, end: 1, label: '00:00 - 01:00' },
        { start: 1, end: 2, label: '01:00 - 02:00' },
        { start: 2, end: 3, label: '02:00 - 03:00' },
        { start: 3, end: 4, label: '03:00 - 04:00' },
        { start: 4, end: 5, label: '04:00 - 05:00' },
        { start: 5, end: 6, label: '05:00 - 06:00' },
        { start: 6, end: 7, label: '06:00 - 07:00' },
        { start: 7, end: 8, label: '07:00 - 08:00' },
        { start: 8, end: 9, label: '08:00 - 09:00' },
        { start: 9, end: 10, label: '09:00 - 10:00' },
        { start: 10, end: 11, label: '10:00 - 11:00' },
        { start: 11, end: 12, label: '11:00 - 12:00' },
        { start: 12, end: 13, label: '12:00 - 13:00' },
        { start: 13, end: 14, label: '13:00 - 14:00' },
        { start: 14, end: 15, label: '14:00 - 15:00' },
        { start: 15, end: 16, label: '15:00 - 16:00' },
        { start: 16, end: 17, label: '16:00 - 17:00' },
        { start: 17, end: 18, label: '17:00 - 18:00' },
        { start: 18, end: 19, label: '18:00 - 19:00' },
        { start: 19, end: 20, label: '19:00 - 20:00' },
        { start: 20, end: 21, label: '20:00 - 21:00' },
        { start: 21, end: 22, label: '21:00 - 22:00' },
        { start: 22, end: 23, label: '22:00 - 23:00' },
        { start: 23, end: 24, label: '23:00 - 00:00' },
    ];

    // จัดกลุ่มข้อมูลตามช่วงเวลา
    const groupedEventsByHour = eventsForDay.reduce((time, event) => {
        if (event.Time) { // ตรวจสอบว่า event.Time มีค่าก่อน
            const hour = parseInt(event.Time.split(':')[0], 10); // ดึงค่าชั่วโมงจากเวลา
            const range = timeRanges.find(range => hour >= range.start && hour < range.end); // หาเรนจ์ที่ตรงกัน

            if (range) {
                if (!time[range.label]) {
                    time[range.label] = [];
                }
                time[range.label].push(event); // เพิ่ม event ลงในช่วงเวลา
            }
        }
        return time;
    }, {} as Record<string, ActivityDiaryInterface[]>);

    // แสดงข้อมูลในรูปแบบ Timeline
    return (
        <Timeline>
            {Object.keys(groupedEventsByHour).map((timeSlot) => (
                <Timeline.Item key={timeSlot}>
                    <h3>{timeSlot}</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={groupedEventsByHour[timeSlot]}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 50,
                                                height: 50,
                                                borderRadius: '50%',
                                                fontSize: '45px',
                                                textAlign: 'center',
                                                padding: '8px 5px 3px 5px',
                                                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 3px 30px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
                                                backgroundColor: String(emotionPatients.find(opt => opt.ID === item.EmotionID)?.ColorCode) || 'transparent',
                                            }}
                                        >
                                            {emotionPatients.find(opt => opt.ID === item.EmotionID)?.Emoticon}
                                        </div>
                                    }
                                    title={
                                        <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            {emotionPatients.find(opt => opt.ID === item.EmotionID)?.Name} ({item.Date})
                                            <Dropdown overlay={menu(item)} trigger={['click']} placement="bottomRight">
                                                <Button className="action-button"><AiOutlineMore /></Button>
                                            </Dropdown>
                                        </span>
                                    }
                                    description={item.Activity}
                                />
                            </List.Item>
                        )}
                    />
                </Timeline.Item>
            ))}
        </Timeline>
    );
};


const handleEditEvent = (event: ActivityDiaryInterface) => {
    setEditingEvent(event); // ตั้งค่าข้อมูลกิจกรรมที่ต้องการแก้ไข
    form.setFieldsValue({
        emotion: event.EmotionID, // ค่าอารมณ์เดิม
        description: event.Activity, // กิจกรรมเดิม
    });
    setIsModalOpenEdit(true); // เปิด Modal
};


const handleSubmitEdit = async () => {
    try {
        // ดึงข้อมูลจากฟอร์ม
        const values = await form.validateFields(); // ตรวจสอบให้ฟอร์มถูกต้อง

        // สร้างข้อมูลที่ต้องการส่งไปยัง API
        const updatedEvent: ActivityDiaryInterface = {
            ...editingEvent,  // ข้อมูลเดิม
            EmotionID: Number(emotionID), // แปลง emotionID เป็น string
            Activity: values.description, // กิจกรรมที่ถูกแก้ไข
        };
        console.log("Emotion Patients:", emotionPatients);
        console.log("Selected Emotion Object:", emotionPatients.find(emotion => emotion.ID === Number(emotionID)));


        // เรียกใช้ฟังก์ชัน UpdateActivityDiary เพื่อติดต่อ API
        const updateResult = await UpdateActivityDiary(updatedEvent);

        // ตรวจสอบผลลัพธ์การอัปเดต
        if (updateResult.status) {
            // การอัปเดตสำเร็จ
            console.log('Event updated successfully:', updateResult.message);
            
            // ปิด modal และรีเฟรชข้อมูล
            setIsModalOpenEdit(false);
            setActivityDiary(prevState => {
                return prevState.map(item =>
                    item.ID === updatedEvent.ID
                        ? updatedEvent // ใช้ข้อมูลที่อัปเดตใหม่
                        : item
                );
            });            

            // แสดงข้อความสำเร็จเป็นภาษาไทย
            message.success('กิจกรรมได้รับการอัปเดตสำเร็จ'); 
        } else {
            // การอัปเดตล้มเหลว
            console.error('ไม่สามารถอัปเดตกิจกรรมได้', updateResult.message);
            message.error(updateResult.message);  // แสดงข้อความผิดพลาด
        }
    } catch (error) {
        // จัดการข้อผิดพลาดหากมี
        console.error('Failed to submit form:', error);
        message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล'); // แสดงข้อความผิดพลาด
    }
};

const menu = (event: ActivityDiaryInterface) => (
    <Menu>
    <Menu.Item onClick={() => handleEditEvent(event)}>แก้ไข</Menu.Item>
    </Menu>
);

const navigate = useNavigate();
const handleNavigateToSummary = () => {
    if (diary && diary.ID) {
        navigate(`/SummaryActivity?id=${diary.ID}`); // ใช้ query parameter แทน
    } else {
        console.warn("Diary ID is missing");
    }
};

return (
    <ConfigProvider
    theme={{
        components: {
        Calendar: {
        },
        Button:{
        }
        },

        token: {
        colorPrimary: '#9BA5F6', // Example of primary color customization
        },
    }}
    >
    <div className='planning'>
        {contextHolder}
        <div className="befor-main">
        <div className='main-body'>
            <div className='sidebar'>
            <NavbarPat />
            </div>
            <div className="main-background">
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '70%' }}>
                <Calendar 
                    dateCellRender={dateCellRender}
                    onSelect={openModal} // เปิด modal เมื่อเลือกวันที่
                    defaultValue={dayjs()}
                    disabledDate={(current) => 
                        current && 
                        (current.isAfter(endDay, 'day') || current.isBefore(startDay, 'day'))
                    }
                    headerRender={({ value, onChange }) => {
                        const current = value;
                        return (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                                <div className='titleCalender'>{diary?.Name}</div>
                                <div>
                                    <Select
                                        value={current.month()}
                                        onChange={(month) => {
                                            const newValue = current.clone().month(month);
                                            onChange(newValue);
                                        }}
                                        style={{ width: 100 }}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <Select.Option key={i} value={i}>
                                                {dayjs().month(i).format('MMMM')}  {/* แสดงชื่อเดือนเป็นภาษาไทย */}
                                            </Select.Option>
                                        ))}
                                    </Select>

                                    <Tooltip title="สรุปข้อมูล">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<AiFillSignal />}
                                            onClick={handleNavigateToSummary} // ใช้ชื่อฟังก์ชันใหม่
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    }}
                />

                </div>

                <div className='showContent' style={{ width: '30%', marginLeft: '10px', overflowX: 'auto', height: '100vh' }}>
                    <h1 className='titleCalender'>รายการบันทึก
                    <Button type="primary" onClick={showDrawer}>
                        ดูคำแนะนำ
                    </Button>
                    </h1>
                    
                    {getContentForDay(selectedDate?.toDate() || null)}

                </div>
            </div>

            <Modal
                title="เพิ่มอารมณ์ของวันนี้"
                visible={isModalOpen}
                onOk={handleSubmit} // ใช้ handleSubmit เมื่อคลิกปุ่ม OK
                onCancel={handleCancel}
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="emotion"
                    label="เลือกอารมณ์ของคุณ"
                    rules={[{ required: true, message: 'กรุณาเลือกอารมณ์ของคุณ!' }]}
                >
                    <Select
                        value={emotionID} 
                        onChange={setEmotionID}
                    >
                        {emotionPatients.map(opt => (
                            <Select.Option key={opt.ID} value={opt.ID}>
                                {opt.Emoticon} {opt.Name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="อธิบายเหตุการณ์หน่อย"
                    rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}
                >
                    <Input.TextArea 
                        value={activity} 
                        onChange={(e) => setActivity(e.target.value)} 
                        rows={4} 
                    />
                </Form.Item>
            </Form>
            </Modal>
            </div>
        </div>
        </div>
        <Drawer title="คำแนะนำ" onClose={onClose} open={open}>
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
                        fontFamily: 'Noto Sans Thai',
                    }}
                >
                    <div className="Loading-Data-SelfCom"></div>
                    <div className="text">ยังไม่มีคำแนะนำ</div>
                </div>
            )}
            </div>
        </Drawer>

        <Modal
            title="แก้ไขอารมณ์และกิจกรรม"
            visible={isModalOpenEdit}
            onOk={handleSubmitEdit} // ใช้ handleSubmit เมื่อคลิกปุ่ม OK
            onCancel={handleCancel}
            okText="บันทึก"
            cancelText="ยกเลิก"
        >
            <Form form={form} layout="vertical">
                {/* อารมณ์ */}
                <Form.Item
                    name="emotion"
                    label="เลือกอารมณ์ของคุณ"
                    rules={[{ required: true, message: 'กรุณาเลือกอารมณ์ของคุณ!' }]}
                >
                    <Select
                        value={emotionID} 
                        onChange={(value) => setEmotionID(value)}
                    >
                        {emotionPatients.map(opt => (
                            <Select.Option key={opt.ID} value={opt.ID}>
                                {opt.Emoticon} {opt.Name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* คำอธิบายกิจกรรม */}
                <Form.Item
                    name="description"
                    label="อธิบายเหตุการณ์หน่อย"
                    initialValue={editingEvent?.Activity} // ตั้งค่าข้อมูลกิจกรรมเดิมจาก editingEvent
                    rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}
                >
                    <Input.TextArea 
                        value={activity} 
                        onChange={(e) => setActivity(e.target.value)} 
                        rows={4} 
                    />
                </Form.Item>
            </Form>
        </Modal>

    </div>
    </ConfigProvider>
);
}

export default Activity;
