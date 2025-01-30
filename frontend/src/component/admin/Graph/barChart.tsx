import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BarChartProps {
data: { name: string; value: number }[]; // รับข้อมูลที่มีประเภท CBT และค่า
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
const chartRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (chartRef.current) {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow', // ใช้ pointer เป็นเงา
            },
        },
        grid: {
            left: '5%', // ลดระยะห่างด้านซ้าย
            right: '5%', // ลดระยะห่างด้านขวา
            top: '10%', // ลดระยะห่างด้านบน
            bottom: '10%', // ลดระยะห่างด้านล่าง
            containLabel: true, // ให้ labels อยู่ในพื้นที่กราฟ
        },
        xAxis: {
            type: 'category',
            data: data.map((item) => item.name), // ชื่อประเภท CBT
            axisLabel: {
                fontSize: 14,
                color: '#555',
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 14,
                color: '#555',
            },
        },
        series: [
            {
                data: data.map((item) => item.value), // ค่าที่จะแสดงในกราฟ
                type: 'bar',
                itemStyle: {
                    color: '#c8b0f6', // สีของแท่งกราฟ
                    shadowColor: 'rgba(200, 176, 246, 0.6)', // เงาของสี (ใช้ rgba เพื่อควบคุมความโปร่งใส)
                    shadowBlur: 10,
                    borderRadius: [5, 5, 0, 0], // มุมโค้งด้านบน
                },
                barWidth: '50%', // เพิ่มความกว้างของแท่งกราฟ
            },
        ],
    };    

    chartInstance.setOption(option);

    const handleResize = () => {
        chartInstance.resize(); // เรียก resize เมื่อ container เปลี่ยนขนาด
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.dispose();
    };
    }
}, [data]);

return(
    <div
    style={{ 
        background: '#ffffff',
        width: '55vw',
        height: '30.5vh',
        borderRadius: '15px',
        padding: '20px', // เพิ่ม padding
        border: '1px solid #EBF1F5',
        boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
        zIndex: 1,  // เพิ่ม z-index เพื่อให้แน่ใจว่ามีลำดับซ้อนที่ถูกต้อง
    }}
    >
        <div ref={chartRef} style={{ height: '100%', width: '100%', maxHeight: '400px' }} />
    </div>
); 
};

export default BarChart;
