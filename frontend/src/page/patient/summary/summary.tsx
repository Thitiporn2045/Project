import React, { useEffect, useRef } from 'react'; 
import NavbarPat from '../../../component/navbarPat/navbarPat'; 
import SummaryEmojiPat from '../../../component/summaryEmojiPat/summaryEmojiPat';
import SelectDayPat from '../../../component/selectDayPat/selectDayPat';

import './stylePat.css';

import { FaRegCalendarAlt } from "react-icons/fa";

const Summary: React.FC = () => {
    
    return (
        <div className='summary'>
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat />
                    </div>

                    <div className="main-background">
                        <header>
                            <SelectDayPat/>
                        </header>
                        {/* <SummaryEmojiPat/> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;
