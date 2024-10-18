import React, { useState, useEffect } from 'react';
import { FaUnlockAlt } from "react-icons/fa";
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { Button, Result } from 'antd';
import { title } from 'process';

const Books = [
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '25/08/2024', endDay: '5/09/2024', statusBook: <FaUnlockAlt />, type: 1 },
];

const contentBook = [
    { title: 'แม่ถามว่าทำไมทำได้เท่านี้', thoughts: 'แย่มากเรายังไม่ดีพออีกหรอ', behavior: 'โกรธและก้าวกร้าว', bodily: 'ตัวสั่น', emotions: 'เศร้า', date: '25/08/2024' },
    { title: 'แม่ถามว่าทำไมทำได้เท่านี้', thoughts: 'แย่มากเรายังไม่ดีพออีกหรอ', behavior: 'โกรธและก้าวกร้าว', bodily: '', emotions: 'เศร้า', date: '27/08/2024' },
    { title: 'แม่ถามว่าทำไมทำได้เท่านี้', thoughts: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero ullam hic corrupti ratione. Qui sed ipsa officiis reprehenderit, provident aliquam suscipit consequatur ad dolorum nulla mollitia doloribus, necessitatibus ut ullam.', behavior: '', bodily: 'ตัวสั่น', emotions: 'เศร้า', date: '28/08/2024' },
];

const comments = [
    {
    user: "John Doe",
    date: '25/08/2024',
    comment: "The psychologist was very attentive and gave practical advice on managing stress. I felt heard and understood throughout the session.",
    image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    },
    {
    user: "Jane Smith",
    date: '25/08/2024',
    comment: "The session was insightful, but I felt like there could have been more focus on solutions. However, the psychologist was very compassionate.",
    image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    },
    {
    user: "David Brown",
    date: '28/08/2024',
    comment: "I appreciated the psychologist's approach to mindfulness exercises. It helped me stay grounded during stressful moments.",
    image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg'
    }
];


function SheetBehav() {
    const [currentBook, setCurrentBook] = useState(Books[0]);
    const [dateRange, setDateRange] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (currentBook) {
            const start = new Date(currentBook.startDay.split('/').reverse().join('-'));
            const end = new Date(currentBook.endDay.split('/').reverse().join('-'));
            const range: Date[] = [];
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                range.push(new Date(date));
            }
            setDateRange(range);

            // Set the initial selected date to today if it's within the range
            const today = new Date();
            if (today >= start && today <= end) {
                setSelectedDate(today);
            } else {
                setSelectedDate(start); // Otherwise, set to the start date
            }
        }
    }, [currentBook]);

    const formatDate = (date: Date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' })}`;
    };


    const isDateInRange = (date: Date) => {
        const start = new Date(currentBook.startDay.split('/').reverse().join('-'));
        const end = new Date(currentBook.endDay.split('/').reverse().join('-'));
        return date >= start && date <= end;
    };

    const getContentForDay = (date: Date) => {
        if (!isDateInRange(date)) return null;
        const formattedDate = date.toLocaleDateString('en-GB'); // Use 'en-GB' to match 'dd/mm/yyyy' format
        const content = contentBook.find(item => item.date === formattedDate);
        if (content) {
            const { title, thoughts, behavior, bodily, emotions } = content;
            return (
                <div className="day-content">
                    <div className="content">
                        <div className='head'>
                        <div className='onTitle'>
                            <h2 className="title">Situation to Trigger</h2>
                        </div>
                        <div className='lowerInput'>
                            <div className='mainTitle'>
                                {title && <div className="title">{title}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="lower-content">
                        <div className="bg-Content">
                        <div className='content-box'>
                            <h3>Thoughts</h3>
                            <div className="bg-input">
                            {thoughts && <div className="thought">{thoughts}</div>}
                            </div>
                        </div>
                        <div className='content-box'>
                            <h3>Behavior</h3>
                            <div className="bg-input">
                            {behavior && <div className="behavior">{behavior}</div>}
                            </div>
                        </div>
                        <div className='content-box'>
                            <h3>Bodily Sensations</h3>
                            <div className="bg-input">
                            {bodily && <div className="bodily">{bodily}</div>}
                            </div>
                        </div>
                        <div className='content-box'>
                            <h3>Emotions</h3>
                            <div className="bg-input">
                            {emotions && <div className="emotion">{emotions}</div>}
                            </div>
                        </div>
                        </div>
                    </div>
                    {/* <div className="content">
                        {thoughts && <div className="thought">ความคิด: {thoughts}</div>}
                        {behavior && <div className="behavior">พฤติกรรม: {behavior}</div>}
                        {bodily && <div className="bodily">ร่างกาย: {bodily}</div>}
                        {emotions && <div className="emotion">อารมณ์: {emotions}</div>}
                    </div> */}
                    </div>
                </div>
            );
        }
        return (
            <div className="no-content">
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary">เขียนบันทึกเลย!!</Button>}
                />
            </div>
        );
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className='SheetCross'>
            <div className='main-body'>
                <div className='sidebar'>
                    <NavbarPat />
                </div>
                <div className="main-background">
                    {/* <header className="header">
                        <div className='on'>
                            <h1 className="bookName">{currentBook.name}</h1>
                        </div>
                        <div className='lower'>
                            <div className="name">
                            <h2 className="typebook">{currentBook.typeBook}</h2>
                            </div>
                            <div className="emo"></div>
                        </div>
                    </header> */}
                    <div className="main-content">
                        <div className='content1'>
                            <div className="content-display">
                                {selectedDate && getContentForDay(selectedDate)}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="main-bg-right">
                    <div className="main-content">
                        <div className='content1'>
                            <div className="box1">
                                <div className="shoedate">
                                    <p>เลือกวันที่</p>
                                </div>
                                <div className="date-range">
                                    {dateRange.map((date, index) => (
                                        <div
                                            key={index}
                                            className={`day ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            {formatDate(date)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='box2'>
                                <div className="contentComment">
                                    <h3>คำแนะนำ</h3>
                                    <div className="day-comments">
                                        {comments.map((comment, index) => (
                                            <div key={index} className="comment-box">
                                                <div className="comment-content">
                                                    <div className="comment-user">
                                                        <strong>{comment.user}</strong>
                                                        {/* <span className="comment-date">{formattedDate}</span> */}
                                                    </div>
                                                    <div className="comment-text">
                                                        {comment.comment}
                                                    </div>
                                                </div>
                                                {/* Avatar at the bottom */}
                                                <div className="comment-avatar">
                                                    <img src={comment.image} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SheetBehav;
