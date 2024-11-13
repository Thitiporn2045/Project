import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import { ImSearch } from 'react-icons/im';
import './styleSheetPat.css';
import SearchPat from '../../../../component/searchPat/searchPat';
import { useNavigate } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { Form, message } from 'antd';
import { GetDiaryByPatientID } from '../../../../services/https/diary';

function MainSheet() {
    const patID = localStorage.getItem('patientID');
    const [diarys, setDiarys] = useState<DiaryPatInterface[]>([]); // Default to empty array
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const fetchDiaryByPatientID = async () => {
        const res = await GetDiaryByPatientID(Number(patID));
        if (res) {
            setDiarys(res.data);
            console.log("res", res)
        }
    };

    useEffect(() => {
        fetchDiaryByPatientID();
    }, []);

    const navigate = useNavigate();

    // Function to navigate based on the WorksheetTypeID
    const navigateToDiaryPage = (diary: DiaryPatInterface) => {
        let routePath = '';
        switch (diary.WorksheetTypeID) {
            case 1:
                routePath = '/Planning';
                break;
            case 2:
                routePath = '/Activity';
                break;
            case 3:
                routePath = '/Behavioural';
                break;
            case 4:
                routePath = '/CrossSectional';
                break;
            default:
                console.error('Unknown worksheet type');
                return;
        }
        navigate(`${routePath}?id=${diary.ID}`);
    };

    // Toggle popup visibility
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
                        <NavbarPat />
                    </div>
                    <div className="main-background">
                        <div className="main-content">
                            <div className='bg-content'>
                                <div className="header">
                                    <div className='on'>
                                        <h2>My Book</h2>
                                    </div>
                                    <div className="labelSearch">
                                        <input
                                            className='searchBook'
                                            type="text"
                                            placeholder="ค้นหาหนังสือของคุณ"
                                            onClick={toggle}
                                        />
                                        <i className="searchIcon"><ImSearch /></i>
                                    </div>                                   
                                </div>
                                
                                {/* Display categorized diary entries */}
                                <div className="diary-categories p-6">
                                    {diarys && diarys.length > 0 ? (
                                        diarys.map((diary) => (
                                            <div key={diary.ID}>
                                                <h3>{diary.Name}</h3>
                                                <img src={diary.Picture} alt={diary.Name} />
                                                <p>Start Date: {diary.Start}</p>
                                                <p>End Date: {diary.End}</p>
                                                {diary.Patient && <p>Patient Name: {diary.Patient.Firstname} {diary.Patient.Lastname}</p>}
                                                {/* Render more details if necessary */}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No diaries found</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup for Search */}
            <div id='popup'>
                <div className='compo-search'>
                    <SearchPat />
                    <a href="#" className='btn-close' onClick={toggle}>Close</a>
                </div>
            </div>
        </div>
    );
}

export default MainSheet;
