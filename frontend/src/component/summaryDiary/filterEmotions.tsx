import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { GetDateEmotionsByDiaryID } from '../../services/https/cbt/crossSectional/crossSectional';

interface EmotionByData {
  EmotionID: number;
  Name: string;
  ColorCode: string;
  Emoticon: string;
  Date: string;
}

function FilterEmotions() {
  const [allMoodByDate, setAllMoodByDate] = useState<EmotionByData[]>([]);
  const [filterType, setFilterType] = useState('day');
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const diaryID = 8;

  const fetchFilterEmotionsByDiary = async () => {
    try {
      const res = await GetDateEmotionsByDiaryID(Number(diaryID));
      if (res && res.length > 0) {
        setAllMoodByDate(res);
      } else {
        setAllMoodByDate([]);
      }
    } catch (error) {
      console.error('Error fetching diary:', error);
      setAllMoodByDate([]);
    }
  };

  const processData = (data: EmotionByData[]) => {
    const emotionCounts = data.reduce((acc, item) => {
      acc[item.Name] = (acc[item.Name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(emotionCounts).map(name => ({
      value: emotionCounts[name],
      name,
    }));

    return pieData;
  };

  const renderChart = () => {
    if (!chart) {
      const chartDom = document.getElementById('chart')!;
      const newChart = echarts.init(chartDom);
      setChart(newChart);
    }

    const pieData = processData(allMoodByDate);
    const options = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Emotions',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData,
        },
      ],
    };

    chart?.setOption(options);
  };

  useEffect(() => {
    fetchFilterEmotionsByDiary();
  }, [diaryID]);

  useEffect(() => {
    if (allMoodByDate.length) {
      renderChart();
    }
  }, [allMoodByDate, filterType]);

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleFilterChange('week')}>Weekly</button>
        <button onClick={() => handleFilterChange('month')}>Monthly</button>
      </div>
      <div id="chart" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default FilterEmotions;
