import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';
import './stylePat.css';

function SummaryEmojiPat() {
    const chartRef = useRef<HTMLDivElement | null>(null); // ใช้ useRef เพื่ออ้างอิงถึง DOM element ของกราฟ
    const myChart = useRef<echarts.EChartsType | null>(null); // ใช้ useRef เพื่ออ้างอิงถึง ECharts instance

    // ข้อมูลตัวอย่างพร้อมค่าสี
    const mockData = [
        { image: 'url_to_image1', name: 'Item A', amount: 120, color: '#80FFA5' },
        { image: 'url_to_image2', name: 'Item B', amount: 85, color: '#00DDFF' },
        { image: 'url_to_image3', name: 'Item C', amount: 150, color: '#37A2FF' },
        { image: 'url_to_image4', name: 'Item D', amount: 95, color: '#FF0087' },
        { image: 'url_to_image5', name: 'Item E', amount: 130, color: '#FFBF00' }
    ];

    useEffect(() => {
        if (chartRef.current) {
            myChart.current = echarts.init(chartRef.current); // สร้าง ECharts instance เมื่อ component ถูก mount
        }

        // เรียงข้อมูลจากมากไปน้อย
        const sortedData = [...mockData].sort((a, b) => b.amount - a.amount);

        const names = sortedData.map(item => item.name); // ดึงชื่อรายการ
        const values = sortedData.map(item => item.amount); // ดึงจำนวน
        const colors = sortedData.map(item => item.color); // ดึงสี

        const option: echarts.EChartsOption = { // กำหนด option สำหรับ ECharts
            tooltip: { // แสดง tooltip เมื่อ hover
                trigger: 'axis', // ทริกเกอร์เมื่อ hover บนแกน
                axisPointer: { // แสดงเส้นตัวชี้
                    type: 'shadow' // ใช้เงาเป็นตัวชี้
                }
            },
            grid: { // กำหนดขอบเขตของกราฟ
                top: '5%',
                right: '5%',
                bottom: '5%',
                left: '15%'
            },
            xAxis: { // กำหนดแกน x
                max: 'dataMax', // ตั้งค่าแกน x ให้อยู่ตามค่าข้อมูลสูงสุด
                axisLine: { show: false }, // ไม่แสดงเส้นแกน x
                axisTick: { show: false }, // ไม่แสดง tick บนแกน x
                axisLabel: { show: false }, // ไม่แสดง label บนแกน x
                splitLine: { show: false } // ไม่แสดงเส้นข้างหลังบนแกน x
            },
            yAxis: { // กำหนดแกน y
                type: 'category', // ใช้ประเภทแกนเป็น category
                data: names, // ข้อมูลที่แสดงบนแกน y
                inverse: true, // แสดงข้อมูลจากด้านบนลงล่าง
                axisLine: { show: false }, // ไม่แสดงเส้นแกน y
                axisTick: { show: false }, // ไม่แสดง tick บนแกน y
                axisLabel: { // กำหนดลักษณะของ label บนแกน y
                    margin: 30, // ตั้งค่าระยะห่างจากแกน
                    fontSize: 14 // ขนาดฟอนต์
                },
                splitLine: { show: false } // ไม่แสดงเส้นข้างหลังบนแกน y
            },
            series: [{ // ข้อมูลที่แสดงในกราฟ
                name: 'Value', // ชื่อของ series
                type: 'bar', // ใช้กราฟแท่ง
                data: values.map((value, index) => ({ // สร้างข้อมูลสำหรับแต่ละแท่งกราฟ
                    value: value, // จำนวนที่แสดงในแท่ง
                    itemStyle: { // กำหนดสไตล์ของแท่ง
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [ // ใช้ gradient สำหรับสี
                            { offset: 0, color: colors[index] }, // สีที่ตำแหน่ง 0
                            { offset: 0.9, color: colors[index] }, // สีที่ตำแหน่ง 0.9
                        ]),
                        borderRadius: [20, 20, 20, 20] // กำหนดความโค้งมนของขอบ
                    }
                })),
                barWidth: '20%', // กำหนดความกว้างของแท่งกราฟ
                label: { // กำหนด label ของแท่งกราฟ
                    show: true, // แสดง label
                    position: 'right', // วาง label ที่ด้านขวาของแท่ง
                    offset: [5, 0], // กำหนดระยะห่างจากแท่ง
                    fontSize: 14, // ขนาดฟอนต์ของ label
                    formatter: '{c}' // รูปแบบของ label
                }
            }]
        };

        if (myChart.current) {
            myChart.current.setOption(option); // ตั้งค่า option ให้กับกราฟ
        }

        return () => {
            if (myChart.current) {
                myChart.current.dispose(); // ทำลาย ECharts instance เมื่อ component ถูก unmount
            }
        };
    }, []); // อาร์เรย์ว่าง แสดงว่า useEffect ทำงานเพียงครั้งเดียวตอน mount

    return (
        <div className='summaryEmojiPat'>
            <div className='bg-emoji' ref={chartRef} style={{ height: '400px', width: '50%' }}></div> {/* แสดงกราฟ */}
            Summary {/* ข้อความที่แสดงด้านล่างกราฟ */}
        </div>
    )
}

export default SummaryEmojiPat