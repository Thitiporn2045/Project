import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { GetActivityDiaryEmotionsByDateTimeAndDiaryID } from '../../services/https/cbt/activityDiary/activityDiary';

interface EmotionByDateTime {
    EmotionID: number;
    Name: string;
    ColorCode: string;
    Emoticon: string;
    Date: string;
    TimeRange: string;
    Count: number;
}

interface DiaryID {
    diaryID: number | undefined;
    date: string;
}

function DateEmotionBar({ diaryID, date }: DiaryID) {
    const [allMoodByDateTime, setAllMoodByDateTime] = useState<{ [key: string]: EmotionByDateTime[] }>({});
    const [hasData, setHasData] = useState(false);
    const chartRef = useRef<echarts.ECharts | null>(null);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const mountedRef = useRef(true);

    // Cleanup function
    const cleanupChart = () => {
        try {
            if (chartRef.current) {
                chartRef.current.dispose();
                chartRef.current = null;
            }
        } catch (error) {
            console.error('Error during chart cleanup:', error);
        }
    };

    // Component mount/unmount effect
    useEffect(() => {
        mountedRef.current = true;
        
        return () => {
            mountedRef.current = false;
            cleanupChart();
        };
    }, []);

    // Data fetching effect
    useEffect(() => {
        const fetchAllMoodByDateTime = async () => {
            if (!diaryID || !date) return;
            
            try {
                const res = await GetActivityDiaryEmotionsByDateTimeAndDiaryID(diaryID, date);
                if (mountedRef.current) {
                    setAllMoodByDateTime(res || {});
                    setHasData(!!res && Object.keys(res).length > 0);
                }
            } catch (error) {
                console.error('Error fetching diary:', error);
                if (mountedRef.current) {
                    setAllMoodByDateTime({});
                    setHasData(false);
                }
            }
        };

        fetchAllMoodByDateTime();
    }, [diaryID, date]);

    // Chart initialization and update effect
    useEffect(() => {
        if (!hasData || !chartContainerRef.current || !mountedRef.current) {
            cleanupChart();
            return;
        }

        // Ensure cleanup before creating new chart
        cleanupChart();

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (!mountedRef.current || !chartContainerRef.current) return;

            try {
                // Initialize chart
                chartRef.current = echarts.init(chartContainerRef.current);

                // Prepare chart data...
                const prepareChartData = () => {
                    const allEmotions = new Set<string>();
                    const timeRanges = new Set<string>();
                    const emotionColors: { [key: string]: string } = {};
                    const emotionEmoticons: { [key: string]: string } = {};
                    const emotionCounts: { [key: string]: { [key: string]: number } } = {};
                    const emotionIDs: { [key: string]: number } = {};

                    Object.values(allMoodByDateTime).flat().forEach(item => {
                        allEmotions.add(item.Name);
                        timeRanges.add(item.TimeRange);
                        emotionColors[item.Name] = item.ColorCode;
                        emotionEmoticons[item.Name] = item.Emoticon;
                        emotionIDs[item.Name] = item.EmotionID;
                        if (!emotionCounts[item.Name]) emotionCounts[item.Name] = {};
                        emotionCounts[item.Name][item.TimeRange] = item.Count;
                    });

                    const timeRangesArray = Array.from(timeRanges).sort();
                    const emotionsArray = Array.from(allEmotions).sort((a, b) => emotionIDs[a] - emotionIDs[b]);

                    const rawData = emotionsArray.map(emotion =>
                        timeRangesArray.map(timeRange => emotionCounts[emotion]?.[timeRange] || 0)
                    );

                    const totalData = timeRangesArray.map((_, idx) =>
                        rawData.reduce((sum, emotionCounts) => sum + emotionCounts[idx], 0)
                    );

                    return { emotionsArray, timeRangesArray, rawData, totalData, emotionColors, emotionEmoticons };
                };

                const { emotionsArray, timeRangesArray, rawData, totalData, emotionColors, emotionEmoticons } = prepareChartData();

                const darkenColor = (color: string, amount: number) => {
                    let usePound = false;

                    if (color[0] === "#") {
                        color = color.slice(1);
                        usePound = true;
                    }

                    const num = parseInt(color, 16);

                    let r = (num >> 16) - amount;
                    let b = ((num >> 8) & 0x00FF) - amount;
                    let g = (num & 0x0000FF) - amount;

                    r = r < 0 ? 0 : r;
                    b = b < 0 ? 0 : b;
                    g = g < 0 ? 0 : g;

                    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
                };

                const series = emotionsArray.map((name, idx) => ({
                    name: `${name} ${emotionEmoticons[name]}`,
                    type: 'bar',
                    stack: 'total',
                    barWidth: '40%',
                    itemStyle: {
                        color: emotionColors[name],
                        borderRadius: [15, 15, 15, 15],
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        fontSize: 14,
                        rich: {
                            emoji: {
                                fontSize: 20,
                                lineHeight: 25,
                                align: 'center',
                                verticalAlign: 'middle',
                            },
                            percentage: {
                                fontSize: 12,
                                fontWeight: 550,
                                color: darkenColor(emotionColors[name], 100),
                            },
                        },
                        formatter: (params: any) => {
                            const value = params.value;
                            if (value > 0) {
                                const percentage =
                                    totalData[params.dataIndex] > 0
                                        ? ((value / totalData[params.dataIndex]) * 100).toFixed(1) + '%'
                                        : '';
                                return `{emoji|${emotionEmoticons[name]}}\n{percentage|${percentage}}`;
                            }
                            return '';
                        },
                    },
                    data: rawData[idx],
                }));

                if (!mountedRef.current || !chartRef.current) return;

                chartRef.current.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'shadow' },
                    },
                    textStyle: {
                        fontFamily: 'Noto Sans Thai',
                        color: '#333f60'
                    },
                    title: {
                        text: 'กราฟแสดงอารมณ์ของแต่ละช่วงเวลา',
                        subtext: `กราฟแสดงอารมณ์ของแต่ละช่วงเวลาของวันที่ ${date}`,
                        left: 'center',
                        top: '0',
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'bold',
                        },
                    },
                    legend: {
                        bottom: '0',
                        data: emotionsArray.map(name => `${name} ${emotionEmoticons[name]}`),
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '12%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        data: timeRangesArray,
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                        },
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series,
                });
            } catch (error) {
                console.error('Error initializing chart:', error);
                cleanupChart();
            }
        }, 100);

        const handleResize = () => {
            if (chartRef.current && mountedRef.current) {
                chartRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
            cleanupChart();
        };
    }, [allMoodByDateTime, hasData, date]);

    return hasData ? (
        <div 
            ref={chartContainerRef}
            style={{
                padding: '1rem 0',
                width: '100%',
                height: '60vh',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '1rem'
            }}
        />
    ) : (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: '60px'
            }}
        >
            <div className="noDataGraphTime"></div>
            <div className="textNoDataGraphTime">ไม่มีข้อมูลวันที่ {date}</div>
        </div>
    );
}

export default DateEmotionBar;