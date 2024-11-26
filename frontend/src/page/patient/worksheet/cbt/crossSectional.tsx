import React, { useEffect, useState } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import './stylePat.css';
import { Button, Input, Select, Tooltip, Tag, ConfigProvider } from 'antd';
import { BiSolidEditAlt, BiSolidLockOpen } from "react-icons/bi";
import { GetEmotionByPatientID } from '../../../../services/https/emotion/emotion';
import { EmtionInterface } from '../../../../interfaces/emotion/IEmotion';

const CrossSectional: React.FC = () => {
  const patID = localStorage.getItem('patientID'); // ดึงค่า patientID จาก localStorage
  const [emotionPatients, setEmotionPatients] = useState<EmtionInterface[]>([]); // สถานะเก็บข้อมูลอารมณ์ของผู้ป่วย
  const [thoughtsTags, setThoughtsTags] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
  const [behaviorTags, setBehaviorTags] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
  const [bodilySensationsTags, setBodilySensationsTags] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
  const [emotionsTags, setEmotionsTags] = useState<{ value: number; label: string; color: string; emotion: string }[]>([]);
  
  const fetchEmotionPatientData = async () => {
    const res = await GetEmotionByPatientID(Number(patID)); // เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API
    if (res) {
      setEmotionPatients(res); // เก็บข้อมูลที่ได้จาก API ลงในสถานะ
    }
    console.log('res', res); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
  };

  useEffect(() => {
    fetchEmotionPatientData();
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
      const emotion = selectedTag?.emotion || '';
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
          }}
        >
          {emotion}{label}
        </Tag>
      );
    };
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
        <div className="befor-main">
          <div className='main-body'>
            <div className='sidebar'>
              <NavbarPat />
            </div>
            <div className="main-background">
              <header>
                <div className='on'>
                  <h1 className="title">Week1</h1>
                </div>
                <div className='lower'>
                  <div className="name">
                    <h2 className="typebook">Activity crossSectional</h2>
                  </div>
                  <div className="emo">
                    <div className="content-emo"></div>
                    <div className='button'>
                      <Tooltip title="STATUS">
                        <Button type="primary" shape="circle" icon={<BiSolidLockOpen />} />
                      </Tooltip>
                      <Tooltip title="EDIT">
                        <Button type="primary" shape="circle" icon={<BiSolidEditAlt />} />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </header>
              <div className="bg-maincontent">
                <div className="bg-content">
                  <div className="content">
                    <div className='head'>
                      <div className='onTitle'>
                        <h2 className="title">Situation to Trigger</h2>
                        <button className="btn-submit">บันทึก</button>
                      </div>
                      <div className='lowerInput'>
                        <Input className='mainTitle' placeholder="เหตุการณ์หรือสิ่งที่กระตุ้น..." />
                      </div>
                    </div>
                    <div className="lower-content">
                      <div className="bg-Content">
                        <div className='content-box'>
                          <h3>Thoughts</h3>
                          <div className="bg-input">
                            <textarea className='content-input' placeholder="ความคิด..." />
                            <Select
                              className='feeling-input'
                              mode="multiple"
                              tagRender={createTagRender(thoughtsTags)}
                              options={emotionPatients.map(emotion => ({
                                value: emotion.ID,
                                label: emotion.Name,
                                color: emotion.ColorCode, // ใช้ ColorCode โดยตรง
                              }))}
                              placeholder="ความรู้สึก..."
                              optionLabelProp="label"
                              optionFilterProp="label"
                              onChange={(values) => handleSelectChange(values, setThoughtsTags)} // ส่ง setThoughtsTags
                            />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Behavior</h3>
                          <div className="bg-input">
                            <textarea className='content-input' placeholder="พฤติกรรม..." />
                            <Select
                              className='feeling-input'
                              mode="multiple"
                              tagRender={createTagRender(behaviorTags)}
                              options={emotionPatients.map(emotion => ({
                                value: emotion.ID,
                                label: emotion.Name,
                                color: emotion.ColorCode, // ใช้ ColorCode โดยตรง
                              }))}
                              placeholder="ความรู้สึก..."
                              optionLabelProp="label"
                              optionFilterProp="label"
                              onChange={(values) => handleSelectChange(values, setBehaviorTags)} // ส่ง setThoughtsTags
                            />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Bodily Sensations</h3>
                          <div className="bg-input">
                            <textarea className='content-input' placeholder="พฤติกรรมผลกระทบที่ควบคุมไม่ได้..." />
                            <Select
                              className='feeling-input'
                              mode="multiple"
                              tagRender={createTagRender(bodilySensationsTags)}
                              options={emotionPatients.map(emotion => ({
                                value: emotion.ID,
                                label: emotion.Name,
                                color: emotion.ColorCode, // ใช้ ColorCode โดยตรง
                              }))}
                              placeholder="ความรู้สึก..."
                              optionLabelProp="label"
                              optionFilterProp="label"
                              onChange={(values) => handleSelectChange(values, setBodilySensationsTags)} // ส่ง setThoughtsTags
                            />
                          </div>
                        </div>
                        <div className='content-box'>
                          <h3>Emotions</h3>
                          <div className="bg-input">
                            <textarea className='content-input' placeholder="อารมณ์..." />
                            <Select
                              className='feeling-input'
                              mode="multiple"
                              tagRender={createTagRender(emotionsTags)}
                              options={emotionPatients.map(emotion => ({
                                value: emotion.ID,
                                label: emotion.Name,
                                color: emotion.ColorCode, // ใช้ ColorCode โดยตรง
                              }))}
                              placeholder="ความรู้สึก..."
                              optionLabelProp="label"
                              optionFilterProp="label"
                              onChange={(values) => handleSelectChange(values, setEmotionsTags)} // ส่ง setThoughtsTags
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CrossSectional;
