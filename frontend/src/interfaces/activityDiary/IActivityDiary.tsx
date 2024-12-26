import { DiaryPatInterface } from "../diary/IDiary";
import { EmtionInterface } from "../emotion/IEmotion";

export interface ActivityDiaryInterface{ //Pat only
    ID?: number,
    Date?: string,
    Time?: string,
    Activity?: string,


    DiaryID?: number;
    Diary?: DiaryPatInterface;

    EmotionID?: number;
    Emotion?: EmtionInterface;
}