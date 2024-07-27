import React from 'react';
import './stylePat.css';

function NotePat() {
    const notes = [
        {
        id: 1,
        title: 'ใคร ๆ ก็เจอปัญหาด้วยกันทั้งนั้น',
        content: 'บ่นได้ใครอยากระบายไปได้เลย ๆ เดี๋ยวโลกก็ต้องเหนื่อยกับปัญหา ปัญหามันมากมาย มีเพื่อนร่วมงานอีกหลายคนก็ต้องเผชิญกับปัญหาเช่นเดียวกันเรา เราไม่ได้เผชิญ ๆ เดียวในโลกที่ต้องพบเจอกับความผิดหวัง'
        },
        {
        id: 2,
        title: 'พบ มีสอบ',
        content: '10/07/2567'
        },
        {
        id: 3,
        title: 'ใคร ๆ ก็เจอปัญหาด้วยกันทั้งนั้น',
        content: 'บ่นได้ใครอยากระบายไปได้เลย ๆ เดี๋ยวโลกก็ต้องเหนื่อยกับปัญหา ปัญหามันมากมาย มีเพื่อนร่วมงานอีกหลายคนก็ต้องเผชิญกับปัญหาเช่นเดียวกันเรา เราไม่ได้เผชิญ ๆ เดียวในโลกที่ต้องพบเจอกับความผิดหวัง'
        },
        {
        id: 4,
        title: 'ใคร ๆ ก็เจอปัญหาด้วยกันทั้งนั้น',
        content: 'บ่นได้ใครอยากระบายไปได้เลย ๆ เดี๋ยวโลกก็ต้องเหนื่อยกับปัญหา ปัญหามันมากมาย มีเพื่อนร่วมงานอีกหลายคนก็ต้องเผชิญกับปัญหาเช่นเดียวกันเรา เราไม่ได้เผชิญ ๆ เดียวในโลกที่ต้องพบเจอกับความผิดหวัง'
        },
    ];

    return (
        <div className='notePat'>
        {notes.map((note) => (
            <div key={note.id} className='note' style={{backgroundColor:  note.id === 1 ? '#C1C4F8' : note.id === 2 ? '#EAD7F8' : note.id === 3 ? '#EFCDF3' : '#EAD7F8'}}>
                <div className="content">
                    <div className="head">
                        <h2>{note.title}</h2>
                        <div className='border'></div>
                    </div>
                    <div className="body">
                        <p>{note.content}</p>
                    </div>
                </div>
            </div>
        ))}
        </div>
    );
}

export default NotePat;