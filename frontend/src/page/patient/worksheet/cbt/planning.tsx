import React, { useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, Input, ConfigProvider, Dropdown, Button, Menu, Timeline } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FaUnlockAlt } from "react-icons/fa";
import { AiOutlineMore } from 'react-icons/ai';

interface Event {
  date: string;
  emotion: string;
  description: string;
  time: string;
  period: string; // Add a property for the selected time period
}

const Planning: React.FC = () => {
  const Books = [
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '2024-09-25', endDay: '2024-10-25', statusBook: <FaUnlockAlt />, type: 1 },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeelingModalOpen, setIsFeelingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [form] = Form.useForm();
  const [feelingForm] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Track the event being edited
  const [selectedFeelingEvent, setSelectedFeelingEvent] = useState<Event | null>(null);

  const period = [
    { value: '#A8E6CE', emotion: '🌤️', label: 'เช้า' },
    { value: '#FF91AE', emotion: '⛅', label: 'กลางวัน' },
    { value: '#F4ED7F', emotion: '🌙', label: 'เย็น' },
  ];
  
  const options = [
    { value: '#A8E6CE', emotion: '🙂', label: 'Happy' },
    { value: '#FF91AE', emotion: '😡', label: 'Angry' },
    { value: '#F4ED7F', emotion: '😕', label: 'Confused' },
    { value: '#B78FCB', emotion: '😢 ', label: 'Sad' },
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
          period: values.period, // Use the selected period from the form
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

  const dateCellRenderPeriod = (date: Dayjs) => {
    const dayEventPeriod = events.filter(event => event.date === date.format('YYYY-MM-DD'));
    return (
      <ul className="events">
        {dayEventPeriod.map((event, index) => {
          const option = period.find(per => per.value === event.emotion);
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
    const option = period.find(per => per.emotion === emotion);
    return option ? option.value : ''; // Ensure it returns a string
  };
  
  const groupedEvents = events.reduce((acc, event) => {
    const timeSlot = event.period; // Use the period property from the event
    if (!acc[timeSlot]) {
      acc[timeSlot] = [];
    }
    acc[timeSlot].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleAddFeeling = (event: Event) => {
    setSelectedFeelingEvent(event);
    feelingForm.setFieldsValue({ emotion: event.emotion }); // Pre-fill the emotion if needed
    setIsFeelingModalOpen(true);
  };

  const handleFeelingOk = () => {
    feelingForm.validateFields().then(values => {
      const updatedEvents = events.map(event => {
        if (event.date === selectedFeelingEvent?.date && event.time === selectedFeelingEvent?.time) {
          return { ...event, emotion: values.emotion }; // Update the emotion for this event
        }
        return event;
      });
      setEvents(updatedEvents);
      feelingForm.resetFields();
      setIsFeelingModalOpen(false);
    });
  };

  const handleFeelingCancel = () => {
    feelingForm.resetFields();
    setIsFeelingModalOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      emotion: event.emotion,
      description: event.description,
      period: event.period, // Include the period when editing
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setEvents(events.filter(e => e.date !== event.date || e.time !== event.time));
  };

  const menu = (event: Event) => (
    <Menu>
      <Menu.Item onClick={() => handleAddFeeling(event)}>รู้สึกอย่างไรบ้าง</Menu.Item>
      <Menu.Item onClick={() => handleEditEvent(event)}>แก้ไขกิจกรรรม</Menu.Item>
      <Menu.Item onClick={() => handleDeleteEvent(event)} style={{ color: 'red' }}>ลบกิจกรรม</Menu.Item>
    </Menu>
  );

  return (
    <ConfigProvider
      theme={{
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

                <div className='showContent-Planning' style={{ width: '30%', marginLeft: '10px', overflowX: 'auto', height: '100vh' }}>
                  <h1 className='titleCalender'>รายการบันทึก</h1>
                  {Object.keys(groupedEvents).map((slot) => (
                    <div key={slot}>
                      <div className='period'>
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
                                  fontSize: '32px', // Larger emoji
                                  textAlign: 'center',
                                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 3px 30px -5px, rgba(0, 0, 0, 0.3) 0px 3px 20px -5px',
                                  backgroundColor: item.emotion, // Use the emotion value as background color
                                }}
                              >
                                {options.find(option => option.value === item.emotion)?.emotion}
                              </div>
                            }
                            color="blue"
                          >
                            <div>
                              <div className='title-Planning'>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div className='title-event'>
                                    {item.description}
                                  </div>
                                  <Dropdown overlay={() => menu(item)} trigger={['click']}>
                                    <Button type='text'>
                                      <AiOutlineMore />
                                    </Button>
                                  </Dropdown>
                                </div>
                                <div className='day-Planning'>
                                  {item.date} เวลา: {item.time}
                                </div>
                              </div>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal for adding new events */}
              <Modal title="สร้างกิจกรรม" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="period"
                    label="ช่วงเวลา"
                    rules={[{ required: true, message: 'กรุณาเลือกช่วงเวลา!' }]}
                  >
                    <Select options={period.map(per => ({
                      value: per.emotion,
                      label: (
                        <span>
                          {per.emotion} {per.label}
                        </span>
                      ),
                    }))} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="รายละเอียดกิจกรรม"
                    rules={[{ required: true, message: 'กรุณากรอกรายละเอียด!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>

              {/* Modal for feeling after event */}
              <Modal
                title="เลือกอารมณ์หลังจากกิจกรรมนี้"
                visible={isFeelingModalOpen}
                onOk={handleFeelingOk}
                onCancel={handleFeelingCancel}
              >
                <Form form={feelingForm} layout="vertical">
                  <Form.Item label="เวลา">
                    <p>{selectedFeelingEvent?.time}</p>
                  </Form.Item>
                  <Form.Item label="วันที่">
                    <p>{selectedFeelingEvent?.date}</p>
                  </Form.Item>
                  <Form.Item label="รายละเอียดกิจกรรม">
                    <p>{selectedFeelingEvent?.description}</p>
                  </Form.Item>
                  <Form.Item
                    name="emotion"
                    label="รู้สึกอย่างไรบ้าง?"
                    rules={[{ required: true, message: 'กรุณาเลือกอารมณ์!' }]}
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
                </Form>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Planning;
