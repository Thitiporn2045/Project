import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import './stylePat.css';
import { Button, Input, Select, Tooltip, Tag, ConfigProvider, message } from 'antd';
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';
import { useSearchParams } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { GetDiaryByDiaryID } from '../../../../services/https/diary';
import { CreateCrossSectional } from '../../../../services/https/cbt/crossSectional/crossSectional';
import { CrossSectionalInterface } from '../../../../interfaces/crossSectional/ICrossSectional';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const CrossSectional: React.FC = () => {
  const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
  const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
  const [selectEmotion, setSelectEmotion] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
  const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
  const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null); 

  // สถานะสำหรับข้อมูลฟอร์ม
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [behavior, setBehavior] = useState('');
  const [bodilySensation, setBodilySensation] = useState('');
  const [textEmotions, setTextEmotions] = useState('');

  const fetchDiaryByDiary = async () => {
    if (diaryID) {
      try {
        const res = await GetDiaryByDiaryID(Number(diaryID)); // เรียกใช้ API โดยส่งค่า id
        if (res) {
          setDiary(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
        }
        console.log('Diary:', res); // แสดงข้อมูลที่ได้รับในคอนโซล
      } catch (error) {
        console.error('Error fetching diary:', error); // แสดงข้อผิดพลาด
      }
    }
  };
  
  const fetchEmotionPatientData = async () => {
    const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
    if (res) {
      setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
    }
    console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
  };

  useEffect(() => {
    fetchEmotionPatientData();
    fetchDiaryByDiary();
  }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์ถูกแสดง

  const handleSelectChange = (selectedValues: number[], setTags: React.Dispatch<React.SetStateAction<{ value: number; label: string; color: string; emotion: string }[]>>) => {
    const updatedTags = selectedValues.map(value => {
      const emotion = emotionPatients.find(emotion => emotion.ID === value);
      return {
        value: emotion?.ID || value,
        label: emotion?.Name || '',
        color: emotion?.ColorCode || '#d9d9d9',
        emotion: emotion?.Emoticon || ''
      };
    });
    setTags(updatedTags);
  };
  
  const createTagRender = (selectedTags: { value: number; label: string; color: string; emotion: string }[]) => {
    return (props: any) => {
      const { label, value, closable, onClose } = props;
      const selectedTag = selectedTags.find(tag => tag.value === value);
      const color = selectedTag?.color || '#d9d9d9'; // สี default ถ้าไม่เจอ
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
      };
  
      return (
        <Tag
          color={color}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{
            marginInlineEnd: 4,
            color: 'white', // Ensure text is visible
            textShadow: '1px 1px 2px rgba(192, 192, 192, 0.8)',
            textAlign: 'center'
          }}
        >
          {label}
        </Tag>
      );
    };
  };
  
  const handleSave = async () => {
    if (!situation || !thought || !behavior || !bodilySensation || !textEmotions || selectEmotion.length === 0) {
      messageApi.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (selectEmotion.length < 2) { // ถ้าต้องการบังคับ 3 อัน ให้เปลี่ยนเป็น `< 3`
      messageApi.error("กรุณาเลือกอารมณ์อย่างน้อย 2 อัน");
      return;
    }
  
    const emotionIDs = selectEmotion.map(emotion => emotion.value);
    const currentDate = dayjs().format('DD-MM-YYYY');
    const data: CrossSectionalInterface = {
      Situation: situation,
      Thought: thought,
      Behavior: behavior,
      BodilySensation: bodilySensation,
      TextEmotions: textEmotions,
      DiaryID: Number(diaryID),
      EmotionID: emotionIDs,
      Date: currentDate,
    };
  
    console.log('ข้อมูลที่บันทึก:', data);
  
    try {
      const response = await CreateCrossSectional(data);
      if (response.status) {
        messageApi.success("บันทึกข้อมูลสำเร็จ");
        setTimeout(() => {
          navigate('/mainSheet');
        }, 2000);
      } else {
        messageApi.error(response.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      messageApi.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      console.error(error);
    }
  };
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#9BA5F6', // Example of primary color customization
        },
      }}
    >
      <div className="crossSectional">
      {contextHolder} {/* Make sure this line is present */}
        <div className="befor-main">
          <div className='main-body'>
            <div className='sidebar'>
              <NavbarPat />
            </div>
            <div className="main-background">
              <div className="bg-maincontent">
                <div className="bg-content">
                  <div className="content">
                    <div className='head'>
                      <div className='onTitle'>
                        <h2 className="title">สถานการณ์ของวันนี้</h2>
                      </div>
                      <div className='lowerInput'>
                        <Input 
                          required
                          className='mainTitle' 
                          placeholder="ตัวอย่าง:/ ทะเลาะกับสมาชิกในครอบครัว" 
                          value={situation} 
                          onChange={(e) => setSituation(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="lower-content">
                      <div className="bg-Content">
                        <div className='content-box'>
                          <h3>ความคิด</h3>
                          <div className="bg-input">
                          <textarea 
                            required
                            className='content-input' 
                            placeholder="ตัวอย่าง:/ -เขาไม่รักฉันแล้ว      - ฉันไม่มีค่าในสายตาของครอบครัว" 
                            value={thought} 
                            onChange={(e) => setThought(e.target.value)} 
                          />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>พฤติกรรม</h3>
                          <div className="bg-input">
                          <textarea 
                              required
                              className='content-input' 
                              placeholder="ตัวอย่าง:/ -เดินออกจากห้องโดยไม่พูดอะไร                       - ปฏิเสธที่จะร่วมรับประทานอาหารร่วมกัน" 
                              value={behavior} 
                              onChange={(e) => setBehavior(e.target.value)} 
                            />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>ความรู้สึกทางร่างกาย</h3>
                          <div className="bg-input">
                          <textarea
                            required
                            className='content-input' 
                            placeholder="ตัวอย่าง:/ -หายใจเร็ว                        - ท้องไส้ปั่นป่วน                         - รู้สึกเจ็บหน้าอก " 
                            value={bodilySensation} 
                            onChange={(e) => setBodilySensation(e.target.value)} 
                          />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>อารมณ์</h3>
                          <div className="bg-input">
                            <textarea 
                              required
                              className='content-input' 
                              placeholder="ตัวอย่าง:/ -เศร้า                         - โกรธ                                   - รู้สึกโดดเดี่ยว "
                              value={textEmotions}
                              onChange={(e) => setTextEmotions(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <header>
                <div className='on'>
                  <h1 className="title">{diary?.Name}</h1>
                </div>
                <div className='lower'>
                  <div className="name">
                    <h2 className="typebook">{diary?.WorksheetType?.Name || "ไม่มีข้อมูล"}</h2>
                  </div>
                </div>
                <div className="emo">
                  <div className="showEmo">
                    {selectEmotion && selectEmotion.length > 0 ? (
                      selectEmotion.map((emotion) => (
                        <span
                          key={emotion.value}
                          onMouseEnter={() => setHoveredEmoji(emotion.label)} // ตั้งค่าอิโมจิที่ถูกวางเมาส์
                          onMouseLeave={() => setHoveredEmoji(null)} // รีเซ็ตเมื่อเอาเมาส์ออก
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5em',
                            backgroundColor: emotion.color,
                            borderRadius: '50%',
                            width: '2em',
                            height: '2em',
                            color: '#fff',
                            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
                            cursor: 'pointer', // เพิ่มตัวชี้เมื่อโฮเวอร์
                          }}
                        >
                          {emotion.emotion}
                        </span>
                      ))
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <div className="Loading-Data-Self"></div>
                        <div className="text">โปรดเลือกอิโมจิตามอารมณ์ของคุณ</div>
                      </div>
                    )}
                  </div>
                  {hoveredEmoji && (
                    <div className="hover-menu">
                      {hoveredEmoji}
                    </div>
                  )}
                  <Select
                    className='content-emo'
                    mode="multiple"
                    tagRender={createTagRender(selectEmotion)}
                    options={emotionPatients.map(emotion => ({
                      value: emotion.ID,
                      label: `${emotion.Emoticon} ${emotion.Name}`,
                    }))}
                    placeholder="ความรู้สึก..."
                    optionLabelProp="label"
                    optionFilterProp="label"
                    onChange={(values) => handleSelectChange(values, setSelectEmotion)} // ส่ง setThoughtsTags
                    />

                    </div>
                    <button 
                      className="btn-submit" 
                      onClick={handleSave}
                    >
                      บันทึก
                    </button>
              </header>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CrossSectional;
