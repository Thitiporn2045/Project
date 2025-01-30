import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DonutGraphProps {
users: number;
psychologists: number;
patients: number;
}

const DonutGraph: React.FC<DonutGraphProps> = ({ users, psychologists, patients }) => {
const chartRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (chartRef.current) {
    const chartInstance = echarts.init(chartRef.current);

    // คำนวณเปอร์เซ็นต์ของ psychologists และ patients จาก users
    const psychologistsPercentage = (psychologists / users) * 100;
    const patientsPercentage = (patients / users) * 100;

    const option = {
        tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)',
        },
        legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center', // ให้อยู่กลาง
        data: [
            { name: 'ผู้ใช้ระบบ', itemStyle: { color: '#6BE5F1' } },
            { name: 'นักจิตวิทยา', itemStyle: { color: '#82B3F0' } },
            { name: 'ผู้ป่วย', itemStyle: { color: '#FB9DC6' } },
        ],
        textStyle: {
            fontSize: 14,
        },
        },
        series: [
        {
            type: 'pie',
            name: 'ผู้ใช้ระบบ',
            radius: ['30%', '40%'], 
            center: ['65%', '50%'],
            data: [
            { value: 100, name: 'ผู้ใช้ระบบ', 
                itemStyle: { 
                    color: '#6BE5F1',  // สีหลักที่คุณต้องการ
                    shadowColor: 'rgba(107, 229, 241, 0.6)',  // เงาของสี (ใช้ rgba เพื่อควบคุมความโปร่งใส)
                    shadowBlur: 10,    // ค่าของการเบลอที่ทำให้สีดูเหมือนเรืองแสง
                    borderRadius: '50%' // ใช้ได้กับ path แต่ไม่สามารถใช้ได้กับ pie chart
                }},
            { value: 0, name: '', itemStyle: { color: '#EDF2F8' } }, // สีเทาอ่อนสำหรับพื้นที่ที่ไม่เต็ม
            ],
            
            label: { show: false },
        },
        {
            type: 'pie',
            name: 'นักจิตวิทยา',
            radius: ['52%', '62%'], // เพิ่มระยะห่าง
            center: ['65%', '50%'],
            data: [
            { value: psychologistsPercentage, name: 'นักจิตวิทยา', 
                itemStyle: { 
                    color: '#82B3F0', 
                    shadowColor: 'rgba(130, 179, 240, 0.6)', 
                    shadowBlur: 10, 
                    borderRadius: '50%' 
                } },
            { value: 100 - psychologistsPercentage, name: '', itemStyle: { color: '#EDF2F8' } }, // สีเทาอ่อน
            ],
            label: { show: false },
        },
        {
            type: 'pie',
            name: 'ผู้ป่วย',
            radius: ['68%', '78%'], // เพิ่มระยะห่าง
            center: ['65%', '50%'],
            data: [
            { value: patientsPercentage, name: 'ผู้ป่วย', 
                itemStyle: { 
                    color: '#FB9DC6', 
                    shadowColor: 'rgba(251, 157, 198, 0.6)', 
                    shadowBlur: 10,
                    borderRadius: '50%' } },
            { value: 100 - patientsPercentage, name: '', itemStyle: { color: '#EDF2F8' } }, // สีเทาอ่อน
            ],
            label: { show: false },
        },
        ],
    };

    chartInstance.setOption(option);

    const handleResize = () => {
        chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.dispose();
    };
    }
}, [users, psychologists, patients]);

return (
    <div 
    style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff',  // ลองปรับสีพื้นหลังให้เหมาะสม
        border: '1px solid #EBF1F5',  // สีขอบอ่อน
        width: '30.7vw',
        height: '30.5vh',
        borderRadius: '15px',
        padding: '20px', // เพิ่ม padding
        boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
        zIndex: 1,  // เพิ่ม z-index เพื่อให้แน่ใจว่ามีลำดับซ้อนที่ถูกต้อง
    }}
    >
    {/* พื้นที่แสดงกราฟ */}
    <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
    </div>
);
};

export default DonutGraph;
