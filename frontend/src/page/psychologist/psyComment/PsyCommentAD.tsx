import React from 'react'
import PsyCommentMain from './PsyCommentMain'
import AntD from '../../../component/psychologist/sideBar/AntD'

function PsyCommentAD() {
  return (
    <div className='PsyCommentAD'>
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

export default PsyCommentAD