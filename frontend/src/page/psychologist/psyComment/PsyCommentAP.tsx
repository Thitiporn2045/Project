import React, { useEffect, useState } from 'react'
import './psyComment.css'
import AntD from '../../../component/psychologist/sideBar/AntD'
import PsyCommentMain from './PsyCommentMain'
import { ConfigProvider, Table, TableColumnsType } from "antd";
import thTH from 'antd/lib/locale/th_TH';
import { ActivityPlanningInterfaceForPsy } from '../../../interfaces/activityPlanning/IActivityPlanning';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { calculateAge } from '../../calculateAge';
import userEmpty from "../../../assets/userEmty.jpg"
import { GetActivityPlanningByDiaryIDForPsy } from '../../../services/https/cbt/activityPlanning/activityPlanning';
import dayjs from 'dayjs';

interface DayActivities {
  เช้า: ActivityPlanningInterfaceForPsy[];
  กลางวัน: ActivityPlanningInterfaceForPsy[];
  เย็น: ActivityPlanningInterfaceForPsy[];
}

function PsyCommentAP() {
  const [diary, setDiary] = useState<DiaryPatInterface>();
  const [activityPlanning, setActivityPlanning] = useState<ActivityPlanningInterfaceForPsy[]>([]);
  const diaryID = localStorage.getItem('diaryID');

  const getDiaryByID = async () =>{
    let res = await GetDiaryByDiaryID(Number(diaryID));

    if(res){
      setDiary(res);
    }
  }

  const listActivityPlanning = async () => {
    let res = await GetActivityPlanningByDiaryIDForPsy(Number(diaryID));
    if(res){
      setActivityPlanning(res);
    }
    console.log(activityPlanning)
  }

  useEffect(()=>{
    getDiaryByID();
    listActivityPlanning();
  },[])

  //================================================================================= 
  const [dates, setDates] = useState<string[]>([]);
  useEffect(()=>{
   
    const startDate = dayjs(diary?.Start, 'DD-MM-YYYY');
    const endDate = dayjs(diary?.End, 'DD-MM-YYYY');

    const generatedDates:string[] = [];
    for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
      generatedDates.push(date.format('DD-MM-YYYY'));
    }
    setDates(generatedDates);
  },[diary, activityPlanning])
  
  
  // const dates = Array.from(new Set(activityPlanning.map((activity) => activity.Date)));
  const timeOfDayNames = ["เช้า", "กลางวัน", "เย็น"];
  const timeOfDayNames2 = ["🌤️ เช้า", "🌞 กลางวัน", "🌙 เย็น"];


  const getActivityForTimeOfDay = (date: string, timeOfDay: string) => {
    return activityPlanning
      .filter((activity) => activity.Date === date && activity.TimeOfDayName === timeOfDay)
      .map((activity) => (
        <div key={activity.ID}>
          <p style={{ background: activity.ColorCode, borderRadius: '5px',display:'flex',flexDirection:'row',justifyContent:'center'}}> 
            {activity.Activity || "ไม่มีข้อมูล"} {activity.Emotion? <>&nbsp;({activity.Emoticon} {activity.Emotion})</>: ''}   
          </p>
           
        </div>
      ));
  };

 

  return (
    <ConfigProvider
    locale={thTH}
    theme={{
      components:{
        Input: {
          inputFontSize: 16
        },
      },
      token:{
        colorPrimary: '#2C9F99',
        colorText:'#585858',
        fontFamily:'Noto Sans Thai, sans-serif'
      }
    }}
  >
    <div className='PsyCommentAP'>
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className="Content">
           {/* Pat info card*/}
           <div className='Patient-card-info'>
            <div className="Patient-card-info-left">
              <div className="Patient-picture"
                style={{
                width: '100px',
                height: '95px',
                borderRadius: '10px',
                backgroundImage: `url(${(diary?.Patient?.Picture !== '' ? diary?.Patient?.Picture : userEmpty)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '0.5rem'}}>

              </div>
              <div className='Patient-name-age-gender-id'>
                <div>
                  <div>เลขประจำตัวประชาชน {diary?.Patient?.IdNumber}</div>
                  <div>ชื่อ-สกุล: {diary?.Patient?.Firstname} {diary?.Patient?.Lastname}</div>
                  <div>เพศ: {diary?.Patient?.gender}</div>
                  <div>อายุ: {calculateAge(String(diary?.Patient?.Dob))} ปี</div>
                </div>
              </div>
              
            </div>
            <div className="Patient-card-info-right">
              <div className="Patient-email-tel-symtom-dob">
                <div style={{display:'flex', flexDirection:'column', gap: '1rem'}}>
                  <div>อาการที่รักษา: {diary?.Patient?.Symtoms !== '' ? diary?.Patient?.Symtoms:'ไม่ระบุ' }</div> 
                  <div>วันเดือนปีเกิด: {diary?.Patient?.Dob}</div>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: '1rem'}}>
                  <div>อีเมล: {diary?.Patient?.Email}</div> 
                  <div>เบอร์โทรศัพท์: {diary?.Patient?.Tel}</div>
                </div>
                
              </div>
            </div>
          </div>
          

          {/* ตาราง */}
          <div className="Record-info">
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th className="fixed-column" style={{ zIndex: 4 }}>วันที่</th>
                    {timeOfDayNames2.map((timeOfDay) => (
                      <th key={timeOfDay}>{timeOfDay}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((date) => (
                    <tr key={date}>
                      <td className="fixed-column">{date}</td>
                      {timeOfDayNames.map((timeOfDay) => (
                        <td key={`${date}-${timeOfDay}`}>
                          {getActivityForTimeOfDay(date, timeOfDay)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
        </div>

      
      <div className='Comment'>
        <div style={{width:'100%',height:'10%',display:'flex',alignItems:'center'}}>
          <b style={{fontSize:20,color:'#585858',marginLeft:'0.5rem'}}>แสดงความคิดเห็น/คำแนะนำ</b>
        </div>
        <PsyCommentMain/>
      </div>
    </div>
  </ConfigProvider>
  )
}

export default PsyCommentAP