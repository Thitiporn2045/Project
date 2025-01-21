import React from 'react'
import './psyComment.css'
import AntD from '../../../component/psychologist/sideBar/AntD'
import PsyCommentMain from './PsyCommentMain'
import { ConfigProvider, Table, TableColumnsType } from "antd";
import { ActivityPlanningInterfaceForPsy } from '../../../interfaces/activityPlanning/IActivityPlanning';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { calculateAge } from '../../calculateAge';
import userEmpty from "../../../assets/userEmty.jpg"
import { GetActivityPlanningByDiaryIDForPsy } from '../../../services/https/cbt/activityPlanning/activityPlanning';
import dayjs from 'dayjs';

function PsyCommentAP() {
  return (
    <div className='PsyCommentAP'>
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className='Content'>
        
      </div>
      
      <div className='Comment'>
        <div style={{width:'100%',height:'10%',display:'flex',alignItems:'center'}}>
          <b style={{fontSize:20,color:'#585858',marginLeft:'0.5rem'}}>แสดงความคิดเห็น/คำแนะนำ</b>
        </div>
        <PsyCommentMain/>
      </div>
    </div>
  )
}

export default PsyCommentAP