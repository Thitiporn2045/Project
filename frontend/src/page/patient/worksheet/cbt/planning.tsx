import React, { useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, List, Input, ConfigProvider, Dropdown, Button, Menu, Timeline } from 'antd';
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

const Planning: React.FC = () => {
  const Books = [
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '2024-09-25', endDay: '2024-10-25', statusBook: <FaUnlockAlt />, type: 1 },
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
  
  const groupedEvents = events.reduce((acc, event) => {
    const hour = parseInt(event.time.split(':')[0], 10);
    const timeSlot = hour < 12 ? 'เช้า' : hour < 18 ? 'กลางวัน' : 'เย็น';
    if (!acc[timeSlot]) {
      acc[timeSlot] = [];
    }
    acc[timeSlot].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

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
                                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 3px 30px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',                                    
                                  backgroundColor: String(options.find(opt => opt.value === item.emotion)?.value) || 'transparent', // Color based on emotion
                                }}
                              >
                                {options.find(opt => opt.value === item.emotion)?.emotion}
                              </div>
                            }
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <h3>{options.find(opt => opt.value === item.emotion)?.label} ({item.date})</h3>
                              <Dropdown overlay={menu(item)} trigger={['click']} placement="bottomRight">
                                <Button className="action-button"><AiOutlineMore /></Button>
                              </Dropdown>
                            </div>
                            <p>{item.description}</p>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  ))}
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
      </div>
    </ConfigProvider>
  );
}

export default Planning;
