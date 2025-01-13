import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { GetEmotionsHaveDateByDiaryID, GetMonthEmotionsByDiaryID, GetWeekEmotionsByDiaryID } from '../../services/https/cbt/crossSectional/crossSectional';
import dayjs from 'dayjs';
import './summary.css';
import { EmtionInterface } from '../../interfaces/emotion/IEmotion';

interface EmotionByWeek {
  EmotionID: number;
  Name: string;
  ColorCode: string;
  Emoticon: string;
  Date: string;
  Count: number;
}

interface DiaryID {
  diaryID: number | undefined;
  date: string;
}

function FilterEmotions({ diaryID, date }: DiaryID) {
  const [allMoodByWeek, setAllMoodByWeek] = useState<{ [key: string]: EmotionByWeek[] }>({});
  const [allMoodByMonth, setAllMoodByMonth] = useState<{ [key: string]: EmotionByWeek[] }>({});
  const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [view, setView] = useState<'week' | 'month' | 'day'>('week');
  const chartRef = useRef<HTMLDivElement | null>(null);

  const fetchFilterWeekEmotionsByDiary = async () => {
    if (!diaryID || !date) {
      console.error("Diary ID or date is missing");
      return;
    }
    try {
      const res = await GetWeekEmotionsByDiaryID(diaryID, date);
      if (res) {
        setAllMoodByWeek(res);
      } else {
        setAllMoodByWeek({});
      }
    } catch (error) {
      console.error('Error fetching diary:', error);
      setAllMoodByWeek({});
    }
  };

  const fetchFilterMonthEmotionsByDiary = async () => {
    if (!diaryID || !date) {
      console.error("Diary ID or date is missing");
      return;
    }
    try {
      const res = await GetMonthEmotionsByDiaryID(diaryID, date);
      if (res) {
        setAllMoodByMonth(res);
      } else {
        setAllMoodByMonth({});
      }
    } catch (error) {
      console.error('Error fetching diary:', error);
      setAllMoodByMonth({});
    }
  };

  const fetchEmotionPatientData = async () => {
    try {
      const res = await GetEmotionsHaveDateByDiaryID(diaryID, date);
      if (res) {
        const transformedEmotions = res.map((emotion: any) => ({
          ID: emotion.emotion_id,
          Name: emotion.emotion_name,
          Emoticon: emotion.emoticon,
          ColorCode: emotion.color_code,
          PatID: emotion.PatID,
          Patient: emotion.Patient,
        }));
        setEmotionPatients(transformedEmotions);
      } else {
        console.error("Failed to fetch emotions");
      }
    } catch (error) {
      console.error("Error fetching emotions:", error);
    }
  };

  useEffect(() => {
    fetchFilterWeekEmotionsByDiary();
    fetchFilterMonthEmotionsByDiary();
    fetchEmotionPatientData();
  }, [diaryID, date]);

  useEffect(() => {
    if (view === 'week' && Object.keys(allMoodByWeek).length > 0) {
      const chartInstance = echarts.init(chartRef.current as HTMLElement);
      const chartData = Object.values(allMoodByWeek).flat().map((emotion) => ({
        value: emotion.Count,
        name: emotion.Name,
        itemStyle: {
          emoticon: emotion.Emoticon,
          color: emotion.ColorCode,
        },
      }));
      const totalCount = chartData.reduce((sum, emotion) => sum + emotion.value, 0);
      const chartDataWithPercentage = chartData.map((emotion) => ({
        ...emotion,
        percentage: ((emotion.value / totalCount) * 100).toFixed(2),
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const emotion = params.data;
            return `${emotion.name} ${emotion.itemStyle.emoticon}<br/>${emotion.value} (${emotion.percentage}%)`;
          },
        },
        textStyle: {
          fontFamily: 'Noto Sans Thai', 
        },
        series: [
          {
            name: 'Emotions',
            type: 'pie',
            radius: '50%',
            data: chartDataWithPercentage,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: '{b}: {d}%',
            },
          },
        ],
      };

      chartInstance.setOption(option);
      setChart(chartInstance);

      const handleResize = () => {
        chartInstance.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else if (view === 'month' && Object.keys(allMoodByMonth).length > 0) {
      const chartInstance = echarts.init(chartRef.current as HTMLElement);
      const chartData = Object.values(allMoodByMonth).flat().map((emotion) => ({
        value: emotion.Count,
        name: emotion.Name,
        itemStyle: {
          emoticon: emotion.Emoticon,
          color: emotion.ColorCode,
        },
      }));
      const totalCount = chartData.reduce((sum, emotion) => sum + emotion.value, 0);
      const chartDataWithPercentage = chartData.map((emotion) => ({
        ...emotion,
        percentage: ((emotion.value / totalCount) * 100).toFixed(2),
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const emotion = params.data;
            return `${emotion.name} ${emotion.itemStyle.emoticon}<br/>${emotion.value} (${emotion.percentage}%)`;
          },
        },
        textStyle: {
          fontFamily: 'Noto Sans Thai', 
        },
        series: [
          {
            name: 'Emotions',
            type: 'pie',
            radius: '50%',
            data: chartDataWithPercentage,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: '{b}: {d}%',
            },
          },
        ],
      };

      chartInstance.setOption(option);
      setChart(chartInstance);

      const handleResize = () => {
        chartInstance.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else if (view === 'day' && emotionPatients.length > 0) {
      const chartInstance = echarts.init(chartRef.current as HTMLElement);
      const chartData = emotionPatients.map((emotion) => ({
        value: 1,
        name: emotion.Name,
        itemStyle: {
          color: emotion.ColorCode,
          emoticon: emotion.Emoticon,
        },
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}',
        },
        textStyle: {
          fontFamily: 'Noto Sans Thai', 
        },
        series: [
          {
            name: 'Emotions',
            type: 'pie',
            radius: '50%',
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: (params: any) => {
                const emotion = params.data;
                return `${emotion.name} ${emotion.itemStyle.emoticon}`;
              },
            },
          },
        ],
      };

      chartInstance.setOption(option);
      setChart(chartInstance);

      const handleResize = () => {
        chartInstance.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [allMoodByWeek, allMoodByMonth, emotionPatients, view]);

  const getGraphTitle = () => {
    switch (view) {
      case 'week':
        return 'กราฟรายสัปดาห์';
      case 'month':
        return 'กราฟรายเดือน';
      case 'day':
        return 'กราฟรายวัน';
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        width: '100%', 
        height: '47vh',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '.7rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1rem',
          zIndex: 100,
          width: '95%' // กำหนดความกว้างให้คอนเทนเนอร์
        }}
      >
        <div className='title'>{getGraphTitle()}</div>
        <div
          style={{
            display: 'flex',
            gap: '.4rem',

          }}
        >
          <button className='btnSummary' onClick={() => setView('day')}>รายวัน</button>
          <button className='btnSummary' onClick={() => setView('week')}>รายสัปดาห์</button>
          <button className='btnSummary' onClick={() => setView('month')}>รายเดือน</button>
        </div>
      </div>
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '50vh',
        }} 
      />
    </div>
  );
}

export default FilterEmotions;
