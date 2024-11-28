import React from 'react'
import AntD from '../../../component/psychologist/sideBar/AntD'
import PsyCommentMain from './PsyCommentMain'
import './psyComment.css'

function PsyCommentBE() {
  return (
    <div className='PsyCommentBE'>
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

export default PsyCommentBE