import React, { useState } from 'react'
import AntD from '../../../component/psychologist/sideBar/AntD'
import './psyComment.css';
import PsyCommentMain from './PsyCommentMain';
import { Button } from 'antd';

function PsyCommentCS() {

  
  return (
    <div className="PsyCommentCS">
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className='Content'>
        
      </div>
      
      <div className='Comment'>
        <div style={{width:'100%',height:'10%',display:'flex',alignItems:'center'}}>
          <b style={{fontSize:20,color:'#585858',marginLeft:'0.8rem'}}>แสดงความคิดเห็น/คำแนะนำ</b>
        </div>
        <PsyCommentMain/>
      </div>
      
    </div>
  )
}

export default PsyCommentCS