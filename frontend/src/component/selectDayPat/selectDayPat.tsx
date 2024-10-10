import React, { useState, useEffect, useRef } from 'react'; // นำเข้า React และ hooks ที่ใช้ในคอมโพเนนต์
import './stylePat.css'; // นำเข้าคำสั่ง CSS สำหรับการตกแต่ง
import { FaRegCalendarAlt } from "react-icons/fa"; // นำเข้าไอคอนปฏิทินจาก react-icons
import * as echarts from 'echarts'; // นำเข้าทั้งหมดจากไลบรารี echarts สำหรับการสร้างกราฟ

// สร้างข้อมูลตัวอย่างสำหรับวันที่เฉพาะ
const mockData = {
    [new Date(2024, 7, 7).toDateString()]: [ // ข้อมูลสำหรับวันที่ 7 สิงหาคม 2024
        { image: 'url_to_image1', name: 'Item A', amount: 1, color: '#80FFA5' },
        { image: 'url_to_image2', name: 'Item B', amount: 2, color: '#00DDFF' },
        { image: 'url_to_image3', name: 'Item C', amount: 3, color: '#37A2FF' },
        { image: 'url_to_image4', name: 'Item D', amount: 4, color: '#FF0087' },
        { image: 'url_to_image5', name: 'Item E', amount: 5, color: '#FFBF00' },
    ],
    [new Date(2024, 7, 6).toDateString()]: [ // ข้อมูลสำหรับวันที่ 6 สิงหาคม 2024
        { image: 'url_to_image1', name: 'Item F', amount: 1, color: '#fdc5f5' },
        { image: 'url_to_image2', name: 'Item G', amount: 2, color: '#f7aef8' },
        { image: 'url_to_image3', name: 'Item H', amount: 3, color: '#b388eb' },
        { image: 'url_to_image4', name: 'Item I', amount: 4, color: '#8093f1' },
        { image: 'url_to_image5', name: 'Item J', amount: 5, color: '#72ddf7' },
    ],
    [new Date(2024, 7, 5).toDateString()]: [ // ข้อมูลสำหรับวันที่ 5 สิงหาคม 2024
        { image: 'url_to_image1', name: 'Item F', amount: 5, color: '#fdc5f5' },
        { image: 'url_to_image2', name: 'Item G', amount: 4, color: '#f7aef8' },
        { image: 'url_to_image3', name: 'Item H', amount: 3, color: '#b388eb' },
        { image: 'url_to_image4', name: 'Item I', amount: 2, color: '#8093f1' },
        { image: 'url_to_image5', name: 'Item J', amount: 1, color: '#72ddf7' },
    ],
};

