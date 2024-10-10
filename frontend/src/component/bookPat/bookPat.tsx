import React from 'react'
import { useNavigate } from 'react-router-dom';
import './stylePat.css';
import { GrEdit } from "react-icons/gr";
import { FaRegCalendarAlt, FaUnlockAlt } from "react-icons/fa";

const Books = [
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '25/08/2024', endDay: '30/08/2024', numberDay: 5, statusBook: <FaUnlockAlt />, type: 1 },
    { image: 'https://i.pinimg.com/564x/41/89/54/418954fe97bd1e8d2822a2d39c128c76.jpg', name: 'Sakib', typeBook: 3, startDay: '25/09/2024', endDay: '30/09/2024', numberDay: 5, statusBook: <FaUnlockAlt />, type: 1 },
    { image: 'https://i.pinimg.com/564x/38/48/75/384875edb620674b886be2ccb3c90032.jpg', name: 'Jamy', typeBook: 3, startDay: '25/10/2024', endDay: '30/10/2024', numberDay: 5, statusBook: <FaUnlockAlt />, type: 0 },
    { image: 'https://i.pinimg.com/564x/fe/81/c8/fe81c87f8a738e9bef039e2d4f300641.jpg', name: 'Hanif', typeBook: 3, startDay: '25/11/2024', endDay: '30/11/2024', numberDay: 5, statusBook: <FaUnlockAlt />, type: 0 },
    { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', typeBook: 3, startDay: '25/12/2024', endDay: '30/12/2024', numberDay: 5, statusBook: <FaUnlockAlt />, type: 1 },
];

interface BookPatProps {
    month: number;
}

function BookPat({ month }: BookPatProps) {
    const navigate = useNavigate();

    const filteredBooks = Books.filter(book => {
        // แยกวันที่ออกเป็นส่วน ๆ โดยใช้เครื่องหมาย '/'
        const dateParts = book.startDay.split('/');
        // เอาค่าของเดือน (ตำแหน่งที่ 2) ออกมา และแปลงเป็นตัวเลข
        const bookMonth = parseInt(dateParts[1], 10);
    
        // เปรียบเทียบเดือนที่ได้กับเดือนที่ส่งเข้ามาใน props
        return bookMonth === month + 1; // บวก 1 เนื่องจาก `month` เริ่มจาก 0 สำหรับมกราคม
    });

    const handleBookClick = (book: any) => {
        navigate(`/SheetDetail?name=${book.name}&image=${encodeURIComponent(book.image)}`);
    };

    
    return (
        <div className='bookPat'>
            {filteredBooks.map((book, index) => (
                <div key={index} className='book-item' onClick={() => handleBookClick(book)}>
                    <div className="img-book">
                        <img src={book.image} alt={book.name} />
                    </div>
                    <div className="head">
                        <h3>{book.name}</h3>
                        <button className="btn-edit" style={{backgroundColor:  book.type === 1 ? '#9BA5F6' : '#E9B5EF'}}>
                            <GrEdit />
                        </button>
                    </div>
                    <div className="content">
                        <p><FaRegCalendarAlt/> {book.startDay}</p>
                        <p> {book.statusBook}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookPat;
