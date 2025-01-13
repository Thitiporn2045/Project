import React, { useEffect, useState } from 'react';
import { GetDiaryWritingDates } from '../../services/https/cbt/crossSectional/crossSectional';

interface WritingDatesProps {
    diaryID: number | undefined;
}

const WritingDates: React.FC<WritingDatesProps> = ({ diaryID }) => {
    const [writingDates, setWritingDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchWritingDates = async () => {
            if (diaryID !== undefined) {
                try {
                    const dates = await GetDiaryWritingDates(diaryID);
                    console.log("Fetched dates:", dates); // Debug array ที่ได้รับ
                    setWritingDates(dates);
                } catch (error) {
                    console.error("Error fetching writing dates:", error);
                }
            }
        };
    
        fetchWritingDates();
    }, [diaryID]);
    

    return (
        <div className="writing-dates">
            <h3>Writing Dates</h3>
            {writingDates.length > 0 ? (
                <ul>
                    {writingDates.map((date, index) => (
                        <li key={index}>{date}</li>
                    ))}
                </ul>
            ) : (
                <p>No writing dates found.</p>
            )}
        </div>
    );
};

export default WritingDates;
