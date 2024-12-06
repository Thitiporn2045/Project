import React, { useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import './stylePat.css';
import { Button, Input, Select, Tooltip, Tag, ConfigProvider, message } from 'antd';
import { BiSolidEditAlt, BiSolidLockOpen } from "react-icons/bi";
import type { SelectProps } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { DiaryPatInterface } from '../../../../interfaces/diary/IDiary';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';

interface OptionType {
value: string;
emotion: string;
label: string;
}

const options: OptionType[] = [
{ value: '#A8E6CE', emotion: '🙂', label: 'Happy' },
{ value: '#FF91AE', emotion: '😡', label: 'Angry' },
{ value: '#F4ED7F', emotion: '😕', label: 'Confused' },
{ value: '#B78FCB', emotion: '😢', label: 'Sad' },
];

// Define the TagRender function outside the component
const tagRender: SelectProps['tagRender'] = (props) => {
const { label, value, closable, onClose } = props;
const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
};

// Find the option that matches the value
const option = options.find(opt => opt.value === value);

return (
    <Tag
    color={value as string}
    onMouseDown={onPreventMouseDown}
    closable={closable}
    onClose={onClose}
    style={{ marginInlineEnd: 4 }}
    >
    {option?.emotion} {label}
    </Tag>
);
};

const Behavioural: React.FC = () => {

    const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
    const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
    const [selectEmotion, setSelectEmotion] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const [searchParams] = useSearchParams(); // ใช้สำหรับดึงค่าจาก query parameter
    const diaryID = searchParams.get('id'); // ดึงค่าของ 'id' จาก URL
    const [diary, setDiary] = useState<DiaryPatInterface | null>(null); // สถานะเก็บข้อมูลไดอารี่
    const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);   

      // สถานะสำหรับข้อมูลฟอร์ม
    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState('');
    const [behavior, setBehavior] = useState('');
    const [bodilySensation, setBodilySensation] = useState('');

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
        {/* <div className="befor-main">
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
                        <h2 className="title">Situation to Trigger</h2>
                      </div>
                      <div className='lowerInput'>
                        <Input 
                          className='mainTitle' 
                          placeholder="เหตุการณ์หรือสิ่งที่กระตุ้น..." 
                          value={situation} 
                          onChange={(e) => setSituation(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="lower-content">
                      <div className="bg-Content">
                        <div className='content-box'>
                          <h3>Thoughts</h3>
                          <div className="bg-input">
                          <textarea 
                            className='content-input' 
                            placeholder="ความคิด..." 
                            value={thought} 
                            onChange={(e) => setThought(e.target.value)} 
                          />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Behavior</h3>
                          <div className="bg-input">
                          <textarea 
                              className='content-input' 
                              placeholder="พฤติกรรม..." 
                              value={behavior} 
                              onChange={(e) => setBehavior(e.target.value)} 
                            />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Bodily Sensations</h3>
                          <div className="bg-input">
                          <textarea 
                            className='content-input' 
                            placeholder="พฤติกรรมผลกระทบที่ควบคุมไม่ได้..." 
                            value={bodilySensation} 
                            onChange={(e) => setBodilySensation(e.target.value)} 
                          />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Emotions</h3>
                          <div className="bg-input">
                            <textarea className='content-input' placeholder="อารมณ์..." />
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
                    {selectEmotion.map((emotion) => (
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
                    ))}
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
                      <button className="btn-submit" onClick={handleSave}>บันทึก</button>

              </header>
            </div>
          </div>
        </div> */}
      </div>
    </ConfigProvider>
);
};

export default Behavioural;