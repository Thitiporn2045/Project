import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, Input, ConfigProvider, Dropdown, Button, Menu, Timeline, Drawer, message, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { AiFillSignal, AiOutlineMore } from 'react-icons/ai';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';
import { ActivityPlanningInterface } from '../../../../interfaces/activityPlanning/IActivityPlanning';
import { CommentInterface } from '../../../../interfaces/psychologist/IComment';
import { TimeOfDayInterface } from '../../../../interfaces/timeOfDay/ITimeOfDay';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../../services/https/diary';
import { ListCommentByDiaryId } from '../../../../services/https/psychologist/comment';
import { CreateActivityPlanning, GetActivityPlanningByDiaryID, ListTimeOfDays, UpdateActivityPlanning } from '../../../../services/https/cbt/activityPlanning/activityPlanning';
import moment from 'moment';
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import noDataGif from '../../../../assets/noData.gif';
import { GetPatientById } from '../../../../services/https/patient';
import { PatientInterface } from '../../../../interfaces/patient/IPatient';
import thTH from 'antd/lib/locale/th_TH';

const Planning: React.FC = () => {
dayjs.locale('th'); // ตั้งค่า locale เป็นภาษาไทย
const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
const [patient, setPatient] = useState<PatientInterface>();
const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
const [planningDiary, setPlanningDiary] = useState<ActivityPlanningInterface[]>([]);
const [comments, setComments] = useState<CommentInterface[]>([]);
const [timeOfDay, setTimeOfDay] = useState<TimeOfDayInterface[]>([]); 

const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
const [isModalOpen, setIsModalOpen] = useState(false);
const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());    
const [form] = Form.useForm();
const [editingEvent, setEditingEvent] = useState<ActivityPlanningInterface | null>(null); // Track the event being edited
const timeOfDayOrder = ['🌤️ เช้า', '⛅ กลางวัน', '🌙 เย็น'];

const [messageApi, contextHolder] = message.useMessage();
const startDay = dayjs(diary?.Start, 'DD-MM-YYYY');
const endDay = dayjs(diary?.End, 'DD-MM-YYYY');
const [activity, setActivity] = useState('');
const [timeOfDayID, setTimeOfDayID] = useState('');

const [isFeelingModalOpen, setIsFeelingModalOpen] = useState(false);
// const [events, setEvents] = useState<Event[]>([]);
const [feelingForm] = Form.useForm();
const [selectedFeelingEvent, setSelectedFeelingEvent] = useState<ActivityPlanningInterface | null>(null);

const fetchPatientData = async () => {
    const res = await GetPatientById(Number(patID));
    if (res) {
        setPatient(res);
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

const fetchTimeOfDays = async () => {
    const res = await ListTimeOfDays(); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
    if (res) {
    setTimeOfDay(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
    }
    console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
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

const fetchActivityPlanningByDiary = async () => {
    if (diaryID) {
        try {
            const res = await GetActivityPlanningByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
            if (res) {
            setPlanningDiary(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
            }
            console.log('ActivityPlanning:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
        } catch (error) {
            console.error('Error fetching ActivityPlanning data:', error); // แสดงข้อผิดพลาด
        }
    }
};

useEffect(() => {
    fetchPatientData();
    fetchTimeOfDays();
    fetchEmotionPatientData();
    fetchDiaryByDiary();
    fetchCommentsByDiaryID();
    fetchActivityPlanningByDiary();
}, []);

const [open, setOpen] = useState(false);

const showDrawer = () => {
    setOpen(true);
};

const onClose = () => {
    setOpen(false);
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

const handleSubmit = async () => {
        // ตรวจสอบให้แน่ใจว่ามีการเลือกอารมณ์และกรอกคำอธิบายแล้ว
        if (!timeOfDayID || !activity) {
            messageApi.error('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        // แปลง emotionID เป็น number
        const timeOfDayIDNumber = Number(timeOfDayID); // แปลงจาก string เป็น number
    
        if (isNaN(timeOfDayIDNumber)) {
            messageApi.error('ช่วงเวลาไม่ถูกต้อง');
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
            Activity: activity,
            Time: moment().format('HH:mm:ss'), // ใช้ moment เพื่อดึงเวลาปัจจุบันในฟอร์แมต 'HH:mm:ss'
            DiaryID: Number(diaryID), // เพิ่ม diaryID ที่ดึงมาจาก URL
            TimeOfDayID: Number(timeOfDayID),
        };
    
        try {
            // ส่งข้อมูลไปยัง backend API (POST)
            const response = await CreateActivityPlanning(data);
    
            if (response.status) {
                setIsModalOpen(false);
                messageApi.success('บันทึกข้อมูลสำเร็จ');
                fetchActivityPlanningByDiary();
            } else {
                messageApi.error(`ไม่สามารถบันทึกข้อมูลได้: ${response.message}`);
            }
        } catch (err) {
            console.error('Error:', err);
            messageApi.error('ไม่สามารถบันทึกข้อมูลได้');
        }
    };

const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
};

const dateCellRenderPeriod = (date: Dayjs) => {
    // กรองกิจกรรมตามวันที่
    const dayEventPeriod = planningDiary.filter(event => event.Date === date.format('DD-MM-YYYY'));

    // เรียงลำดับกิจกรรมตาม timeOfDayOrder
    const sortedDayEventPeriod = dayEventPeriod.sort((a, b) => {
    const timeA = `${a.TimeOfDay?.Emoticon || ''} ${a.TimeOfDay?.Name || ''}`;
    const timeB = `${b.TimeOfDay?.Emoticon || ''} ${b.TimeOfDay?.Name || ''}`;
    return timeOfDayOrder.indexOf(timeA) - timeOfDayOrder.indexOf(timeB);
    });

    return (
    <ul className="events">
        {sortedDayEventPeriod.map((event, index) => (
        <li key={index} style={{ fontFamily: 'Noto Sans Thai' }}>
            <Badge
            color={event?.Emotion?.ColorCode} // ใช้ Emotion เพื่อกำหนดสี
            text={`${event?.TimeOfDay?.Emoticon || ''} ${event?.TimeOfDay?.Name || 'ไม่ระบุ'}`}
            />
        </li>
        ))}
    </ul>
    );
};

const navigate = useNavigate();
const handleNavigateToSummary = () => {
    if (diary && diary.ID) {
        navigate(`/SummaryPlanning?id=${diary.ID}`); // ใช้ query parameter แทน
    } else {
        console.warn("Diary ID is missing");
    }
};

function darkenRGBColor(rgbColor: any, percent: any) {
    const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgbColor;

    const r = Math.max(0, parseInt(match[1], 10) - (255 * percent / 100));
    const g = Math.max(0, parseInt(match[2], 10) - (255 * percent / 100));
    const b = Math.max(0, parseInt(match[3], 10) - (255 * percent / 100));

    return `rgb(${r}, ${g}, ${b})`;
}

const getContentForDay = (date: Date | null) => {
    if (!date) {
        return <p>กรุณาเลือกวันที่</p>;
    }

    const formattedDate = dayjs(date).format('DD/MM/YYYY'); // แปลงวันที่เป็นฟอร์แมต 'DD/MM/YYYY'

    // ค้นหาข้อมูลที่ตรงกับวันที่เลือก
    const eventsForDay = planningDiary?.filter(item =>
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
                    fontFamily: 'Noto Sans Thai',
                }}
            >
                <div className="Loading-Data-SelfDay"></div>
                <div className="text">ไม่มีข้อมูลสำหรับวันที่ {formattedDate}</div>
            </div>
        );
    }

// จัดกลุ่มข้อมูลตาม TimeOfDay.Name
const groupedEvents = eventsForDay.reduce((acc, event) => {
    const emotion = event.TimeOfDay?.Emoticon || ''; // ดึง Emotion ถ้ามี
    const name = event.TimeOfDay?.Name || 'ไม่ระบุ'; // ดึงชื่อ ถ้ามี หรือใช้ 'ไม่ระบุ'
    const timeSlot = `${emotion} ${name}`; // รวม Emotion กับชื่อเป็น key

    if (!acc[timeSlot]) {
        acc[timeSlot] = [];
    }
    acc[timeSlot].push(event);
    return acc;
}, {} as Record<string, ActivityPlanningInterface[]>);

// เรียงลำดับช่วงเวลาตาม timeOfDayOrder
const sortedSlots = Object.keys(groupedEvents).sort((a, b) => {
    return timeOfDayOrder.indexOf(a) - timeOfDayOrder.indexOf(b);
});

// แสดงข้อมูลในรูปแบบ Timeline
return (
    <>
        {sortedSlots.map(slot => (
            <div key={slot}>
                <div className="period">
                    <h3>{slot}</h3>
                </div>
                <Timeline>
                    {groupedEvents[slot].map((item, index) => (
                        <Timeline.Item
                            key={index}
                            dot={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    fontSize: '32px', // ขนาดใหญ่สำหรับ Emoji
                                    textAlign: 'center',
                                    boxShadow:
                                        'rgba(50, 50, 93, 0.25) 0px 3px 30px -5px, rgba(0, 0, 0, 0.3) 0px 3px 20px -5px',
                                    backgroundColor:
                                        emotionPatients.find(opt => opt.ID === item.EmotionID)?.ColorCode || 'transparent',
                                    fontFamily: 'Noto Sans Thai',
                                }}
                            >
                                {emotionPatients.find(opt => opt.ID === item.EmotionID)?.Emoticon ? (
                                    emotionPatients.find(opt => opt.ID === item.EmotionID)?.Emoticon
                                ) : (
                                <img
                                    src={noDataGif}
                                    alt="No Data"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                                )}
                            </div>
                            }
                            
                        >
                            <div>
                                <div className="title-Planning" >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' ,fontFamily: 'Noto Sans Thai', }}>
                                        <div className="day-Planning">
                                        <div className='mainTetx'>
                                            {patient?.Firstname} วันที่ {item.Date} 
                                        </div>
                                        <div className='text'>
                                            เวลา: {item.Time}
                                        </div>
                                        </div>
                                        {/* คุณสามารถเปิด Dropdown เมนูตรงนี้ได้ */}
                                        <Dropdown overlay={() => menu(item)} trigger={['click']}>
                                            <Button type="text">
                                                <AiOutlineMore />
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="title-event" style={{fontFamily: 'Noto Sans Thai', }}>กิจกรรม: {item.Activity}</div>
                                    <div className="title-fell" 
                                        style={{
                                            fontFamily: 'Noto Sans Thai',                                             }}
                                    >ความรู้สึก: {emotionPatients.find(opt => opt.ID === item.EmotionID)?.Name}</div>
                                    <div
                                        style={{
                                            background: emotionPatients.find(opt => opt.ID === item.EmotionID)?.ColorCode || '#f0f0ff',
                                            borderRadius: '1rem',
                                            height: '.4rem',
                                            marginTop: '.8rem',
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        ))}
    </>
);
}

const handleAddFeeling = (event: ActivityPlanningInterface) => {
    setSelectedFeelingEvent(event);
    feelingForm.setFieldsValue({ emotion: event.Emotion }); // Pre-fill the emotion if needed
    setIsFeelingModalOpen(true);
};

const handleFeelingOk = async () => {
    try {
        const values = await feelingForm.validateFields(); // ตรวจสอบฟอร์ม

        // เตรียมข้อมูลที่ต้องการส่งไปยัง API
        const updatedEvent: ActivityPlanningInterface = {
            ...selectedFeelingEvent,
            EmotionID: values.Emotion, // อัปเดต EmotionID
        };

        // เรียกใช้ API อัปเดตกิจกรรม
        const updateResult = await UpdateActivityPlanning(updatedEvent);

        if (updateResult.status) {
            // การอัปเดตสำเร็จ
            console.log('Event updated successfully:', updateResult.message);

            // อัปเดตสถานะใน state ของ planningDiary
            setPlanningDiary(prevState =>
                prevState.map(event =>
                    event.ID === updatedEvent.ID ? updatedEvent : event
                )
            );

            // รีเซ็ตฟอร์มและปิด Modal
            feelingForm.resetFields();
            setIsFeelingModalOpen(false);

            // แสดงข้อความสำเร็จ
            message.success('อารมณ์ถูกบันทึกสำเร็จ');
        } else {
            // การอัปเดตล้มเหลว
            console.error('Failed to update feeling:', updateResult.message);
            message.error(updateResult.message);
        }
    } catch (error) {
        console.error('Error updating feeling:', error);
        message.error('เกิดข้อผิดพลาดในการบันทึกอารมณ์');
    }
};

const handleEditEvent = (event: ActivityPlanningInterface) => {
    setEditingEvent(event); // เก็บข้อมูลกิจกรรมที่กำลังแก้ไขใน state
    form.setFieldsValue({
        Activity: event.Activity, // รายละเอียดกิจกรรมเดิม
        TimeOfDay: event.TimeOfDayID, // ช่วงเวลาเดิม
        emotion: event.EmotionID, // อารมณ์เดิม (ถ้ามี)
    });
    setIsModalOpen(true); // เปิด Modal
};

const handleSubmitEdit = async () => {
try {
    const values = await form.validateFields(); // ตรวจสอบฟอร์ม
    
    const updatedEvent: ActivityPlanningInterface = {
        ...editingEvent,
        TimeOfDayID: values.TimeOfDay,
        Activity: values.Activity,
    };

    const updateResult = await UpdateActivityPlanning(updatedEvent); // เรียก API

    if (updateResult.status) {
        setPlanningDiary(prevState => 
            prevState.map(item => 
                item.ID === updatedEvent.ID ? updatedEvent : item
            )
        );
        message.success('กิจกรรมได้รับการอัปเดตสำเร็จ');
        setIsModalOpen(false); // ปิด Modal
    } else {
        message.error(updateResult.message);
    }
} catch (error) {
    message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
}
};

const menu = (event: ActivityPlanningInterface) => (
    <Menu>
        <Menu.Item onClick={() => handleAddFeeling(event)}>รู้สึกอย่างไรบ้าง</Menu.Item>
        {/* <Menu.Item onClick={() => handleEditEvent(event)}>แก้ไขกิจกรรม</Menu.Item> */}
    </Menu>
);

return (
    <ConfigProvider
    locale={thTH}
    theme={{
        token: {
        colorPrimary: '#9BA5F6', // Example of primary color customization
        fontFamily:'Noto Sans Thai, sans-serif'
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
                    dateCellRender={dateCellRenderPeriod}
                    onSelect={openModal}
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
                            {/* <Select
                            value={current.month()}
                            onChange={(month) => {
                                const newValue = current.clone().month(month);
                                onChange(newValue);
                            }}
                            style={{ width: 100 }}
                            >
                            {Array.from({ length: 12 }, (_, i) => (
                                <Select.Option key={i} value={i}>
                                {dayjs().month(i).format('MMMM')}
                                </Select.Option>
                            ))}
                            </Select> */}
                            <Tooltip title="สรุปข้อมูล">
                                <Button
                                    className='TooltipSummary'
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

                <div className='showContent-Planning' style={{ width: '30%', marginLeft: '10px', overflowX: 'auto', height: '100vh' }}>
                <h1 className='titleCalender'>รายการบันทึก
                    <Button type="primary" onClick={showDrawer}>
                    ดูคำแนะนำ
                    </Button>
                </h1>
                
                {getContentForDay(selectedDate?.toDate() || null)}

                </div>
            </div>

            {/* Modal for adding new events */}
            <Modal title="สร้างกิจกรรม" open={isModalOpen} onOk={handleSubmit} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                <Form.Item
                    name="TimeOfDay"
                    label="ช่วงเวลา"
                    rules={[{ required: true, message: 'กรุณาเลือกช่วงเวลา!' }]}
                >
                    <Select
                        value={timeOfDayID} 
                        onChange={setTimeOfDayID}
                    >
                        {timeOfDay.map(opt => (
                            <Select.Option key={opt.ID} value={opt.ID}>
                                {opt.Emoticon} {opt.Name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="Activity"
                    label="รายละเอียดกิจกรรม"
                    rules={[{ required: true, message: 'กรุณากรอกรายละเอียด!' }]}
                >
                    <Input.TextArea 
                        value={activity} 
                        onChange={(e) => setActivity(e.target.value)} 
                        rows={4} 
                    />
                </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="แก้ไขกิจกรรม"
                visible={isModalOpenEdit}
                onOk={handleSubmitEdit}
                onCancel={() => setIsModalOpen(false)}
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
                <Form form={form} layout="vertical">
                    {/* ช่วงเวลา */}
                    <Form.Item
                        name="TimeOfDay"
                        label="เลือกช่วงเวลา"
                        rules={[{ required: true, message: 'กรุณาเลือกช่วงเวลา!' }]}
                    >
                        <Select>
                            {timeOfDay.map(opt => (
                                <Select.Option key={opt.ID} value={opt.ID}>
                                    {opt.Emoticon} {opt.Name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* รายละเอียดกิจกรรม */}
                    <Form.Item
                        name="Activity"
                        label="รายละเอียดกิจกรรม"
                        rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal for feeling after event */}
            <Modal
                title="เลือกอารมณ์หลังจากกิจกรรมนี้"
                visible={isFeelingModalOpen}
                onOk={handleFeelingOk} // ใช้ฟังก์ชัน handleFeelingOk เมื่อกดตกลง
                onCancel={() => {
                    feelingForm.resetFields(); // รีเซ็ตฟอร์มเมื่อปิด Modal
                    setIsFeelingModalOpen(false);
                }}
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
                <Form form={feelingForm} layout="vertical">
                    {/* เวลา */}
                    <Form.Item label="เวลา">
                        <p>{selectedFeelingEvent?.Time}</p>
                    </Form.Item>

                    {/* วันที่ */}
                    <Form.Item label="วันที่">
                        <p>{selectedFeelingEvent?.Date}</p>
                    </Form.Item>

                    {/* รายละเอียดกิจกรรม */}
                    <Form.Item label="รายละเอียดกิจกรรม">
                        <p>{selectedFeelingEvent?.Activity}</p>
                    </Form.Item>

                    {/* เลือกอารมณ์ */}
                    <Form.Item
                        name="Emotion"
                        label="รู้สึกอย่างไรบ้าง?"
                        rules={[{ required: true, message: 'กรุณาเลือกอารมณ์!' }]}
                    >
                        <Select>
                            {emotionPatients.map(opt => (
                                <Select.Option key={opt.ID} value={opt.ID}>
                                    {opt.Emoticon} {opt.Name}
                                </Select.Option>
                            ))}
                        </Select>
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
    </div>
    </ConfigProvider>
);
};

export default Planning;
