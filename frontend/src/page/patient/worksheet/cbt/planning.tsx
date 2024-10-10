import React, { useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Calendar, Badge, Modal, Form, Select, List, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FaUnlockAlt } from "react-icons/fa";
import { SelectProps } from 'antd';

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

  const options: SelectProps['options'] = [
    { value: 'green', label: '🙂 Happy' },
    { value: 'red', label: '😡 Angry' },
    { value: 'yellow', label: '😕 Confused' },
    { value: 'purple', label: '😢 Sad' },
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
        {dayEvents.map((event, index) => (
          <li key={index}>
            <Badge color={event.emotion} text={options.find(opt => opt.value === event.emotion)?.label} />
          </li>
        ))}
      </ul>
    );
  };

  const groupedEvents = events.reduce((acc, event) => {
    const hour = parseInt(event.time.split(':')[0], 10);
    const timeSlot = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    if (!acc[timeSlot]) {
      acc[timeSlot] = [];
    }
    acc[timeSlot].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
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

              <div style={{ width: '30%' }}>
                <h1 className='titleCalender'>Upcoming</h1>
                {Object.keys(groupedEvents).map((slot) => (
                  <div key={slot}>
                    <div className='period'>
                      <h3>{slot}</h3>
                    </div>
                    <List
                      itemLayout="horizontal"
                      dataSource={groupedEvents[slot]}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={`${options.find(opt => opt.value === item.emotion)?.label} (${item.date})`}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Modal
              title="Add Emotion"
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="emotion"
                  label="Select Emotion"
                  rules={[{ required: true, message: 'Please select an emotion!' }]}
                >
                  <Select options={options} />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input the description!' }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planning;
