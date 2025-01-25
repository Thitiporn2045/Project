import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { DiaryInterface } from '../../../interfaces/diary/IDiary';


interface SummaryBtnProps {
    ID: number; 
    WorksheetType: string; 
  }

const SummaryBtn: React.FC<SummaryBtnProps> = ({ ID, WorksheetType }) => {
    const navigate = useNavigate();
    const navigateToDiaryPage = () => {

      let routePath = '';
      switch (WorksheetType) {
        case 'Activity Planning':
          routePath = '/PsyWorksheet/DashboardSummaryAP';
          break;
        case 'Activity Diary':
          routePath = '/PsyWorksheet/DashboardSummaryAD';
          break;
        case 'Behavioral Experiment':
          routePath = '/PsyWorksheet/DashboardSummaryBE';
          break;
        case 'Cross Sectional':
          routePath = '/PsyWorksheet/DashboardSummaryCS';
          break;
        default:
          console.error('Unknown worksheet type');
          return;
      }

      localStorage.setItem('diaryID',String(ID));
      localStorage.setItem('diaryType',WorksheetType);

      navigate(`${routePath}`);
    };

  return (
    <Button style={{width:100,borderRadius:'15px'}} onClick={navigateToDiaryPage}>
        สรุปข้อมูล
    </Button>
  )
}

export default SummaryBtn