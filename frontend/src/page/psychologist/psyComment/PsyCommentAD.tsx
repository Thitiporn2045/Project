import React, { useEffect, useState } from 'react'
import PsyCommentMain from './PsyCommentMain'
import AntD from '../../../component/psychologist/sideBar/AntD'
import thTH from 'antd/lib/locale/th_TH';
import { ConfigProvider, Table, TableColumnsType } from "antd";
import { ActivityDiaryInterface } from '../../../interfaces/activityDiary/IActivityDiary';
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { calculateAge } from '../../calculateAge';
import userEmpty from "../../../assets/userEmty.jpg"
import { GetActivityDiaryByDiaryID } from '../../../services/https/cbt/activityDiary/activityDiary';
import timeRanges from '../../timeRange.json';
import dayjs from 'dayjs';


interface ColumnType {
  title: string | undefined;
  dataIndex: string | undefined;
  key: string | undefined;
  render?: (text: string) => string;
}

function PsyCommentAD() {
  const [diary, setDiary] = useState<DiaryPatInterface>();
  const [activityDiary, setActivityDiary] = useState<ActivityDiaryInterface[]>([]);
  const diaryID = localStorage.getItem('diaryID');

  const getDiaryByID = async () => {
    let res = await  GetDiaryByDiaryID(Number(diaryID));

    if(res){
      setDiary(res);
    } console.log(res)
  }

  const listActivitiesDiary = async() => {
    let res = await GetActivityDiaryByDiaryID(Number(diaryID));
    if(res){
      setActivityDiary(res);
     
    } 
  }

  useEffect(()=>{
    getDiaryByID();
    listActivitiesDiary();
  },[])

  //=========================================================================
  const [dates, setDates] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    // Generate date range
    if (diary?.Start && diary?.End) {
      const startDate = dayjs(diary.Start, 'DD-MM-YYYY');
      const endDate = dayjs(diary.End, 'DD-MM-YYYY');

      const generatedDates:string[] = [];
      for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
        generatedDates.push(date.format('DD-MM-YYYY'));
      }
      setDates(generatedDates);

      // Generate table data
      const data = timeRanges.map(range => {
        const rowData: Record<string, any> = { TimeRange: range.label };

          generatedDates.forEach(date => {
              // หา Activity ที่ตรงกับ Date และ Time Range
              const activities = activityDiary.filter(event => {
                  if (event.Time) { // ตรวจสอบว่า Time มีค่า
                      const hour = parseInt(event.Time.split(":")[0], 10); // แยกชั่วโมงจาก Time
                      return (
                          event.Date === date && // ตรวจสอบวันที่
                          hour >= range.start && // ตรวจสอบช่วงเวลาตามช่วงที่กำหนด
                          hour < range.end
                      );
                  }
                  return false; // ข้าม event ที่ไม่มี Time
              });

              // รวมกิจกรรมที่เจอในช่วงเวลานั้น
              if (date) { // ตรวจสอบว่า date ไม่เป็น undefined
                  // หากไม่มีกิจกรรม ให้ตั้งค่าเป็น null
                  const activitiesContent = activities
                      .map(a => {
                          const activityText = a.Activity || "No activity"; // กิจกรรม
                          const emotion = a.Emotion
                              ? `${a.Emotion.Emoticon} ${a.Emotion.Name}` // อารมณ์
                              : ""; // เช่น "😌 Calm"
                          
                          // กำหนด style สำหรับสีพื้นหลังของข้อความตาม Emotion.ColorCode
                          const style = a.Emotion ? { backgroundColor: a.Emotion.ColorCode, borderRadius: '5px' } : {};

                          return (
                              <p style={style}>{`${activityText} (${emotion})`}</p>
                          );
                      });

                  // ใช้ reduce โดยกำหนดค่าเริ่มต้นเป็น empty ReactFragment
                  rowData[date] = activitiesContent.length > 0
                      ? activitiesContent.reduce((acc, curr) => (
                          <>
                              {acc}
                              {curr}
                          </>
                      ))
                      : null; // หากไม่มีข้อมูลให้เป็น null
              }
          });

          return rowData;
      });

      setTableData(data);
      console.log(data)
    }
  }, [diary, activityDiary]);


 //=========================================================================
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
      <div className='PsyCommentAD'>
        <div className='SideBar'>
          <AntD/>
        </div>

        <div className='Content'>
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

          {/* Display data*/}
          <div className='Record-info'>
            <div className="table-wrapper">
              <table className="custom-table">
                 <thead>
                  <tr>
                    <th className="fixed-column" style={{zIndex:4}}>ช่วงเวลา</th>
                   {dates.map((date) => (
                      <th key={date}>{date}</th>
                    ))}
                  </tr>
                </thead> 
                 <tbody>
                 {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="fixed-column">{row.TimeRange}</td>
                      {dates.map((date) => (
                        <td key={date}>
                          <div>{row[date]}</div>
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

export default PsyCommentAD