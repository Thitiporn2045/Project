import { DiaryPatInterface } from "../diary/IDiary";
import { EmtionInterface } from "../emotion/IEmotion";
import { PatientInterface } from "../patient/IPatient";
import { WorksheetTypeInterface } from "../worksheetType/IWorksheetType";

export interface CrossSectionalInterface {
    ID?: number;
    Situation?: string;
    Thought?: string;
    Behavior?: string;
    BodilySensation?: string;
    TextEmotions?: string;
    Date?: string;

    DiaryID?: number;
    Diary?: DiaryPatInterface;

    EmotionID?: number[];  // Array of Emotion IDs
}


export interface CrossSectionalInterfaceForPsy { //รับมาแบบไดอารี่1เล่ม ที่มีCross หลายเรคคอร์ด
    ID?: number,
    IsPublic?: boolean,
    Name?: string,
    Picture?: string,
    Start?: string,
    End?: string,

    Patient?: PatientInterface;
    CrossSectionals: CrossSectionalInterface[];
    
}