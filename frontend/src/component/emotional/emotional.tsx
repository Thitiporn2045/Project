import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import './stylePat.css';

type Emotion = {
    color: string;
    emoji: string;
    label: string;
};

type AddEmotion = {
    color: string;
    emoji: string;
};

const initialEmotions: Emotion[] = [
    { color: '#A8E6CE', emoji: '😊', label: 'Happy' },
    { color: '#FF91AE', emoji: '😡', label: 'Angry' },
    { color: '#F4ED7F', emoji: '😕', label: 'Confused' },
    { color: '#B78FCB', emoji: '😢', label: 'Sad' },
];

const addEmotions: AddEmotion[] = [
    { color: '#A8E6CE', emoji: '😊' },
    { color: '#FF91AE', emoji: '😡' },
    { color: '#F4ED7F', emoji: '😕' },
    { color: '#B78FCB', emoji: '😢' },
];

const EmotionalWeb = () => {
    const [emotions, setEmotions] = useState<Emotion[]>(initialEmotions);
    const [selectedEmotion, setSelectedEmotion] = useState<AddEmotion | null>(null);
    const [newEmotionLabel, setNewEmotionLabel] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleSelectEmotion = (emotion: AddEmotion) => {
        setSelectedEmotion(emotion);
        setIsModalOpen(true); // Open modal to prompt for label
    };

    const handleAddEmotion = () => {
        if (selectedEmotion && newEmotionLabel) {
            const newEmotion: Emotion = {
                ...selectedEmotion,
                label: newEmotionLabel,
            };
            setEmotions((prevEmotions) => [...prevEmotions, newEmotion]);
            setNewEmotionLabel('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className="emotional-web">
            <div className="main-bg">
                <div className="bg-left">
                    <h2>อารมณ์ของคุณ</h2>
                    <div className="emoji-grid">
                        {emotions.map((emotion, index) => (
                            <div
                                key={index}
                                className="emoji"
                                style={{ backgroundColor: emotion.color }}
                            >
                                {emotion.emoji}
                                <span>{emotion.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-right">
                    <h2>เลือกอารมณ์ที่คุณต้องการจะสร้าง</h2>
                    <div className="emoji-grid">
                        {addEmotions.map((emotion, index) => (
                            <div
                                key={index}
                                className="emoji"
                                style={{ backgroundColor: emotion.color }}
                                onClick={() => handleSelectEmotion(emotion)}
                            >
                                {emotion.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                title="ตั้งชื่ออารมณ์ของคุณ"
                visible={isModalOpen}
                onOk={handleAddEmotion}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input
                    placeholder="ใส่ชื่ออารมณ์..."
                    value={newEmotionLabel}
                    onChange={(e) => setNewEmotionLabel(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default EmotionalWeb;
