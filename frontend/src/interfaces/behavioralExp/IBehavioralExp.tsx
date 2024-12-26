import { DiaryPatInterface } from "../diary/IDiary";

export interface BehavioralExpInterface {
    ID?: number;
    ThoughtToTest?: string;
    Experiment?: string;
    Outcome?: string;
    NewThought?: string;
    Date?: string;
    
    negativeThought?: string; // เพิ่มคุณสมบัติเหล่านี้
    alternativeThought?: string;
    oldBelief?: string;
    newBelief?: string;

    DiaryID?: number;
    Diary?: DiaryPatInterface;

    EmotionID?: number[];  // Array of Emotion IDs
}

