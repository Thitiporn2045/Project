import React, { useState, useEffect } from 'react';
import './stylePat.css';
import { ImSearch } from "react-icons/im";
import { FaRegCalendarAlt } from "react-icons/fa";
import { DiaryPatInterface } from '../../interfaces/diary/IDiary';
import { GetDiaryByPatientID } from '../../services/https/diary';

interface DiaryID {
    patID: number | undefined;
}

function SearchPat({ patID }: DiaryID) {
    const [diary, setDiary] = useState<DiaryPatInterface[]>([]); // Set initial state as an empty array
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDiary, setFilteredDiary] = useState<DiaryPatInterface[]>([]); // For storing filtered data

    const fetchDiaryByPatientID = async () => {
        if (patID) {
            try {
                const res = await GetDiaryByPatientID(Number(patID)); // Call API with the patient ID
                if (res) {
                    setDiary(res); // Save response to diary state
                    console.log("fetchDiaryByPatientID", res)
                }
                console.log('Diary:', res); // Log the received data
            } catch (error) {
                console.error('Error fetching diary:', error); // Log error
            }
        }
    };

    useEffect(() => {
        fetchDiaryByPatientID(); // Fetch diary on component mount
    }, [patID]);

    useEffect(() => {
        const filteredBooks = diary.filter(diaryItem => {
            const nameMatch = diaryItem.Name && diaryItem.Name.toLowerCase().includes(searchTerm.toLowerCase());
            const startMatch = diaryItem.Start && diaryItem.Start.includes(searchTerm);
            const isPublicMatch = diaryItem.IsPublic !== undefined && String(diaryItem.IsPublic).toLowerCase().includes(searchTerm.toLowerCase());

            return nameMatch || startMatch || isPublicMatch;
        });
        setFilteredDiary(filteredBooks); // Update filteredDiary state with filtered results
    }, [searchTerm, diary]); // Trigger filtering whenever searchTerm or diary changes

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); // Update search term on input change
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
                {filteredDiary.length === 0 ? (
                    <div className="notFound">
                        ไม่พบหนังสือของคุณ
                    </div>
                ) : (
                    filteredDiary.map((diaryItem, index) => (
                        <div className='item' key={index}>
                            <div className='image-content'>
                                <img className='image' src={diaryItem.Picture} alt="" />
                            </div>
                            <div className="content">
                                <h3>{diaryItem.Name}</h3>
                                <p><i><FaRegCalendarAlt /></i>{diaryItem.Start}</p>
                                <p>สถานะ: {diaryItem.IsPublic ? 'สาธารณะ' : 'ส่วนตัว'}</p>
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
