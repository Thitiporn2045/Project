import React, { useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, List, Input, ConfigProvider, Dropdown, Button, Menu, Timeline, Drawer } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FaUnlockAlt } from "react-icons/fa";
import { SelectProps } from 'antd';
import { AiOutlineMore } from 'react-icons/ai';

interface Event {
date: string;
emotion: string;
description: string;
time: string;
}

const Activity: React.FC = () => {
const Books = [
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '2024-09-25', endDay: '2024-11-25', statusBook: <FaUnlockAlt />, type: 1 },
];

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
const [events, setEvents] = useState<Event[]>([]);
const [form] = Form.useForm();
const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Track the event being edited


const options: SelectProps['options'] = [
    { value: '#A8E6CE', emotion: '🙂', label: 'Happy' },
    { value: '#FF91AE',emotion: '😡', label: 'Angry' },
    { value: '#F4ED7F',emotion: '😕', label: 'Confused' },
    { value: '#B78FCB',emotion: '😢 ', label: 'Sad' },
];

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
const startDay = dayjs(Books[0].startDay, 'YYYY-MM-DD');
const endDay = dayjs(Books[0].endDay, 'YYYY-MM-DD');

const openModal = (date: Dayjs) => {
    const today = dayjs().startOf('day');
    if (!date.isSame(today, 'day')) {
    return;
    }
    setSelectedDate(date);
    setIsModalOpen(true);
};

const handleOk = () => {
    form.validateFields().then(values => {
    const currentTime = dayjs().format('HH:mm');

    setEvents([
        ...events,
        {
        date: selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
        emotion: values.emotion,
        description: values.description,
        time: currentTime,
        },
    ]);
    form.resetFields();
    setIsModalOpen(false);
    });
};

const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
};

const [open, setOpen] = useState(false);

const showDrawer = () => {
    setOpen(true);
};

const onClose = () => {
    setOpen(false);
};

const dateCellRender = (date: Dayjs) => {
    const dayEvents = events.filter(event => event.date === date.format('YYYY-MM-DD'));
    return (
    <ul className="events">
        {dayEvents.map((event, index) => {
        const option = options.find(opt => opt.value === event.emotion);
        return (
            <li key={index}>
            <Badge 
                color={getColor(option?.emotion ?? '')} // Use the correct emotion to get color
                text={`${option?.label} ${option?.emotion}`}
            />
            </li>
        );
        })}
    </ul>
    );
};

const getColor = (emotion: any): any => {
    const option = options.find(opt => opt.emotion === emotion);
    return option ? option.value : ''; // Ensure it returns a string
};

// Define the hourly ranges (now covering 00:00 - 06:00 and beyond)
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

const groupedEventsByHour = events.reduce((acc, event) => {
    const hour = parseInt(event.time.split(':')[0], 10); // Extract the hour from the event time
    const range = timeRanges.find(range => hour >= range.start && hour < range.end); // Find the matching range

    if (range) {
        if (!acc[range.label]) {
            acc[range.label] = [];
        }
        acc[range.label].push(event); // Add the event to the corresponding time range
    }
    return acc;
}, {} as Record<string, Event[]>);

console.log(groupedEventsByHour);


const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    form.setFieldsValue({
    emotion: event.emotion,
    description: event.description,
    });
    setIsModalOpen(true);
};

const handleDeleteEvent = (event: Event) => {
    setEvents(events.filter(e => e.date !== event.date || e.time !== event.time));
};

const menu = (event: Event) => (
    <Menu>
    <Menu.Item onClick={() => handleEditEvent(event)}>Edit</Menu.Item>
    <Menu.Item onClick={() => handleDeleteEvent(event)} style={{ color: 'red' }}>Delete</Menu.Item>
    </Menu>
);

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
                onSelect={openModal}
                defaultValue={dayjs()}
                disabledDate={(current) => 
                    current && 
                    (current.isAfter(endDay, 'day') || current.isBefore(startDay, 'day'))
                }
                headerRender={({ value, onChange }) => {
                    const current = value;
                    const start = startDay;
                    const end = endDay;

                    return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                        <div className='titleCalender'>{Books[0].name}</div>
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
                                {dayjs().month(i).format('MMMM')}
                            </Select.Option>
                            ))}
                        </Select>
                        </div>
                    </div>
                    );
                }}
                />

                </div>

                <div className='showContent' style={{ width: '30%', marginLeft: '10px', overflowX: 'auto', height: '100vh' }}>
                    <h1 className='titleCalender'>รายการบันทึก
                    <Button type="primary" onClick={showDrawer}>
                        Open
                    </Button>
                    </h1>
                    
                    <Timeline>
                        {Object.keys(groupedEventsByHour).map((timeSlot) => (
                            <Timeline.Item key={timeSlot}>
                                <h3>{timeSlot}</h3>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={groupedEventsByHour[timeSlot]}
                                    renderItem={item => (
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
                                                            fontSize: '45px', // Increased font size
                                                            textAlign: 'center',
                                                            padding: '8px 5px 3px 5px',
                                                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 3px 30px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',                                    
                                                            backgroundColor: String(options.find(opt => opt.value === item.emotion)?.value) || 'transparent', // Cast to string and provide fallback
                                                        }}
                                                    >
                                                        {options.find(opt => opt.value === item.emotion)?.emotion}
                                                    </div>
                                                }
                                                title={
                                                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        {options.find(opt => opt.value === item.emotion)?.label} ({item.date})
                                                        <Dropdown overlay={menu(item)} trigger={['click']} placement="bottomRight">
                                                            <Button className="action-button"><AiOutlineMore /></Button>
                                                        </Dropdown>
                                                    </span>
                                                }
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
            </div>

            <Modal
                title="เพิ่มอารมณ์ของวันนี้"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                <Form.Item
                    name="emotion"
                    label="เลือกอารมณ์ของคุณ"
                    rules={[{ required: true, message: 'กรุณาเลือกอารมณ์ของคุณ!' }]}
                >
                    <Select
                    options={options.map(opt => ({
                        value: opt.value,
                        label: (
                        <span>
                            {opt.emotion} {opt.label}
                        </span>
                        ),
                    }))}
                    />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="อธิบายเหตุการณ์หน่อย"
                    rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                </Form>
            </Modal>
            </div>
        </div>
        </div>
        <Drawer title="Basic Drawer" onClose={onClose} open={open}>
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
        </Drawer>
    </div>
    </ConfigProvider>
);
}

export default Activity;
