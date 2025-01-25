import React, { useEffect, useState } from 'react'
import AntD from '../../../component/psychologist/sideBar/AntD'
import './psyComment.css';
import thTH from 'antd/lib/locale/th_TH';
import PsyCommentMain from './PsyCommentMain';
import { ConfigProvider, Button } from 'antd';
import { CrossSectionalInterfaceForPsy,CrossSectionalInterface2 } from '../../../interfaces/crossSectional/ICrossSectional';
import { GetCrossSectionalByDiaryIdForPsy } from '../../../services/https/cbt/crossSectional/crossSectional';
import userEmpty from "../../../assets/userEmty.jpg"
import { calculateAge } from '../../calculateAge';
import 'dayjs/locale/th'; // สำหรับแสดงภาษาไทย
import DiaryDateSelector from '../../../component/psychologist/dateSelect/DiaryDateSelector';
import SummaryBtn from '../../../component/psychologist/summaryBtn/SummaryBtn';


function PsyCommentCS() {
  const [crossSectional, setCrossSectional] = useState<CrossSectionalInterfaceForPsy>();
  const diaryID = localStorage.getItem('diaryID');
  const diaryType = localStorage.getItem('diaryType');

  //=========================================================================================
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredCrossSectionals, setFilteredCrossSectionals] = useState<CrossSectionalInterface2[]>([]);

  const handleDateChange = (date: string) => {
    console.log('วันที่ที่เลือก:', date); // ทำสิ่งที่คุณต้องการกับวันที่ เช่นดึงข้อมูลจาก backend
    setSelectedDate(date);
    setFilteredCrossSectionals([]);
 // กรองข้อมูล CrossSectionals ตามวันที่
    const filtered = crossSectional?.CrossSectionals?.filter(
      (item) => item.Date === date
    )||[] ;
    setFilteredCrossSectionals(filtered);
    console.log('filter by date: ',filteredCrossSectionals)
    

  };
//=========================================================================================
  const getCrossSectional = async () => {
    let res = await GetCrossSectionalByDiaryIdForPsy(Number(diaryID));
    if(res){
      setCrossSectional(res);
      console.log(crossSectional)
    }
   
  }
  useEffect(() =>{
    getCrossSectional();
  },[]);
//=========================================================================================

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
      <div className="PsyCommentCS">
        <div className='SideBar'>
          <AntD/>
        </div>

        <div className='Content'>
          <div className='Patient-card-info'>
            <div className="Patient-card-info-left">
              <div className="Patient-picture"
               style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundImage: `url(${(crossSectional?.Patient?.Picture !== '' ? crossSectional?.Patient?.Picture : userEmpty)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                }}>

              </div>
              <div className='Patient-name-age-gender-id'>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%',height:'32px',}}>
                  <div style={{fontSize:22}}>
                    <b>คุณ{crossSectional?.Patient?.Firstname} {crossSectional?.Patient?.Lastname}</b>
                   
                  </div>
                  
                </div>
                  
                <div style={{display:'flex',flexDirection:'column',}}>
                  {/* ข้อมูลผู้ป่วย */}
  
                  <div className="info-row">
                    <div className="info-item1"><b>เลขประจำตัวประชาชน:</b> {crossSectional?.Patient?.IdNumber}</div>
                    <div className="info-item"><b>เพศ:</b> {crossSectional?.Patient?.gender}</div>
                    <div className="info-item"><b>วันเกิด:</b> {crossSectional?.Patient?.Dob} ({calculateAge(String(crossSectional?.Patient?.Dob))} ปี)</div>
                  </div>

                  <div className="info-row">
                    <div className="info-item1"><b>อาการที่รักษา:</b> {crossSectional?.Patient?.Symtoms !== '' ? crossSectional?.Patient?.Symtoms : 'ไม่ระบุ'}</div>
                    <div className="info-item"><b>อีเมล:</b> {crossSectional?.Patient?.Email}</div>
                    <div className="info-item"><b>เบอร์โทรศัพท์:</b> {crossSectional?.Patient?.Tel}</div>
                  </div>

                </div>
              </div>

              <SummaryBtn ID={Number(diaryID)} WorksheetType={String(diaryType)}/>
              
            </div>
          </div>
         
          <div className='Records-select'>
            <DiaryDateSelector
              start={String(crossSectional?.Start)}
              end={String(crossSectional?.End)}
              onDateChange={handleDateChange} // ส่ง callback
            />
          </div> 
          
          <div className='Record-situation'>
            <b>สถานการณ์:</b>&nbsp;{filteredCrossSectionals.map((item)=>(item.Situation))} 
          </div>

          <div className='Record-info'>
            <div>
              <div className="arrow-diagonal1"></div>
            </div>

            <div>
              <div className='thought-header'><b>ความคิด</b></div>
              <div className='thought-detail'>{filteredCrossSectionals.map((item2)=>(item2.Thought))}</div>
            </div>

            <div>
              <div className="arrow-diagonal2"></div>
            </div> 

            <div >
              <div className='emotion-header'><b>อารมณ์</b></div>
              <div className='emotion-detail'>
                {filteredCrossSectionals.map((item2)=>(item2.TextEmotion !== ''? 
                  <div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center',justifyContent:'center', gap:'0.5rem'}}>
                      {filteredCrossSectionals.map((item2)=>(item2.Emotions.map((emotion)=>(
                       <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <div>{emotion.Emoticon}</div>
                          <div><b>{emotion.Name}</b></div>
                        </div>
                      ))))}
                    </div>
                    <div style={{color:'#c1c1c1'}}>{filteredCrossSectionals.map((item2)=>(item2.TextEmotion))}</div>

                  </div> : 

                  <div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center',justifyContent:'center', gap:'0.5rem'}}>
                      {filteredCrossSectionals.map((item2)=>(item2.Emotions.map((emotion)=>(
                       <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <div>{emotion.Emoticon}</div>
                          <div><b>{emotion.Name}</b></div>
                        </div>
                      ))))}
                    </div>
                  </div>
                ))}
               
              </div>    
            </div>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div className="arrow-diagonal-center1"></div>
              <div className="arrow-diagonal-center2"></div>
            </div>

            <div >
              <div className='behavior-header'><b>พฤติกรรม</b></div>
              <div className='behavior-detail'>
                {filteredCrossSectionals.map((item2)=>(item2.Behavior))}
              </div>
            </div>
            
            <div>
              <div className="arrow-diagonal4"></div>
            </div>

            <div >
              <div className='bodily-sensation-header'><b>ความรู้สึกทางร่างกาย</b></div>
              <div className='bodily-sensation-detail'>
              {filteredCrossSectionals.map((item2)=>(item2.BodilySensation))}
              </div>
            </div>

            <div>
              <div className="arrow-diagonal5"></div>
            </div>
            
          </div>  
        </div>
        
        <div className='Comment'>
          <div style={{width:'100%',height:'10%',display:'flex',alignItems:'center'}}>
            <b style={{fontSize:20,color:'#585858',marginLeft:'0.8rem'}}>แสดงความคิดเห็น/คำแนะนำ</b>
          </div>
          <PsyCommentMain/>
        </div>
        
      </div>
    </ConfigProvider>
  )
}

export default PsyCommentCS