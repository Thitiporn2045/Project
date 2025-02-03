import React, { useEffect, useState } from 'react';
import { ConfigProvider, Calendar, theme, Button, Modal, Form, Input, DatePicker, TimePicker, message } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import './Calendar.css'
import { WorkScheduleInterface } from '../../../interfaces/psychologist/IWorkSchedule';
import { CreateWorkSchedule, DeleteWorkSchedule, ListWorkSchedule } from '../../../services/https/psychologist/workschedule';
dayjs.locale('th'); // Set the locale to Thai

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log('Panel Change:', value.format('DD MMMM YYYY'), mode);
};


function PsyCalendar() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleInterface[]>([]);
  const psyID = localStorage.getItem('psychologistID') 

  const [form] = Form.useForm();
 
  const listWorkSchedule = async () => {
    if (psyID) {
      const res = await ListWorkSchedule(Number(psyID), String(selectedDate.format('DD-MM-YYYY')));
      if (res) {
        setWorkSchedule(res);
      }else{
        setWorkSchedule([]);
      }
    }
  };

  useEffect(() => {
    listWorkSchedule();
  }, [selectedDate]);
  

  const onSelect = (value: Dayjs) => {
    setSelectedDate(value);
    listWorkSchedule();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async() => {
    const values = await form.validateFields();
    const workScheduleData: WorkScheduleInterface = {
      Topic: values.Title,
      Date: values.Date?.format('DD-MM-YYYY'),
      StartTime: values.StartTime?.format('HH:mm'),
      EndTime: values.EndTime?.format('HH:mm'),
      PsyID: Number(psyID),
    };

    const res = await CreateWorkSchedule(workScheduleData);
      if (res.status) {
        messageApi.success('เพิ่มตารางงานสำเร็จ!');
        await listWorkSchedule(); 
        setIsModalVisible(false);
        form.resetFields();
      } else {
        messageApi.error(res.message || 'การเพิ่มตารางงานล้มเหลว');
      }
  };

  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({ 
        Date: selectedDate, 
        StartTime: selectedDate,
        EndTime: selectedDate, });
    }
  }, [selectedDate, isModalVisible]);

  const handleDelete = async (id: number) => {
    const res = await DeleteWorkSchedule(id);
    if (res.status) {
      messageApi.success('ลบตารางงานสำเร็จ!');
      await listWorkSchedule();
    } else {
      messageApi.error('การลบล้มเหลว');
    }
  };

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    height:300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: 0,
    position:'relative'
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
                colorPrimary: '#2c9f99',
                colorText:'#585858'
            }
        }}>
        {contextHolder}
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',width:'100%',height:'90%',alignItems:'center',}}>
      
          <div style={{width:'100%',height:'50%',display:'flex',justifyContent:'center'}}>
            <div className='Calendar-contianer' style={wrapperStyle}>
                <Calendar 
                fullscreen={false} 
                onPanelChange={onPanelChange} 
                onSelect={onSelect}
                />
            </div>
          </div>    
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
                  name="Date"
                  label="วันที่"
                  >
                  <DatePicker disabled defaultValue={selectedDate} format="DD MMMM YYYY" />
                  </Form.Item>
                  <Form.Item
                  name="StartTime"
                  label="เวลาเริ่ม"
                  >
                  <TimePicker format="HH:mm" minuteStep={15} />
                  </Form.Item>
                  <Form.Item
                  name="EndTime"
                  label="เวลาสิ้นสุด"
                  >
                  <TimePicker format="HH:mm" minuteStep={15} />
                  </Form.Item>
                  <Form.Item
                  name="Title"
                  label="หัวข้อกิจกรรม"
                  rules={[{ required: true, message: 'กรุณาระบุหัวข้อกิจกรรม' }]}
                  >
                  <Input showCount maxLength={30} />
                  </Form.Item>
              </Form>
              </Modal>

          <div style={{display:'flex',flexDirection:'column',width:'90%',flexGrow:1,gap:'0.5rem',}}>
            <div style={{display:'flex',flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
              <b style={{fontSize:18,color:'#B9B9B9' }}>{selectedDate.format('DD MMMM YYYY')}</b>
              <Button type="primary" onClick={showModal} style={{}}>
                <b style={{fontSize:20}}>+</b>กิจกรรมใหม่
              </Button>
            </div>

            <div className='plannerDetail' style={{position:'relative',width:'100%',height:'95%',maxHeight:'250px',display:'flex',flexDirection:'column',overflow:'auto'}}>
              {workSchedule.length > 0 ? (
              workSchedule.map((schedule) => (
                <div key={schedule.PsyID} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f3f3' ,alignItems:'center'}}>
                  <div>
                    <span style={{ color: '#B9B9B9', fontWeight: 'bold',fontSize:14 }}>{schedule.StartTime}-{schedule.EndTime}</span> &nbsp;&nbsp;&nbsp;
                    <span style={{ color: '#585858',fontSize:14 }}>{schedule.Topic}</span>
                  </div>
                  <Button 
                    type="text" 
                    danger 
                    onClick={() => handleDelete(Number(schedule.ID))}
                  >
                    ลบ
                  </Button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#B9B9B9' }}>ไม่มีข้อมูล</p>
            )}
            </div>
          </div>
        </div>
    </ConfigProvider>
  );
}

export default PsyCalendar;
