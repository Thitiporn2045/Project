import { Button, ConfigProvider, Dropdown, Menu } from 'antd'
import thTH from 'antd/lib/locale/th_TH';
import React, { useEffect, useState } from 'react'
import { IoFlash } from 'react-icons/io5'
import { QuickRepliesInterface } from '../../../interfaces/psychologist/IComment';
import { ListQuickReplies } from '../../../services/https/psychologist/comment';

  interface QuickRepliesBtnProps {
    onReplySelect: (reply: string) => void; // Callback สำหรับส่งข้อความที่เลือก
  }
  
const QuickRepliesBtn: React.FC<QuickRepliesBtnProps> = ({onReplySelect }) => {

  const [quickReplies,setQuickReplies] = useState<QuickRepliesInterface[]>([]);
  const psyID = localStorage.getItem('psychologistID');
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
  const menu = (
    <Menu>
      {quickReplies.map((reply) => (
        <Menu.Item key={reply.ID} onClick={() => onReplySelect(String(reply.Message))}>
          {reply.Name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components:{
          Input: {
            inputFontSize: 16
          },
          Dropdown:{
            paddingBlock: 10

          },
        },
        token:{
          colorPrimary: '#2C9F99',
          colorText:'#585858',
          fontFamily:'Noto Sans Thai, sans-serif'
        }
      }}
    >
        <div style={{width:'100%', height:'100%'}}>
        <Dropdown overlay={menu} trigger={['click']}>
            <Button type="default" size="large" style={{ borderRadius: 30 }}>
                <IoFlash /> Quick Replies
            </Button>
        </Dropdown>
        </div>
    </ConfigProvider>
  )
}

export default QuickRepliesBtn