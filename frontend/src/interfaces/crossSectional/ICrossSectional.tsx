import { DiaryPatInterface } from "../diary/IDiary";
import { EmtionInterface } from "../emotion/IEmotion";

export interface CrossSectionalInterface {
    ID?: number;
    Situation?: string;
    Thought?: string;
    Behavior?: string;
    BodilySensation?: string;
    Date?: string;

    DiaryID?: number;
    Diary?: DiaryPatInterface;

    EmotionID?: number[];  // Array of Emotion IDs
}
