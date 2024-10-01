import React, { useState } from 'react';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { Slider } from 'antd';

interface IconSliderProps {
    max: number;
    min: number;
    onChange: (value: number) => void; // เพิ่ม onChange callback
  }

  const IconSlider: React.FC<IconSliderProps> = (props) => {
    const { max, min, onChange } = props;
    const [value, setValue] = useState(0);

    const handleChange = (newValue: number) => {
        setValue(newValue);
        onChange(newValue); // ส่งค่ากลับไปยังคอมโพเนนต์หลัก
    };
  
    const mid = Number(((max - min) / 2).toFixed(5));
    const preColorCls = value >= mid ? '' : 'icon-wrapper-active';
    const nextColorCls = value >= mid ? 'icon-wrapper-active' : '';
  
    return (
      <div className="icon-wrapper">
        <FrownOutlined className={preColorCls} />
        <Slider {...props} onChange={handleChange} value={value} />
        <SmileOutlined className={nextColorCls} />
      </div>
    );
  };

  const TestCompo: React.FC<{ onChange: (value: number) => void }> = ({ onChange }) => (
    <IconSlider min={0} max={10} onChange={onChange} />
);;

export default TestCompo

