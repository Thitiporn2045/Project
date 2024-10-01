import { PsychologistInterface } from "../psychologist/IPsychologist";

export interface TypeOfPatientInterface{
    ID?: string;
    Name?: string;

    PsyID?: number;
    Psychologist?: PsychologistInterface;
}