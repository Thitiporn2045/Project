import { PsychologistInterface } from "./IPsychologist";

export interface TypeOfPatientInterface{
    ID?: number;
    Name?: string;

    PsyID?: number;
    Psychologist?: PsychologistInterface;
}