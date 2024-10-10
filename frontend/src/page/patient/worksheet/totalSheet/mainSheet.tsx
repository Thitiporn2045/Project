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
                        <header>
                            <h1>Hello, {userLogin.name} 👋</h1>
                            <div className='search-bar'>
                                <div className="labelSearch">
                                    <input
                                        className='searchBook'
                                        type="text"
                                        placeholder="ค้นหาหนังสือของคุณ"
                                        onClick={toggle}
                                    />
                                    <i className="searchIcon"><ImSearch /></i>
                                </div>
                                <div className='warm'>
                                    <div className="bg-warm content">
                                        <i><FaBell /></i>
                                        <div className="num content">3</div>
                                        {/* <div className="box">
                                            <div className="heading content">
                                                <p><i><FaBell /></i>3</p>
                                            </div>
                                            <div className="content-box">
                                                <div className='text'>
                                                    <p>วันนี้วันที่ 30/07/2024</p>
                                                    <p>อย่าลืมเขียนบันทึกน้าา~~</p>
                                                </div>
                                                <div className='bg-icon'>
                                                    <i><LuAlarmClock/></i>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </header>

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
                    <div className="main-bg-right">
                        <div className="main-content">
                            <div className='content1'>
                                    <div className="box">
                                        <div className="profile">
                                            <div className="header">
                                                <div className="img-profile">
                                                    <img src={userLogin.imge} alt="imge" className="avatar" />
                                                </div>
                                                <h2 className="name">{userLogin.name}</h2>
                                                <div className='border'></div>
                                            </div>
                                            <div className="info">
                                                <p><strong>วันเกิด:</strong> {userLogin.birthDate}</p>
                                                <p><strong>เบอร์โทรศัพท์:</strong> {userLogin.phone}</p>
                                                <p><strong>อีเมล:</strong> {userLogin.email}</p>
                                                <p><strong>นักวิดของคุณ:</strong> {userLogin.therapist}</p>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className='content2'>
                                <div className='box'>
                                </div>
                            </div>
                            <div className='content3'>
                                <div className='box'>
                                    <NotificationPat numDays={3} />
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