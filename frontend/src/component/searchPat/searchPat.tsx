import React, { useState, useEffect } from 'react';
import './stylePat.css';
import { ImSearch } from "react-icons/im";
import { FaRegCalendarAlt } from "react-icons/fa";

function SearchPat() {
    const initialBooks = [
        { image: 'https://i.pinimg.com/736x/ae/b3/0b/aeb30b5e52ee5578af71b98312c67055.jpg', name: 'Syket', date: '9/07/2024', statusBook: 'lock' },
        { image: 'https://i.pinimg.com/564x/41/89/54/418954fe97bd1e8d2822a2d39c128c76.jpg', name: 'Sakib', date: '10/07/2024', statusBook: 'lock' },
        { image: 'https://i.pinimg.com/564x/38/48/75/384875edb620674b886be2ccb3c90032.jpg', name: 'Jamy', date: '11/07/2024', statusBook: 'lock' },
        { image: 'https://i.pinimg.com/564x/fe/81/c8/fe81c87f8a738e9bef039e2d4f300641.jpg', name: 'Hanif', date: '12/07/2024', statusBook: 'lock' },
    ];

    const [books, setBooks] = useState(initialBooks);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const filteredBooks = initialBooks.filter(book => 
            book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.date.includes(searchTerm) ||
            book.statusBook.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setBooks(filteredBooks);
    }, [searchTerm]);

    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='searchPat'>
            <div className="search">
                <div className="labelSearch">
                    <input
                        className='searchBook'
                        type="text"
                        placeholder="ค้นหาหนังสือของคุณ"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <i className="searchIcon"><ImSearch /></i>
                </div>
            </div>

            <div className="body-search">
                {books.length === 0 ? (
                    <div className="notFound">
                        ไม่พบหนังสือของคุณ
                    </div>
                ) : (
                    books.map((book, index) => (
                        <div className='item' key={index}>
                            <div className='image-content'>
                                <img className='image' src={book.image} alt="" />
                            </div>
                            <div className="content">
                                <h3>{book.name}</h3>
                                <p><i><FaRegCalendarAlt /></i>{book.date}</p>
                                <p>สถานะ: {book.statusBook}</p>
                            </div>
                            <div className="btn-book">
                                <button>Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchPat;