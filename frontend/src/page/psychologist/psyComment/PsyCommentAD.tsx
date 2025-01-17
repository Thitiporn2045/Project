import React, { useState } from 'react'
import PsyCommentMain from './PsyCommentMain'
import AntD from '../../../component/psychologist/sideBar/AntD'
import thTH from 'antd/lib/locale/th_TH';
import { ConfigProvider, Table, TableColumnsType } from "antd";
import { ActivityDiaryInterface } from '../../../interfaces/activityDiary/IActivityDiary';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../services/https/diary';


function PsyCommentAD() {
  const [diary, setDiary] = useState<DiaryPatInterface>();
  const diaryID = localStorage.getItem('diaryID');

  const getDiaryByID = async () => {
    let res = await  GetDiaryByDiaryID(Number(diaryID));

    if(res){
      setDiary(res);
    }
  }
 

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
      <div className='PsyCommentAD'>
        <div className='SideBar'>
          <AntD/>
        </div>

        <div className='Content'>
          <div className='Patient-card-info'></div>
          
        </div>
        
        <div className='Comment'>
          <div style={{width:'100%',height:'10%',display:'flex',alignItems:'center'}}>
            <b style={{fontSize:20,color:'#585858',marginLeft:'0.5rem'}}>แสดงความคิดเห็น/คำแนะนำ</b>
          </div>
          <PsyCommentMain/>
        </div>
      </div>
    </ConfigProvider>
    
  )
}

export default PsyCommentAD