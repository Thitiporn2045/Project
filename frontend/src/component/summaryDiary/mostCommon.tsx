import React, { useEffect, useState } from 'react';
import { GetEmotionsByDiaryID } from '../../services/https/cbt/crossSectional/crossSectional';
import './summary.css';

interface EmotionData {
    EmotionID: number;
    Name: string;
    ColorCode: string;
    Emoticon: string;
    Count: number;
}

interface DiaryID {
    diaryID: number | undefined;
}

function MostCommon({ diaryID }: DiaryID) {
    const [overallMood, setOverallMood] = useState<EmotionData[]>([]);

    const fetchOverallMoodByDiary = async () => {
        if (diaryID) {
            try {
                const res = await GetEmotionsByDiaryID(Number(diaryID));
                console.log('Response from GetEmotionsByDiaryID:', res);
                if (res) {
                    setOverallMood(res);
                    console.log('Diary data:', res);
                } else {
                    console.log('No data received');
                }
            } catch (error) {
                console.error('Error fetching diary:', error);
            }
        } else {
            console.log('Diary ID is not available');
        }
    };

    useEffect(() => {
        fetchOverallMoodByDiary();
    }, [diaryID]);

    const getMostCommonEmotions = () => {
        if (overallMood.length === 0) return [];

        // Find the maximum count value
        const maxCount = Math.max(...overallMood.map(emotion => emotion.Count));

        // Filter emotions that have the maximum count
        return overallMood.filter(emotion => emotion.Count === maxCount);
    };

    const mostCommonEmotions = getMostCommonEmotions();

    return (
        <div className='mostCommon'>
            {mostCommonEmotions.map(emotion => (
                <div key={emotion.EmotionID} style={{  padding: '10px', margin: '5px', borderRadius: '.8rem' }}>
                    <span>{emotion.Emoticon}</span>
                    <span>{emotion.Name}</span>
                </div>
            ))}
        </div>
    );
}

export default MostCommon;
