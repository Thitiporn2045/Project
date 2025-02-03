import { PsychologistInterface } from "./IPsychologist";

export interface WorkScheduleInterface{
    ID?: number,
    Topic?: string;
    Date?: string;
    StartTime?: string;
    EndTime?: string;

    PsyID?: number;
    Psychologist?: PsychologistInterface;
}