import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { CountDiariesByWorksheetType } from '../../../services/https/diary';

const worksheetTypeMapping: Record<number, string> = {
    1: 'Activity Planning',
    2: 'Activity Diary',
    3: 'Behavioral Experiment',
    4: 'Cross Sectional',
};

const BarChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [worksheetType, setWorksheetType] = useState<{ name: string; value: number }[]>([]);

    const fetchCountDiariesByWorksheetType = async () => {
        try {
            const res = await CountDiariesByWorksheetType();
            if (res) {
                setWorksheetType(res.map((item: { worksheet_type_id: number; count: number }) => ({
                    name: worksheetTypeMapping[item.worksheet_type_id] || 'Unknown',
                    value: item.count,
                })));                
            }
        } catch (error) {
            console.error('Error fetching worksheet type count:', error);
        }
    };

    useEffect(() => {
        fetchCountDiariesByWorksheetType();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: worksheetType.map((item) => item.name),
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
                        data: worksheetType.map((item) => item.value),
                        type: 'bar',
                        itemStyle: {
                            color: '#c8b0f6',
                            shadowColor: 'rgba(200, 176, 246, 0.6)',
                            shadowBlur: 10,
                            borderRadius: [5, 5, 0, 0],
                        },
                        barWidth: '50%',
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
    }, [worksheetType]);

    return (
        <div
            style={{
                background: '#ffffff',
                width: '55vw',
                height: '30.5vh',
                borderRadius: '15px',
                padding: '20px',
                border: '1px solid #EBF1F5',
                boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
                zIndex: 1,
            }}
        >
            <div ref={chartRef} style={{ height: '100%', width: '100%', maxHeight: '400px' }} />
        </div>
    );
};

export default BarChart;
