import { useNavigate } from "react-router-dom";
import { DiaryPatInterface } from "../../interfaces/diary/IDiary";
import { useEffect, useState } from "react";
import { message } from "antd";
import { GetDiaryByPatientID } from "../../services/https/diary";
import dayjs from "dayjs";
import './stylePat.css';
import { motion } from "framer-motion";

interface BookPatProps {
    limit: number;
}

function BookPat({ limit }: BookPatProps) {
    const patID = localStorage.getItem('patientID');
    const [diary, setDiary] = useState<DiaryPatInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    // Function to shuffle the diary array
    const shuffleArray = (array: DiaryPatInterface[]) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    };

    const fetchDiaryByPatientID = async () => {
        const res = await GetDiaryByPatientID(Number(patID));
        if (res) {
            setDiary(shuffleArray(res)); // Shuffle after fetching
            console.log("Shuffled diaries:", res);
        }
    };

    useEffect(() => {
        fetchDiaryByPatientID();
    }, []);

    const navigate = useNavigate();

const navigateToDiaryPage = (diary: DiaryPatInterface) => {
        const currentDate = dayjs();
        const startDate = dayjs(diary.Start, 'DD-MM-YYYY');
        const endDate = dayjs(diary.End, 'DD-MM-YYYY');
        
        // Check if it's not a Planning or Activity WorksheetTypeID
        if (![1, 2].includes(Number(diary.WorksheetTypeID))) {
            if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
                if (!currentDate.isSame(startDate, 'day') && !currentDate.isSame(endDate, 'day')) {
                    messageApi.error('ไม่สามารถเข้าถึงไดอารี่ เนื่องจากอยู่นอกช่วงเวลาที่กำหนด');
                    return;
                }
            }
        }
    
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

    return (
        <div className='bookPat'>
            {contextHolder}
            {diary.length > 0 ? (
                diary.slice(0, limit).map((diary, index) => (
                    <motion.div
                        key={diary.ID}
                        className="diary-card"
                        onClick={() => navigateToDiaryPage(diary)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                    >
                        <img 
                            className='coverBook'
                            src={diary.Picture} 
                            alt={diary.Name}
                        />
                        <div className='contentBook'>
                            <h4>{diary.Name}</h4>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="empty-diary-message">
                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                        <div className="Loading-Data"></div>
                        <div className='text'>ไม่มีข้อมูล...</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookPat;