function SelectDayPat() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date()); // วันที่ปัจจุบัน
    const [showFullCalendar, setShowFullCalendar] = useState<boolean>(false); // สถานะการแสดงปฏิทินเต็ม
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // วันที่ที่เลือก
    const chartRef = useRef<HTMLDivElement | null>(null); // ref สำหรับกราฟรายวัน
    const weeklyChartRef = useRef<HTMLDivElement | null>(null); // ref สำหรับกราฟรายสัปดาห์
    const myChart = useRef<echarts.EChartsType | null>(null); // ref สำหรับอินสแตนซ์ของ echarts

    useEffect(() => {
        if (chartRef.current) {
            myChart.current = echarts.init(chartRef.current); // สร้างอินสแตนซ์ของกราฟใน DOM
        }

        const selectedDateStr = selectedDate.toDateString(); // แปลงวันที่ที่เลือกเป็นสตริง
        const filteredData = mockData[selectedDateStr] || []; // ดึงข้อมูลที่ตรงกับวันที่ที่เลือก

        const sortedData = filteredData.sort((a, b) => b.amount - a.amount); // จัดเรียงข้อมูลตามจำนวนจากมากไปน้อย

        const names = sortedData.map(item => item.name); // ดึงชื่อของรายการ
        const values = sortedData.map(item => item.amount); // ดึงจำนวนของรายการ
        const colors = sortedData.map(item => item.color); // ดึงสีของรายการ

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '5%',
                right: '5%',
                bottom: '5%',
                left: '15%'
            },
            xAxis: {
                max: 'dataMax',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: names,
                inverse: true,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    margin: 30,
                    fontSize: 14
                },
                splitLine: { show: false }
            },
            series: [{
                name: 'Value',
                type: 'bar',
                data: values.map((value, index) => ({
                    value: value,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: colors[index] },
                            { offset: 0.9, color: colors[index] },
                        ]),
                        borderRadius: [20, 20, 20, 20]
                    }
                })),
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'right',
                    offset: [10, 0],
                    fontSize: 14,
                    formatter: '{c}'
                }
            }]
        };

        if (myChart.current) {
            myChart.current.setOption(option); // อัพเดทกราฟด้วยตัวเลือกที่กำหนด
        }

        return () => {
            if (myChart.current) {
                myChart.current.dispose(); // ล้างข้อมูลกราฟเมื่อคอมโพเนนต์ถูกยกเลิก
            }
        };
    }, [selectedDate]);

    const getWeeklyData = () => {
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // รายชื่อวันในสัปดาห์
        const itemsData: { [key: string]: number[] } = {};
    
        weekDays.forEach((day, index) => {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - currentDate.getDay() + index); // คำนวณวันที่ในสัปดาห์
            const dateStr = date.toDateString(); // แปลงวันที่เป็นสตริง
            const dayData = mockData[dateStr] || []; // ดึงข้อมูลตามวันที่
    
            dayData.forEach(item => {
                if (!itemsData[item.name]) {
                    itemsData[item.name] = Array(7).fill(0); // สร้างอาเรย์ของ 0 ขนาด 7 วัน
                }
                itemsData[item.name][index] = item.amount; // บันทึกจำนวนตามวัน
            });
        });
    
        return { weekDays, itemsData }; // ส่งคืนข้อมูลวันในสัปดาห์และข้อมูลรายการ
    };

    useEffect(() => {
        if (weeklyChartRef.current) {
            const weeklyChart = echarts.init(weeklyChartRef.current); // สร้างอินสแตนซ์ของกราฟใน DOM
            const { weekDays, itemsData } = getWeeklyData(); // ดึงข้อมูลสัปดาห์

            const series = Object.entries(itemsData).map(([name, data]) => ({
                name: name,
                type: 'line' as const,
                // stack: 'Total',
                data: data
            }));

            const option: echarts.EChartsOption = {
                title: { text: 'Stacked Line' }, // ชื่อกราฟ
                tooltip: { trigger: 'axis' }, // รูปแบบของ tooltip
                legend: { data: Object.keys(itemsData) }, // ชื่อของรายการที่แสดงใน legend
                toolbox: { feature: { saveAsImage: {} } }, // เครื่องมือสำหรับบันทึกภาพ
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, // กำหนดพื้นที่ของกราฟ
                xAxis: { type: 'category', boundaryGap: false, data: weekDays }, // แกน x เป็นประเภท category
                yAxis: { 
                    type: 'value',
                    min: 0, // ตั้งค่าต่ำสุดของแกน y เป็น 0
                    max: 20 // ตั้งค่าช่วงสูงสุดของแกน y เป็น 100
                },
                series: series // ข้อมูลกราฟ
            };

            weeklyChart.setOption(option); // อัพเดทกราฟรายสัปดาห์ด้วยตัวเลือกที่กำหนด

            return () => {
                weeklyChart.dispose(); // ล้างข้อมูลกราฟเมื่อคอมโพเนนต์ถูกยกเลิก
            };
        }
    }, [currentDate]);

    const getMonthYear = (date: Date): string => {
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // แสดงเดือนและปี
    };

    const getDayInfo = (date: Date): { day: string, date: number } => {
        return {
            day: date.toLocaleString('en-US', { weekday: 'short' }), // แสดงชื่อวันในสัปดาห์
            date: date.getDate(), // แสดงวันที่
        };
    };

    const getWeekDays = (): { day: string, date: number }[] => {
        const days = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i); // คำนวณวันที่ในสัปดาห์
            days.push(getDayInfo(date)); // เพิ่มข้อมูลวัน
        }
        return days;
    };

    const getMonthDays = (): Date[] => {
        const year = currentDate.getFullYear(); // ปีปัจจุบัน
        const month = currentDate.getMonth(); // เดือนปัจจุบัน
        const firstDay = new Date(year, month, 1); // วันที่ 1 ของเดือน
        const lastDay = new Date(year, month + 1, 0); // วันที่สุดท้ายของเดือน

        const daysArray = [];
        const startOffset = firstDay.getDay(); // วันที่เริ่มต้นของเดือน

        for (let i = 0; i < 42; i++) { // คำนวณ 42 วันเพื่อแสดงทั้งหมดในปฏิทิน
            const day = new Date(year, month, i - startOffset + 1);
            daysArray.push(day); // เพิ่มวันในอาเรย์
        }

        return daysArray;
    };

    const changeDate = (increment: number): void => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + increment); // ปรับวันที่ตามที่กำหนด
        setCurrentDate(newDate); // อัพเดทวันที่
    };

    const changeMonth = (increment: number): void => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + increment); // ปรับเดือนตามที่กำหนด
        setCurrentDate(newDate); // อัพเดทวันที่
    };

    const toggleFullCalendar = (): void => {
        setShowFullCalendar(!showFullCalendar); // สลับการแสดงปฏิทินเต็ม
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear(); // ตรวจสอบว่าเป็นวันปัจจุบันหรือไม่
    };

    const isSelectedDate = (date: Date): boolean => {
        return date.toDateString() === selectedDate.toDateString() && !isToday(date); // ตรวจสอบว่าเป็นวันที่ที่เลือกหรือไม่
    };

    const handleDateClick = (date: Date): void => {
        setSelectedDate(date); // ตั้งค่าวันที่ที่เลือก
        setCurrentDate(date); // อัพเดทวันที่ปัจจุบัน
    };

    return (
        <div className='selectDayPat'>
            <div className="header">
                <h1 className="schedule-icon"><FaRegCalendarAlt /> {getMonthYear(currentDate)}</h1>
                <button className="see-all" onClick={toggleFullCalendar}>
                    {showFullCalendar ? 'Hide' : 'See All'}
                </button>
            </div>
            <div className="month-selector">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <span>{getMonthYear(currentDate)}</span>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            {!showFullCalendar ? (
                <div className="week-view">
                    <button onClick={() => changeDate(-1)}>&lt;</button>
                    {getWeekDays().map((day, index) => (
                        <div
                            key={index}
                            className={`day ${isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)) ? 'selected' : ''} ${isSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)) ? 'selected-date' : ''}`}
                            onClick={() => handleDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date))}
                        >
                            <div className="day-name">{day.day}</div>
                            <div className="day-number">{day.date}</div>
                        </div>
                    ))}
                    <button onClick={() => changeDate(1)}>&gt;</button>
                </div>
            ) : (
                <div className="full-calendar">
                    <div className="weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday">{day}</div>
                        ))}
                    </div>
                    <div className="days-grid">
                        {getMonthDays().map((day, index) => (
                            <div
                                key={index}
                                className={`day ${day.getMonth() === currentDate.getMonth() ? 'current-month' : 'other-month'} ${isToday(day) ? 'selected' : ''} ${isSelectedDate(day) ? 'selected-date' : ''}`}
                                onClick={() => handleDateClick(day)}
                            >
                                {day.getDate()}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className='summaryEmojiPat'>
                <div className='bg-emoji' ref={chartRef}></div> {/* พื้นที่สำหรับกราฟรายวัน */}
                <div className="chart" ref={weeklyChartRef} style={{ width: '100%', height: '400px' }}></div> {/* พื้นที่สำหรับกราฟรายสัปดาห์ */}
                Summary
            </div>
        </div>
    );
}

export default SelectDayPat;
