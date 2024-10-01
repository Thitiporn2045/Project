import React, { useState } from 'react';
import './login.css';

function HomePage() {
  const [isShaking, setIsShaking] = useState(false);

  // ฟังก์ชันสำหรับการเพิ่มคลาสการสั่นเมื่อคลิก
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsShaking(true); // เริ่มการสั่นเมื่อคลิก
    setTimeout(() => {
      setIsShaking(false); // หยุดการสั่นหลังจาก 0.5 วินาที
    }, 500);
  };

  return (
    <div className='HomePage'>
      <h1>เข้าสู่ระบบในฐานะ</h1>
      <div style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row', gap: '2rem', width: '400px', height: '250px' }}>
        <div className="moo-deng1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div
            className={`moo-deng-pic1 ${isShaking ? 'shake-animation' : ''}`}
            onClick={handleImageClick}
          ></div>
          <a href='/login/patient'>บุคคทั่วไป</a>
        </div>
        <div className="moo-deng2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div
            className={`moo-deng-pic2 ${isShaking ? 'shake-animation' : ''}`}
            onClick={handleImageClick}
          ></div>
          <a href='/login/psychologist'>นักจิตวิทยา</a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
