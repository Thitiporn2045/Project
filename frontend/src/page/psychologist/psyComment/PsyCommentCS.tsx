import React, { useEffect, useState } from 'react'
import AntD from '../../../component/psychologist/sideBar/AntD'
import './psyComment.css';
import thTH from 'antd/lib/locale/th_TH';
import PsyCommentMain from './PsyCommentMain';
import { ConfigProvider } from 'antd';
import { CrossSectionalInterfaceForPsy,CrossSectionalInterface2 } from '../../../interfaces/crossSectional/ICrossSectional';
import { GetCrossSectionalByDiaryIdForPsy } from '../../../services/https/cbt/crossSectional/crossSectional';
import userEmpty from "../../../assets/userEmty.jpg"
import { calculateAge } from '../../calculateAge';
import 'dayjs/locale/th'; // สำหรับแสดงภาษาไทย
import DiaryDateSelector from '../../../component/psychologist/dateSelect/DiaryDateSelector';

function PsyCommentCS() {
  const [crossSectional, setCrossSectional] = useState<CrossSectionalInterfaceForPsy>();
  const diaryID = localStorage.getItem('diaryID')

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
                width: '100px',
                height: '95px',
                borderRadius: '10px',
                backgroundImage: `url(${(crossSectional?.Patient?.Picture !== '' ? crossSectional?.Patient?.Picture : userEmpty)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '0.5rem'}}>

              </div>
              <div className='Patient-name-age-gender-id'>
                <div>
                  <div>เลขประจำตัวประชาชน {crossSectional?.Patient?.IdNumber}</div>
                  <div>ชื่อ-สกุล: {crossSectional?.Patient?.Firstname} {crossSectional?.Patient?.Lastname}</div>
                  <div>เพศ: {crossSectional?.Patient?.gender}</div>
                  <div>อายุ: {calculateAge(String(crossSectional?.Patient?.Dob))} ปี</div>
                </div>
              </div>
              
            </div>
            <div className="Patient-card-info-right">
              <div className="Patient-email-tel-symtom-dob">
                <div style={{display:'flex', flexDirection:'column', gap: '1rem'}}>
                  <div>อาการที่รักษา: {crossSectional?.Patient?.Symtoms !== '' ? crossSectional?.Patient?.Symtoms:'ไม่ระบุ' }</div> 
                  <div>วันเดือนปีเกิด: {crossSectional?.Patient?.Dob}</div>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: '1rem'}}>
                  <div>อีเมล: {crossSectional?.Patient?.Email}</div> 
                  <div>เบอร์โทรศัพท์: {crossSectional?.Patient?.Tel}</div>
                </div>
               
              </div>
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