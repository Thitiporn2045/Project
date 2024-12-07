import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Input, Form, message, Card, Dropdown, Menu, Modal, Empty } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import { FaArrowUp } from 'react-icons/fa';
import { CommentInterface } from '../../../interfaces/psychologist/IComment';
import { CreateComment, DeleteComment, ListCommentByDiaryId, UpdateComment } from '../../../services/https/psychologist/comment';
import userEmpty from '../../../assets/userEmty.png'
import { IoIosMore } from "react-icons/io";
import QuickRepliesBtn from '../../../component/psychologist/quickReplies/QuickRepliesBtn';

const { TextArea } = Input;


function PsyCommentMain() {
  const [messageApi, contextHolder] = message.useMessage();

  const [comments,setComments] = useState<CommentInterface[]>([]);

  const [isEditing, setIsEditing] = useState(false); // แก้ไขมั้ย
  const [editID, setEditID] = useState<number | null>(); //เก็บไอดีไว้เช็ค
  const [editedComment, setEditComment] = useState(""); // ค่าที่กำลังแก้ไข เอาไปใช้อัปเดต

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteID, setDeleteID] = useState<number | null>();

  const [commentText, setCommentText] = useState<string>(""); //เอาไว้เช็ค disable ปุ่ม Submit


  const [form] = Form.useForm();
  const psyID = localStorage.getItem('psychologistID') 
  const diaryID = localStorage.getItem('diaryID')
  //===============================================================================
  const listComments = async () => {
    let res = await ListCommentByDiaryId(Number(diaryID));
    if(res){
      setComments(res);
    }
  }

  useEffect(() =>{
    listComments();
  },[]);
  //===============================================================================

   // Callback สำหรับเพิ่มข้อความในช่อง Input
   const handleReplySelect = (reply: string) => {
    setCommentText((prev) => (prev ? `${prev} ${reply}` : reply)); // ต่อข้อความที่เลือก
  };
  //===============================================================================
  const isDisabled = !commentText.trim();
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value); // อัปเดตค่าเมื่อผู้ใช้พิมพ์
  };

  const handleSubmitComment = async (values: CommentInterface) => {

    const CommentData: CommentInterface = {
      ...values,
      Comment: commentText,
      PsyID: Number(psyID),
      DiaryID: Number(diaryID), 
    }

    let res = await CreateComment(CommentData);
    if (res.status) {
      messageApi.success("สำเร็จ !");
      form.resetFields();
      setTimeout(() =>{
        listComments();
      },1000);
      setCommentText("");
      
    } 
    else{
      messageApi.error(res.message || "เกิดข้อผิดพลาด");
    }
  }
  //===============================================================================
  const clickEditComment = (id:number,comment:string) => {
    setEditID(id);
    setEditComment(comment);
    setIsEditing(true);
  }
  //===============================================================================
  const handleEdit = async(commentID: number) => {
    const updateComment = comments.find(comm => comm.ID === commentID);
    const data: CommentInterface = {
      ...updateComment,
      Comment: editedComment, 
    }

    let res = await UpdateComment(data);
    if(res.status){
      messageApi.success("แก้ไขสำเร็จ!");
      listComments();
    }
    else{
      messageApi.error(res.message);
    }
    setIsEditing(false);
    setEditID(null);
    setEditComment('');

  };
 
  //===============================================================================
  const handleDeleteOk = async(commentID: number) => {
    let res = await DeleteComment(Number(commentID));
    if(res.status){
      messageApi.success("ลบความคิดเห็นแล้ว");
      setTimeout(() => {
        listComments(); 
      }, 1000);
    }
    else{
      messageApi.error(res.message || "เกิดข้อผิดพลาด");
    }
    setIsDeleteModalVisible(false);
    setDeleteID(null);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
    setDeleteID(null);
  };  

  //===============================================================================
 

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components:{
          Input: {
            inputFontSize: 16
          },
        },
        token:{
          colorPrimary: '#2C9F99',
          colorText:'#585858',
          fontFamily:'Noto Sans Thai, sans-serif'
        }
      }}
    >
      {contextHolder}
      <div 
        style={{
          width:'100%',
          height:'93%',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
      >
       
        <div className='Comments-list'
          style={{
            width:'95%',
            height:'75%',
            // minHeight:'525px',
            borderRadius: '18px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            background:'#fafafa',
          
          }}  
        >
          {comments.length === 0? (<Empty description={false}/>):( 
          <div
            style={{
              width:'98%',
              height:'95%',
              borderRadius: '18px',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              gap:'1rem',
              background:'#fafafa',
              overflow:'auto',
              scrollbarColor:'#d8d8d8 transparent',
              scrollbarWidth:'thin',
            }}
          >
            {comments.map((item)=>(
            <Card
            style={{
              width: "93%", 
              maxWidth: "600px", 
              background: "rgba(255, 255, 255, 0.2)",
              boxShadow:"0 4px 8px rgba(0, 0, 0, 0.02)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter:"blur(8px)",
              border:"1px solid rgba(93, 93, 93, 0.06)",
              borderRadius:"15px",
              wordWrap: "break-word", // ตัดข้อความตามคำ
              margin:0,
            }}
            > 
              <div style={{display:'flex',justifyContent:'space-between',flexDirection:'row'}}>              
                <div style={{display:'flex', flexDirection:'row',gap:'0.5rem',paddingBottom:'0.5rem'}}>
                  <div
                    style={{width:'45px', 
                    height:'45px',
                    backgroundImage: (item.Psychologist?.Picture === '' || undefined) ? `url(${userEmpty})`: `url(${item.Psychologist?.Picture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius:'50%'}}
                  >

                  </div>
                  <div><b>{item.Psychologist?.FirstName} {item.Psychologist?.LastName} </b><div style={{color:'#c0c0c0'}}>นักจิตวิทยา</div></div>
                </div>
                
                <div className='comment-menu'>
                    {item.PsyID === Number(psyID)? (
                      <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="edit" onClick={() => clickEditComment(Number(item.ID), String(item.Comment))}>
                            แก้ไข
                          </Menu.Item>
                          <Menu.Item key="delete" onClick={() => (setIsDeleteModalVisible(true),setDeleteID(item.ID))}>
                            ลบ
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={['hover']}
                    >
                      <Button 
                        shape="circle" 
                        icon={<IoIosMore/>} 
                        style={{ border: 'none', boxShadow: 'none',background:'transparent',fontSize:18}} 
                      />
                    </Dropdown>):("")
                  }
                  
                </div>
              </div>

              {isEditing && item.ID === editID? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Input.TextArea 
                    value={editedComment} 
                    onChange={(e) => setEditComment(e.target.value)} 
                    autoSize={{ minRows: 2, maxRows: 4 }} 
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button type="primary" onClick={() => handleEdit(Number(item.ID))}>บันทึก</Button>
                    <Button onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                  </div>
                </div>
                ) :(
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      padding:0,
                      maxWidth:300
                    }}
                  >
                    {item.Comment}
                  </p>
                </div>)
              }
            </Card>))
          }</div>)} 
        </div>
        
        <div className='Comments-Input'
            style={{
                width:'100%',
                // minHeight:'160px',
                flexGrow:1,
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                background:'white',
            }}
        >
          <Form
            form={form}
            onFinish={handleSubmitComment}
            style={{width:'100%',height:'100%', display:'flex',alignItems:'center',justifyContent:'center',}}
          >
            <div style={{width:'98%',height:'85%',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Form.Item
                noStyle
                name="Comment"
              >
                <div className='Input-area' style={{width:'98%',display:'flex',flexGrow:1,alignItems:'center',justifyContent:'center',borderRadius:'30px 30px 0 0',background:'#e8e8e8'}}>
                  <TextArea
                    placeholder="แสดงความคิดเห็นหรือคำแนะนำของคุณ"
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    value={commentText} // ผูกค่ากับ state
                    onChange={(e) => setCommentText(e.target.value)} // เรียกฟังก์ชันตอนข้อความเปลี่ยน
                    style={{
                      border:'none',
                      width:'94%',
                      height:'90%',
                      padding:0,
                      background:'transparent',
                      outline:'none',
                      boxShadow:'none',
                      scrollbarColor:'#d8d8d8 transparent',
                      scrollbarWidth:'thin',
                    }}
                  />
                </div>
              </Form.Item>

              <div className='Input-btn' style={{width:'98%',height:'38%',minHeight:'25px',display:'flex',alignItems:'center',justifyContent:'center',background:'#e8e8e8',borderRadius:'0 0 30px 30px',}}>
                  <div style={{width:'95%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                    <QuickRepliesBtn onReplySelect={handleReplySelect}/>
                    {/* <Button type='default' size='large' style={{borderRadius:30}}>
                      <IoFlash />Quick Replies
                    </Button> */}
                    <Button 
                      type='default'
                      htmlType='submit' 
                      size='large' 
                      shape='circle' 
                      style={{fontSize:20, color:'white',background: isDisabled? '#d2d2d2':'#585858'}}
                      disabled={isDisabled}
                    >
                      <FaArrowUp/>
                    </Button>
                  </div>
              </div>
            </div>
          </Form>
        </div>

          {/* Modal ยืนยันการลบ */}
        <Modal
          open={isDeleteModalVisible}
          onOk={() => handleDeleteOk(Number(deleteID))} // ฟังก์ชันยืนยันการลบ
          onCancel={handleCancel} // ฟังก์ชันยกเลิกการลบ
          okText="ลบ"
          okType='danger'
          cancelText="ไม่ใช่"
          title="ยืนยันการลบ"
          
        >
          <p>คุณต้องการลบคอมเมนต์นี้หรือไม่?</p>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default PsyCommentMain