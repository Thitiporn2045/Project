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
            setDiarys(res);
            console.log("res", res)
        }
    };

    useEffect(() => {
        fetchDiaryByPatientID();
        console.log(categorizeDiaries()); // ตรวจสอบผลลัพธ์ของ categorizeDiaries
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

    const categorizeDiaries = () => {
        if (!diarys || diarys.length === 0) {
            return {
                planning: [],
                activity: [],
                behavioral: [],
                crossSectional: []
            };
        }
    
        return {
            planning: diarys.filter(diary => diary.WorksheetType?.Name === "Activity Planning"),  // กรองโดยใช้ WorksheetType.ID
            activity: diarys.filter(diary => diary.WorksheetType?.Name === "Activity Diary"),
            behavioral: diarys.filter(diary => diary.WorksheetType?.Name === "Behavioral Experiment"),
            crossSectional: diarys.filter(diary => diary.WorksheetType?.Name === "Cross Sectional")
        };
    };

    

    const DiaryCategory = ({ title, diaries }: { title: string; diaries: DiaryPatInterface[] }) => (
        <div className="diary-category">
            <h3>{title}</h3>
            <div className="diary-grid">
                {diaries.map((diary) => (
                    <div 
                        key={diary.ID} 
                        className="diary-card"
                        onClick={() => navigateToDiaryPage(diary)}
                    >
                        <img 
                            src={diary.Picture} 
                            alt={diary.Name}
                        />
                        <h4>{diary.Name}</h4>
                        <div className="text-sm">
                            <p>เริ่ม: {diary.Start}</p>
                            <p>สิ้นสุด: {diary.End}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
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
                                    {categorizeDiaries().planning.length > 0 && (
                                        <DiaryCategory 
                                            title="Planning Diary" 
                                            diaries={categorizeDiaries().planning}
                                        />
                                    )}
                                    
                                    {categorizeDiaries().activity.length > 0 && (
                                        <DiaryCategory 
                                            title="Activity Diary" 
                                            diaries={categorizeDiaries().activity}
                                        />
                                    )}
                                    
                                    {categorizeDiaries().behavioral.length > 0 && (
                                        <DiaryCategory 
                                            title="Behavioral Diary" 
                                            diaries={categorizeDiaries().behavioral}
                                        />
                                    )}
                                    
                                    {categorizeDiaries().crossSectional.length > 0 && (
                                        <DiaryCategory 
                                            title="Cross Sectional Diary" 
                                            diaries={categorizeDiaries().crossSectional}
                                        />
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
