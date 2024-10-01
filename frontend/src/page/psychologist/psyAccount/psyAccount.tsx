import React from 'react'
import '../psyHome/psyHomePage.css';
import './psyAccount.css'
import AntD from '../../../component/psychologist/sideBar/AntD'
import AccSubMenu from './AccSubMenu';

function PsyAccount() {
  return (
    <div className="PsyAccountPage">
      <div className="SideBar"><AntD/></div>
      <div className="Main-area">
          <div className="Main">
            <div className='Account-subMenu'>
              <AccSubMenu/>
            </div>
          </div>
      </div>   
    </div>  
  )
}

export default PsyAccount