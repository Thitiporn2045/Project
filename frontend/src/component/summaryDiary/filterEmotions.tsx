import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

interface EmotionByData {
  EmotionID: number;
  Name: string;
  ColorCode: string;
  Emoticon: string;
  Date: string;
}

interface DiaryID {
  diaryID: number | undefined;
}


function FilterEmotions({ diaryID }: DiaryID) {
  const [allMoodByDate, setAllMoodByDate] = useState<EmotionByData[]>([]);
  const [filterType, setFilterType] = useState('day');

  const groupDataByDate = (data: EmotionByData[], type: string) => {
    return data.reduce((acc: Record<string, EmotionByData[]>, current) => {
      const date = new Date(current.Date);
      let key: string | undefined;
  
      if (type === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (type === 'week') {
        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
        key = `Week ${weekNumber}, ${date.toLocaleString('default', { month: 'short' })}`;
      } else if (type === 'month') {
        key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
  
      if (key && !acc[key]) {
        acc[key] = [];
      }
  
      if (key) {
        acc[key].push(current);
      }
  
      return acc;
    }, {} as Record<string, EmotionByData[]>);
  };
  

  const renderChart = (data: EmotionByData[]) => {
    const chartDom = document.getElementById('emotionsChart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);
    const groupedData = groupDataByDate(data, filterType);

    // Get unique emotions
    const uniqueEmotions = Array.from(new Set(data.map(item => item.Name)));

    // Prepare series data
    const series = uniqueEmotions.map(emotion => {
      return {
        name: emotion,
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: (params: any) => params.value > 0 ? params.value : ''
        },
        data: Object.keys(groupedData).map(date => {
          return groupedData[date].filter(item => item.Name === emotion).length;
        })
      };
    });

    const option = {
      title: {
        text: `Emotion Distribution by ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: 30,
        data: uniqueEmotions
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Object.keys(groupedData),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: series,
      color: Array.from(new Set(data.map(item => item.ColorCode)))
    };

    chart.setOption(option);

    // Handle resize
    window.addEventListener('resize', () => {
      chart.resize();
    });

    return () => {
      window.removeEventListener('resize', () => {
        chart.resize();
      });
      chart.dispose();
    };
  };

  useEffect(() => {
    if (diaryID) {
      setAllMoodByDate(allMoodByDate);
    }
  }, [diaryID]);

  useEffect(() => {
    if (allMoodByDate.length > 0) {
      renderChart(allMoodByDate);
    }
  }, [allMoodByDate, filterType]);

  return (
    <div className="w-full p-4">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${filterType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilterType('day')}
        >
          Day
        </button>
        <button
          className={`px-4 py-2 rounded ${filterType === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilterType('week')}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded ${filterType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilterType('month')}
        >
          Month
        </button>
      </div>
      <div id="emotionsChart" className="w-full h-96" />
    </div>
  );
}

export default FilterEmotions;
