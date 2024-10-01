import React, { useEffect, useState } from 'react';
import { ConfigProvider, Calendar, theme, Button, Modal, Form, Input, DatePicker, TimePicker } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import './Calendar.css'
dayjs.locale('th'); // Set the locale to Thai

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log('Panel Change:', value.format('DD MMMM YYYY'), mode);
};

const Planner = [
  {
    'id':1,
    'startTime':'09:00',
    'title':'ประชุม'
  },
  {
    'id':2,
    'startTime':'10:30',
    'title':'นัดพบผู้ป่วย'
  },
  {
    'id':3,
    'startTime':'11:30',
    'title':'ส่งผลการตรวจ'
  },
  {
    'id':4,
    'startTime':'13:00',
    'title':'นัดพบผู้ป่วย'
  },
  {
    'id':5,
    'startTime':'14:00',
    'title':'นัดพบผู้ป่วย'
  },
  
]


function PsyCalendar() {
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
 
  

  const onSelect = (value: Dayjs) => {
    setSelectedDate(value);
    console.log('Selected Date:', value.format('DD-MMMM-YYYY'));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const date = values.date.format('DD MMMM YYYY');
        const startTime = values.startTime ? values.startTime.format('HH:mm น.') : '';
        const endTime = values.endTime ? values.endTime.format('HH:mm น.') : '';

        form.resetFields();
        setIsModalVisible(false);
        console.log('Event Details:', values);
        alert(`Event Added:\nDate: ${date}\nStart Time: ${startTime}\nEnd Time: ${endTime}\nTitle: ${values.title}\nDescription: ${values.description}`);
        // API ลงดาต้าเบส
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({ 
        date: selectedDate, 
        startTime: selectedDate,
        endTime: selectedDate, });
    }
  }, [selectedDate, isModalVisible]);


  const wrapperStyle: React.CSSProperties = {
    width: 350,
    height:300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: 0,
  };

  return (
    <ConfigProvider 
        locale={thTH}
        theme={{
            components:{
                Calendar:{
                    miniContentHeight: 128,
                },
                Button:{
                }
            },

            token:{
                colorPrimary: '#63C592',
                colorText:'#585858'
            }
        }}>
      
        <div className='Calendar-contianer' style={wrapperStyle}>
            <Calendar 
            fullscreen={false} 
            onPanelChange={onPanelChange} 
            onSelect={onSelect}
            />
            
            <Modal
            title="กิจกรรมใหม่"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ date: selectedDate }}
            >
                <Form.Item
                name="date"
                label="วันที่"
                >
                <DatePicker disabled defaultValue={selectedDate} format="DD MMMM YYYY" />
                </Form.Item>
                <Form.Item
                name="startTime"
                label="เวลาเริ่ม"
                >
                <TimePicker format="HH:mm" minuteStep={15} />
                </Form.Item>
                <Form.Item
                name="endTime"
                label="เวลาสิ้นสุด"
                >
                <TimePicker format="HH:mm" minuteStep={15} />
                </Form.Item>
                <Form.Item
                name="title"
                label="หัวข้อกิจกรรม"
                rules={[{ required: true, message: 'กรุณาระบุหัวข้อกิจกรรม' }]}
                >
                <Input />
                </Form.Item>
            </Form>
            </Modal>
        </div> 
        <b style={{position:'absolute',marginTop:18,marginLeft:9,fontSize:18,color:'#B9B9B9' }}>{selectedDate.format('DD MMMM YYYY')}</b>
        <Button type="primary" onClick={showModal} style={{ marginTop: 16 ,left:230,}}>
          <b style={{fontSize:20}}>+</b>กิจกรรมใหม่
        </Button>

        <div className='plannerDetail' style={{position:'relative',width:'94%',height:'30%',marginLeft:'3%',top:'4%',display:'flex',gap:'1rem',flexDirection:'column',overflow:'auto'}}>
          {Planner.map((Planner)=>(
            <a key={Planner.id}>
              <span className='startTime' style={{color:'#B9B9B9'}}><b>{Planner.startTime}</b></span>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:'#585858'}}>{Planner.title}</span>
              <div className='line' style={{width:'90%',height:'1%',background:'#f3f3f3',position:'relative'}}></div>
            </a>
            

          ))}
        </div>
    </ConfigProvider>
  );
}

export default PsyCalendar;
