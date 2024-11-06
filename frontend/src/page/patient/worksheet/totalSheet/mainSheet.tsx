import React from 'react'
import NotificationPat from '../../../../component/notificationPat/notificationPat'
import NavbarPat from '../../../../component/navbarPat/navbarPat'
import { ImSearch } from 'react-icons/im'
import { FaBell } from 'react-icons/fa'
import './styleSheetPat.css';
import BookPat from '../../../../component/bookPat/bookPat'
import SearchPat from '../../../../component/searchPat/searchPat'

const userLogin = {
    imge: 'https://i.pinimg.com/474x/0f/44/6f/0f446fc154c16b2dd85413d50bc9c170.jpg',
    name: "สมใจ ยิ้มแย้ม",
    birthDate: "20 สิงหาคม 2003",
    phone: "0801234567",
    email: "somjai2003@gmail.com",
    therapist: "ญาดา โภคาริตนกุล",
}

function MainSheet() {

    const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());

    const changeMonth = (month: any) => {
        setSelectedMonth(month);
    };

    //popup
    function toggle() {
        const blur = document.getElementById('blur') as HTMLElement;
        blur.classList.toggle('active');

        const popup = document.getElementById('popup') as HTMLElement;
        popup.classList.toggle('active');
    }
    

    return (
        <div className='mainSheet'>
            <div className="befor-main">
                <div className='main-body'>
                    <div className='sidebar'>
                        <NavbarPat></NavbarPat>
                    </div>
                    <div className="main-background">
                        <div className="main-content">
                            <div className='bg-content'>
                                <h2>My Book</h2>
                                <div className="month">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((monthName, index) => (
                                        <button 
                                            key={monthName} 
                                            onClick={() => changeMonth(index)}
                                            className={selectedMonth === index ? 'active' : ''}
                                        >
                                            {monthName}
                                        </button>
                                    ))}
                                </div>
                                <div className="book-item">
                                    <BookPat month={selectedMonth} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id='popup'>
                    <div className='compo-search'>
                        <SearchPat></SearchPat>
                        <a href="#" className='btn-close' onClick={toggle}>Close</a>
                    </div>
            </div>
        </div>
    )
}

export default MainSheet