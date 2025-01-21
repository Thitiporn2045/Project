import { DiaryPatInterface } from "../diary/IDiary";
import { EmtionInterface } from "../emotion/IEmotion";
import { TimeOfDayInterface } from "../timeOfDay/ITimeOfDay";

export interface ActivityPlanningInterface{
    ID?: number,
    Date?: string,
    Time?: string,
    Activity?: string,

    TimeOfDayID?: number;
    TimeOfDay?: TimeOfDayInterface;

    DiaryID?: number;
    Diary?: DiaryPatInterface;

    EmotionID?: number;
    Emotion?: EmtionInterface;
}

export interface ActivityPlanningInterfaceForPsy{
    Date?: string;
    Time?: string;     
    Activity?: string;                
    Emotion?: string; 
    Emoticon?: string;
    ColorCode?: string;
    TimeOfDayEmoticon?: string;
    TimeOfDayName?: string;
}