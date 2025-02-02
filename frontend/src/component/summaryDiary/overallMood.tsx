import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { GetEmotionsByDiaryID } from '../../services/https/cbt/crossSectional/crossSectional';

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

function OverallMood({ diaryID }: DiaryID) {
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

    useEffect(() => {
        if (overallMood.length > 0) {
            // Sort overallMood by Count in descending order
            const sortedOverallMood = [...overallMood].sort((a, b) => b.Count - a.Count);
    
            const dataAxis = sortedOverallMood.map(item => item.Name);
            const data = sortedOverallMood.map(item => item.Count);
            const colors = sortedOverallMood.map(item => item.ColorCode);
            const emojis = sortedOverallMood.map(item => item.Emoticon);
    
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: (params: any) => {
                        const index = params[0].dataIndex;
                        return `${emojis[index]} ${dataAxis[index]}: ${data[index]} ครั้ง`;
                    }
                },
                title: {
                    text: 'กราฟแสดงแนวโน้มอารมณ์ของไดอารี่เล่มนี้',
                    left: 'center',
                    top: '0',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                    },
                },
                textStyle: {
                    fontFamily: 'Noto Sans Thai', // กำหนดฟอนต์สำหรับข้อความทั้งหมดในกราฟ
                },
                xAxis: {
                    type: 'category',
                    data: dataAxis,
                    axisLabel: {
                        formatter: (value: string, index: number) => {
                            const emoji = emojis[index];
                            return `{emoji|${emoji}}\n{name|${value}}`;
                        },
                        rich: {
                            emoji: {
                                fontSize: 20,
                                lineHeight: 30
                            },
                            name: {
                                fontSize: 14,
                                color: '#333',
                                lineHeight: 20
                            }
                        }
                    },
                    axisLine: {
                        show: false // ซ่อนเส้นแกน X
                    },
                    axisTick: {
                        show: false // ซ่อนเครื่องหมายบนแกน X
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} ',
                        rich: {
                            value: {
                                padding: [0, 0, 0, 10], // เพิ่มระยะห่างด้านซ้าย
                                fontSize: 14,
                                color: '#333'
                            }
                        }
                    },
                    axisLine: {
                        show: false // ซ่อนเส้นแกน Y
                    },
                    axisTick: {
                        show: false // ซ่อนเครื่องหมายบนแกน Y
                    },
                    splitLine: {
                        show: false // ซ่อนเส้นแบ่งในแกน Y
                    }
                },
                series: [
                    {
                        type: 'bar',
                        data,
                        barWidth: '30%', 
                        itemStyle: {
                            borderRadius: [10, 10, 10, 10],
                            color: (params: { dataIndex: number }) => colors[params.dataIndex]
                        },
                        showBackground: true,
                        backgroundStyle: {
                            borderRadius: [10, 10, 10, 10],
                            color: 'rgba(237, 240, 255, 0.58)'
                        }
                    }
                ],
                grid: {
                    left: '3%',
                    right: '1%',
                    bottom: '10%',
                    containLabel: true
                }
            };
    
            const chartElement = document.getElementById('mood-chart');
            if (chartElement) {
                const myChart = echarts.init(chartElement);
                myChart.setOption(option);
            }
        }
    }, [overallMood]);
    

    return (
        <div className="overallMood">
            <div id="mood-chart" style={{
                width: '65.5vw',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.5)',  // โปร่งใสเล็กน้อย
                backdropFilter: 'blur(20px)',            // เบลอพื้นหลัง
                WebkitBackdropFilter: 'blur(20px)', // สำหรับเบราว์เซอร์ที่ใช้ Webkit
                borderRadius: '1rem'
            }}></div>
        </div>
    );
}

export default OverallMood;
