import { Button, ConfigProvider, Form, Input, message, Modal, Table, TableProps, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import thTH from 'antd/lib/locale/th_TH'; 
import { useEffect, useState } from 'react'
import { QuickRepliesInterface } from '../../../interfaces/psychologist/IComment';
import { CreateQuickReplies, DeleteQuickReplies, ListQuickReplies, UpdateQuickReplies } from '../../../services/https/psychologist/comment';

function PsyQuickReplies() {
  const [messageApi, contextHolder] = message.useMessage();
  const [quickReplies, setQuickReplies] = useState<QuickRepliesInterface[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const psyID = localStorage.getItem('psychologistID');

  const [form] = Form.useForm();
  //=========================================================================
  const listQuickReplies = async () => {
    let res = await ListQuickReplies(Number(psyID));
    if(res){
      setQuickReplies(res);
    }console.log(quickReplies)
  }
  //=========================================================================
  useEffect(()=>{
    listQuickReplies();
  
  },[])
  //=========================================================================

  const handleSubmit = async(values:QuickRepliesInterface) =>{
    
    const data:QuickRepliesInterface ={
      ...values,
      PsyID: Number(psyID),
    }

    let res = await CreateQuickReplies(data);
    if(res.status) {
      messageApi.success("สำเร็จ !");
      form.resetFields();
      setTimeout(() =>{
        listQuickReplies();    
      },1000);
      
    } 
    else{
      messageApi.error(res.message || "เกิดข้อผิดพลาด");
    }
    setIsModalVisible(false);

  }
//=========================================================================
  const showModal = () =>{
    setIsModalVisible(true);
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  };
//==============================Update function============================
const [editingKey, setEditingKey] = useState<number | null>();
const [editingMessage, setEditingMessage] = useState<string | undefined>('');
const [editingName, setEditingName] = useState<string | undefined>('');

const handleEdit = (record: QuickRepliesInterface) => {
  setEditingKey(record.ID);
  setEditingName(record.Name);
  setEditingMessage(record.Message);
};

const handleCancelEdit = () => {
  setEditingKey(null);
  setEditingName('');
  setEditingMessage('');
};

const handleSaveEdit = async (record: QuickRepliesInterface) => {
  let updatedRecord = { ...record,Name: editingName, Message: editingMessage };
  let res = await UpdateQuickReplies(updatedRecord);
  if (res.status) {
    messageApi.success('แก้ไขสำเร็จ!');
    setEditingKey(null);
    listQuickReplies();
  } else {
    messageApi.error(res.message || 'เกิดข้อผิดพลาด');
  }
};
//=========================================================================
const handleDelete = async (id: number) => {
  Modal.confirm({
    title: 'ยืนยันการลบ',
    content: 'คุณต้องการลบข้อความตอบกลับนี้หรือไม่?',
    okText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    onOk: async () => {
      let res = await DeleteQuickReplies(id);
      if (res.status) {
        messageApi.success('ลบสำเร็จ!');
        listQuickReplies();
      } else {
        messageApi.error(res.message || 'เกิดข้อผิดพลาด');
      }
    },
  });
};

//=========================================================================
const columns: TableProps<QuickRepliesInterface>['columns'] = [
  {
    title: 'ชื่อ',
    dataIndex: 'Name',
    key: 'Name',
    width: '25%',
    render: (text: string, record: QuickRepliesInterface) => {
      return editingKey === record.ID ? (
        <Input
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
        />
      ) : (
        text
      );
    },
  },
  {
    title: 'ข้อความที่แสดง',
    dataIndex: 'Message',
    key: 'Message',
    width: '50%',
    render: (text: string, record: QuickRepliesInterface) => {
      return editingKey === record.ID ? (
        <TextArea
          value={editingMessage}
          onChange={(e) => setEditingMessage(e.target.value)}
        />
      ) : (
        text
      );
    },
  },
  {
    title: 'จัดการ',
    dataIndex: 'action',
    key: 'Action',
    width: '25%',
    render: (_: any, record: QuickRepliesInterface) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {editingKey === record.ID ? (
          <>
            <Button type="primary" onClick={() => handleSaveEdit(record)}>
              บันทึก
            </Button>
            <Button onClick={handleCancelEdit}>ยกเลิก</Button>
          </>
        ) : (
          <>
            <Button type="link" onClick={() => handleEdit(record)}>
              แก้ไข
            </Button>
            <Button type="link" danger onClick={() => handleDelete(Number(record.ID))}>
              ลบ
            </Button>
          </>
        )}
      </div>
    ),
  },
];
  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Input: {},
          Modal: {
            titleFontSize:20,
            
          },
        },
        token: {
          colorPrimary: '#2C9F99',
          colorText:'#585858',
          fontFamily: 'Noto Sans Thai, sans-serif',
        },
      }}
    >     
    {contextHolder}  
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', marginLeft: '6%',}}>
        <div style={{ width: '100%', height: '70%', background: 'transparent', display: 'flex', flexDirection: 'column',}}>
          <div style={{width:'100%',display:'flex',flexDirection:'row',paddingBottom:'0.5rem',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>ตั้งค่าข้อความตอบกลับ</div>
            <Button type='primary' onClick={showModal}>+ สร้างใหม่</Button>
            <Modal
              title='สร้างข้อความตอบกลับ (Quick Replies)'
              open={isModalVisible}
              onCancel={handleCancel}
              okText={'บันทึก'}
              onOk={()=>form.submit()}
              style={{fontSize:32}}
            >
              <Form 
                form={form}
                onFinish={handleSubmit}
              >
              <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{fontSize:16}}>ชื่อ</div>
                <Form.Item
                  name={'Name'}
                  rules={[{ required: true, message: 'กรุณากรอกชื่อ !' }]}
                >
                  <Input 
                    showCount 
                    maxLength={25} 
                    placeholder="ตัวอย่าง: ชื่นชมความก้าวหน้า" 
                  />
                </Form.Item>
              </div>

              <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{fontSize:16}}>ข้อความ</div>
                <Form.Item
                  name={'Message'}
                  rules={[{ required: true, message: 'กรุณากรอกข้อความ !' }]}
                >
                  <TextArea
                    placeholder='ตัวอย่าง: ดีมากค่ะ/ครับ! คุณกำลังก้าวหน้าในการเรียนรู้และปรับเปลี่ยนความคิด การฝึกฝนแบบนี้จะช่วยให้คุณมั่นใจยิ่งขึ้นค่ะ/ครับ'></TextArea>
                </Form.Item>
              </div>

                
              </Form>

            </Modal>

          </div>
          <div
            className="quickRpliesSetting-container"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Table dataSource={quickReplies} columns={columns}  pagination={{ pageSize: 5 }}  />
        
            
          </div>

        </div>
      </div>

    
    </ConfigProvider> 
  )
}

export default PsyQuickReplies