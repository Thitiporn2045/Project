import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { GetEmotionsHaveDateByDiaryID, GetMonthEmotionsByDiaryID, GetWeekEmotionsByDiaryID } from '../../services/https/cbt/crossSectional/crossSectional';
import dayjs from 'dayjs';
import 'dayjs/locale/th'; 
import './summary.css';
import { EmtionInterface } from '../../interfaces/emotion/IEmotion';
import { GetEmotionsBehavioralExpHaveDateByDiaryID, GetMonthEmotionsBehavioralExpByDiaryID, GetWeekEmotionsBehavioralExpByDiaryID } from '../../services/https/cbt/behavioralExp/behavioralExp';
dayjs.locale('th');

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

// เพิ่ม interfaces ใหม่ที่ด้านบนของไฟล์
interface ChartDataItem {
  value: number;
  name: string;
  itemStyle: {
    color: string;
    emoticon: string;
  };
  percentage?: string;
}

function FilterEmotionsBehav({ diaryID, date }: DiaryID) {
  const [allMoodByWeek, setAllMoodByWeek] = useState<{ [key: string]: EmotionByWeek[] }>({});
  const [allMoodByMonth, setAllMoodByMonth] = useState<{ [key: string]: EmotionByWeek[] }>({});
  const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]);
  const [view, setView] = useState<'week' | 'month' | 'day'>('week');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const hasData = () => {
    switch (view) {
      case 'day':
        return emotionPatients && emotionPatients.length > 0;
      case 'week':
        return allMoodByWeek && Object.keys(allMoodByWeek).length > 0;
      case 'month':
        return allMoodByMonth && Object.keys(allMoodByMonth).length > 0;
      default:
        return false;
    }
  };

  const fetchFilterWeekEmotionsByDiary = async () => {
    if (!diaryID || !date) return;
    try {
      const res = await GetWeekEmotionsBehavioralExpByDiaryID(diaryID, date);
      setAllMoodByWeek(res || {});
    } catch (error) {
      console.error('Error fetching diary:', error);
      setAllMoodByWeek({});
    }
  };

  const fetchFilterMonthEmotionsByDiary = async () => {
    if (!diaryID || !date) return;
    try {
      const res = await GetMonthEmotionsBehavioralExpByDiaryID(diaryID, date);
      setAllMoodByMonth(res || {});
    } catch (error) {
      console.error('Error fetching diary:', error);
      setAllMoodByMonth({});
    }
  };

  const fetchEmotionPatientData = async () => {
    if (!diaryID || !date) return;
    try {
      const res = await GetEmotionsBehavioralExpHaveDateByDiaryID(diaryID, date);
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
        setEmotionPatients([]);
      }
    } catch (error) {
      console.error("Error fetching emotions:", error);
      setEmotionPatients([]);
    }
  };

  useEffect(() => {
    fetchFilterWeekEmotionsByDiary();
    fetchFilterMonthEmotionsByDiary();
    fetchEmotionPatientData();
  }, [diaryID, date]);

// แก้ไขส่วนของ createChartOption
const createChartOption = () => {
  let data: any[] = [];
  if (view === 'week' && Object.keys(allMoodByWeek).length > 0) {
    data = Object.values(allMoodByWeek).flat();
  } else if (view === 'month' && Object.keys(allMoodByMonth).length > 0) {
    data = Object.values(allMoodByMonth).flat();
  } else if (view === 'day' && emotionPatients.length > 0) {
    data = emotionPatients;
  }

  if (data.length === 0) return null;

  const chartData: ChartDataItem[] = view === 'day'
    ? data.map(emotion => ({
        value: 1,
        name: emotion.Name,
        itemStyle: {
          color: emotion.ColorCode,
          emoticon: emotion.Emoticon,
        },
      }))
    : data.map(emotion => ({
        value: emotion.Count,
        name: emotion.Name,
        itemStyle: {
          color: emotion.ColorCode,
          emoticon: emotion.Emoticon,
        },
      }));

  if (!view.includes('day')) {
    const totalCount = chartData.reduce((sum, emotion) => sum + emotion.value, 0);
    chartData.forEach(item => {
      item.percentage = ((item.value / totalCount) * 100).toFixed(2);
    });
  }
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const emotion = params.data;
        return view === 'day'
          ? `${emotion.name} ${emotion.itemStyle.emoticon}`
          : `${emotion.name} ${emotion.itemStyle.emoticon}<br/>${emotion.value} (${emotion.percentage}%)`;
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
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          formatter: view === 'day'
            ? (params: any) => `${params.data.name} ${params.data.itemStyle.emoticon}`
            : '{b}: {d}%',
        },
      },
    ],
  };
};

  useEffect(() => {
    const initChart = () => {
      if (!chartContainerRef.current) return;

      // Dispose existing chart if any
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Clear the container
      chartContainerRef.current.innerHTML = '';

      if (!hasData()) return;

      // Create new chart
      const newChart = echarts.init(chartContainerRef.current);
      const option = createChartOption();
      
      if (option) {
        newChart.setOption(option);
        chartInstance.current = newChart;
      }
    };

    initChart();

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [view, allMoodByWeek, allMoodByMonth, emotionPatients]);

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

  const NoDataMessage = () => (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'absolute',
        top: 30,
        left: 0,
      }}
    >
      <div className="noDataGraph"></div>
      <div className="textNoDataGraph">ไม่มีข้อมูล</div>
    </div>
  );

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
          width: '95%'
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
        style={{
          width: '100%',
          height: '50vh',
          position: 'relative'
        }}
      >
        <div
          ref={chartContainerRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        {!hasData() && <NoDataMessage />}
      </div>
    </div>
  );
}

export default FilterEmotionsBehav;