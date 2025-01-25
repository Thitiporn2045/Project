import React, { useEffect, useState } from 'react'
import AntD from '../../../component/psychologist/sideBar/AntD'
import PsyCommentMain from './PsyCommentMain'
import './psyComment.css'
import thTH from 'antd/lib/locale/th_TH';
import { Button, ConfigProvider } from 'antd'
import userEmpty from "../../../assets/userEmty.jpg"
import { DiaryPatInterface } from '../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../services/https/diary';
import { calculateAge } from '../../calculateAge';
import DiaryDateSelector from '../../../component/psychologist/dateSelect/DiaryDateSelector';
import { BehavioralExpInterface } from '../../../interfaces/behavioralExp/IBehavioralExp';
import { GetBehavioralExpByDiaryID, GetEmotionsBehavioralExpHaveDateByDiaryID } from '../../../services/https/cbt/behavioralExp/behavioralExp';
import { EmtionInterface } from '../../../interfaces/emotion/IEmotion';
import SummaryBtn from '../../../component/psychologist/summaryBtn/SummaryBtn';

function PsyCommentBE() {
  const [diary, setDiary] = useState<DiaryPatInterface>();
  const [behaviorals, setBehaviorals] = useState<BehavioralExpInterface[]>([]);
  const [filteredBehaviorals, setFilteredBehaviorals] = useState<BehavioralExpInterface[]>([]);
  const [emotion, setEmotion] = useState<EmtionInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const diaryID = localStorage.getItem('diaryID');
  const diaryType = localStorage.getItem('diaryType');


  const getDiaryByID = async () => {
    let res = await  GetDiaryByDiaryID(Number(diaryID));

    if(res){
      setDiary(res);
    }
  }

  const getBehavioralExpByDiaryID = async () => {
    let res = await GetBehavioralExpByDiaryID(Number(diaryID));
    if(res){
      setBehaviorals(res);
    }
    console.log('All behavioral',behaviorals);
  }

  const getEmotionsBehavioral = async () => {
    let res = await GetEmotionsBehavioralExpHaveDateByDiaryID(Number(diaryID),String(selectedDate));
    if(res){
      
    }
  }

  useEffect(()=>{
    getDiaryByID();
    getBehavioralExpByDiaryID();
    getEmotionsBehavioral();
  },[]);

  //================================================================================= //ติดปัญหาอัพเดตข้อมูลช้า ต้องดับเบิ้ลคลิกตอนเลือกวันที่
  const handleDateChange = (date: string) => {
    console.log('วันที่ที่เลือก:', date); 
    setSelectedDate(date);
    setFilteredBehaviorals([]);
    
    if (selectedDate) {
      // กรองข้อมูลเมื่อ selectedDate เปลี่ยน
      const filtered = behaviorals.filter((item) => item.Date === selectedDate) || [];
      setFilteredBehaviorals(filtered);
      console.log("filter by date: ", filtered);
    }
  };
      
  //=================================================================================
  const splitThoughts = (thought: string) => {
    const delimiter = "#$";
    const [negativeThought, alternativeThought] = thought.split(delimiter);
    return { negativeThought, alternativeThought };
  };

  const splitNewThought = (newThought: string) => {
    const delimiter = "#$";
    const [oldBelief, newBelief] = newThought.split(delimiter);
    return { oldBelief, newBelief };
};

  const { negativeThought, alternativeThought } = splitThoughts(String(filteredBehaviorals.map((item)=>(item.ThoughtToTest))) || '');
  const { oldBelief, newBelief } = splitNewThought(String(filteredBehaviorals.map((item)=>(item.NewThought))) || '');

  //=================================================================================

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
    <div className='PsyCommentBE'>
      <div className='SideBar'>
        <AntD/>
      </div>

      <div className='Content'>
        {/* Pat info card*/}
        <div className='Patient-card-info'>
          <div className="Patient-card-info-left">
            <div className="Patient-picture"
              style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundImage: `url(${(diary?.Patient?.Picture !== '' ? diary?.Patient?.Picture : userEmpty)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              }}>

            </div>
            <div className='Patient-name-age-gender-id'>
              <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%',height:'32px',}}>
                <div style={{fontSize:22}}>
                  <b>คุณ{diary?.Patient?.Firstname} {diary?.Patient?.Lastname}</b>
                  
                </div>
                
              </div>
                
              <div style={{display:'flex',flexDirection:'column',}}>
                {/* ข้อมูลผู้ป่วย */}

                <div className="info-row">
                  <div className="info-item1"><b>เลขประจำตัวประชาชน:</b> {diary?.Patient?.IdNumber}</div>
                  <div className="info-item"><b>เพศ:</b> {diary?.Patient?.gender}</div>
                  <div className="info-item"><b>วันเกิด:</b> {diary?.Patient?.Dob} ({calculateAge(String(diary?.Patient?.Dob))} ปี)</div>
                </div>

                <div className="info-row">
                  <div className="info-item1"><b>อาการที่รักษา:</b> {diary?.Patient?.Symtoms !== '' ? diary?.Patient?.Symtoms : 'ไม่ระบุ'}</div>
                  <div className="info-item"><b>อีเมล:</b> {diary?.Patient?.Email}</div>
                  <div className="info-item"><b>เบอร์โทรศัพท์:</b> {diary?.Patient?.Tel}</div>
                </div>

                
                
                
              </div>
            </div>
            <SummaryBtn ID={Number(diaryID)} WorksheetType={String(diaryType)}/>
            </div>
        </div>

        {/* Date Selector*/}
        <div className='Records-select'>
          <DiaryDateSelector
            start={String(diary?.Start)}
            end={String(diary?.End)}
            onDateChange={handleDateChange} // ส่ง callback
          />
        </div>

        {/* Display data*/}
        <div className='Record-info'>
          <div className='behav-target'>
            <div  style={{marginLeft:'1rem',fontSize:'18px',height:'30%',display:'flex',alignItems:'center',}}><b>ความคิดที่ต้องการทดสอบ</b></div>
            <div style={{marginLeft:'1.5rem',flexGrow:1}}>
              <b style={{color:'#989898'}}>ความคิดเชิงลบ:</b> {negativeThought}<p></p>
              <b style={{color:'#989898'}}>ความคิดทางเลือก:</b> {alternativeThought}
            </div>
          </div>
          <div className='behav-experiment'>
            <div style={{marginLeft:'1rem',fontSize:'18px',height:'30%',display:'flex',alignItems:'center',}}><b>การวางแผนและปฏิบัติ</b></div>
            <div style={{marginLeft:'1.5rem',flexGrow:1}}>
              {filteredBehaviorals.map((item)=>(item.Experiment))}
            </div>
          </div>
          <div className='behav-outcome'>
            <div style={{marginLeft:'1rem',fontSize:'18px',height:'30%',display:'flex',alignItems:'center',}}><b>การประเมินผล</b></div>
            <div style={{marginLeft:'1.5rem',flexGrow:1}}>
              {filteredBehaviorals.map((item)=>(item.Outcome))}
            </div>
          </div>
          <div className='behav-learned'>
            <div style={{marginLeft:'1rem',fontSize:'18px',height:'30%',display:'flex',alignItems:'center',}}><b>บทเรียนที่ได้</b></div>
            <div style={{marginLeft:'1.5rem',flexGrow:1}}>
              <b style={{color:'#989898'}}>ความคิดเดิม: </b>{oldBelief}<p></p>
              <b style={{color:'#989898'}}>ความคิดใหม่: </b>{newBelief}
            </div>
          </div>


        </div>
        
      </div>

    {/**======================================================================================= */}  
      
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

export default PsyCommentBE