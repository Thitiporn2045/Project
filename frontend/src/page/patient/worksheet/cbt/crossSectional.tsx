import React, { useState, useEffect } from 'react';
import NavbarPat from '../../../../component/navbarPat/navbarPat';
import './stylePat.css';
import { Button, Input, Select, Tooltip, Tag } from 'antd';
import { BiSolidBookBookmark, BiSolidEditAlt, BiSolidLockOpen } from "react-icons/bi";
import type { SelectProps } from 'antd';

// Define the TagRender function outside the component
const tagRender: SelectProps['tagRender'] = ({ label, value, closable, onClose }) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={value ? value.toString() : undefined} // Check if value is defined before converting to string
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

// Define options for the emotions
const options: SelectProps['options'] = [
  { value: 'green', label: '🙂 Happy' },
  { value: 'red', label: '😡 Angry' },
  { value: 'yellow', label: '😕 Confused' },
  { value: 'purple', label: '😢 Sad' },
];

const CrossSectional: React.FC = () => {
  // const [currentTime, setCurrentTime] = useState<string>("");

  // useEffect(() => {
  //   const updateTime = () => {
  //     const now = new Date();
  //     const formattedTime = now.toLocaleString('th-TH', {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       second: '2-digit',
  //     });
  //     setCurrentTime(formattedTime);
  //   };

  //   updateTime(); // Set time initially
  //   const timer = setInterval(updateTime, 1000); // Update every second

  //   return () => clearInterval(timer); // Cleanup on component unmount
  // }, []);

  return (
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
                {/* <div className="date">
                  {currentTime}
                </div> */}
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
                      <Input className='mainTitle' placeholder="เหตุการณ์หรือสิ่งที่กระตุ้น..." variant="filled" />
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
                            tagRender={tagRender}
                            options={options}
                            placeholder="ความรู้สึก..."
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
                            tagRender={tagRender}
                            options={options}
                            placeholder="ความรู้สึก..."
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
                            tagRender={tagRender}
                            options={options}
                            placeholder="ความรู้สึก..."
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
                            tagRender={tagRender}
                            options={options}
                            placeholder="ความรู้สึก..."
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
  );
};

export default CrossSectional;
