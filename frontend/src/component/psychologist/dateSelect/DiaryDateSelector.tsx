import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th'; 

interface DiaryDateSelectorProps {
  start: string ; // วันที่เริ่มต้น เช่น "05-12-2024"
  end: string;   // วันที่สิ้นสุด เช่น "06-12-2024"
  onDateChange: (selectedDate: string) => void; // Callback ที่จะส่งวันที่กลับไป
}

const DiaryDateSelector: React.FC<DiaryDateSelectorProps> = ({ start, end, onDateChange }) => {
  const [dates, setDates] = useState<{ date: string; day: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>();

  useEffect(() => {
    dayjs.locale('th');

    // แปลงช่วงวันที่ start และ end ให้เป็น Array ของวันที่ทั้งหมด
    const startDate = dayjs(start, 'DD-MM-YYYY');
    const endDate = dayjs(end, 'DD-MM-YYYY');
    const dateList: { date: string; day: string }[] = [];

    for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
      dateList.push({
        date: date.format('DD-MM-YYYY'),
        day: date.format('dd'),
      });
    }

    setDates(dateList);
    if (!selectedDate && dateList[0]?.date) {
        setSelectedDate(dateList[0]?.date);
        onDateChange(dateList[0]?.date); // ส่งค่าของวันที่แรกกลับไป callback
      }
    }, [start, end, selectedDate, onDateChange]);
  

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateChange(date); // ส่งค่ากลับผ่าน callback
  };

  return (
    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column',justifyContent:'center'}}>
      {/* วันที่ที่เลือก */}
      <div className="Records-selector">
        <div
          style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          {selectedDate
            ? dayjs(selectedDate, 'DD-MM-YYYY').locale('th').format('วันddddที่ D MMMM YYYY')
            : 'กรุณาเลือกวันที่'}
        </div>

        {/* ปุ่มเลือกวันที่ */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {dates.map(({ date, day }, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              style={{
                display: 'flex',
                flexShrink:0,
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.3rem',
                borderRadius: '8px',
                backgroundColor: selectedDate === date ? '#e9eb96' : '#e0e0e0',
                color: selectedDate === date ? '#fff' : '#000',
                cursor: 'pointer',
                width: '40px',
                border: 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{day}</div>
              <div style={{ fontSize: '18px' }}>{dayjs(date, 'DD-MM-YYYY').format('D')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryDateSelector;