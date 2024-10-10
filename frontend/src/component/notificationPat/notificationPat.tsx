import React from 'react';
import './stylePat.css';
import { LuAlarmClock } from 'react-icons/lu';

interface NotificationPatProps {
numDays: number;
}

function NotificationPat({ numDays }: NotificationPatProps) {
const notifications = [];
let currentDate = new Date(); // เริ่มจากวันปัจจุบัน

for (let i = 0; i < numDays; i++) {
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear() + 543}`;
    
    notifications.push(
    <div key={i} className="notification-item">
        <div className='head'>
            <div className="date">วันที่ {formattedDate}</div>
            <div className="message">อย่าลืมเขียนบันทึกน้ำ~~</div>
        </div>
        <div className='icon'>
            <div className='bg-icon'>
                <i><LuAlarmClock/></i>
            </div>
        </div>
    </div>
    );

    currentDate.setDate(currentDate.getDate() + 1); // เพิ่มวันทีละ 1 วัน
}

return (
    <div className='notificationPat'>
        <div className="notification-count">การแจ้งเตือนทั้งหมด: {notifications.length}</div>
        {notifications}
    </div>
);
}

export default NotificationPat;