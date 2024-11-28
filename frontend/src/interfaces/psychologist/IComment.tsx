import { DiaryPatInterface } from "../diary/IDiary";
import { PsychologistInterface } from "./IPsychologist";

export interface CommentInterface{
    ID?: number;
    Comment?: string;

    PsyID?: number;
    Psychologist?: PsychologistInterface;

    DiaryID?: number;
    Diary?: DiaryPatInterface;
}